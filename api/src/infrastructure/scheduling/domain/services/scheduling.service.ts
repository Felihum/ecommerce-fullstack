import {
    Injectable,
    Logger,
    OnModuleInit,
} from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { CronExpressionParser } from 'cron-parser';
import { JobRegistry } from './job.registry';
import { type ScheduledJobRepositoryInterface } from '../contracts/scheduled-job.repository';
import { ScheduledJob } from '../models/scheduled-job.entity';
import { ScheduledJobSynchronizer } from './scheduled-jobs-synchronizer.service';

@Injectable()
export class SchedulingService implements OnModuleInit {

    private readonly logger = new Logger(SchedulingService.name);

    private readonly POLLING_INTERVAL = 5000;
    private readonly BATCH_SIZE = 10;

    private readonly LOCK_DURATION_SECONDS = 300;

    private readonly INITIAL_RETRY_DELAY_SECONDS = 30;
    private readonly MAX_RETRY_DELAY_SECONDS = 900;

    private readonly workerId = crypto.randomUUID();

    private isPolling = false;

    constructor(
        private readonly repository: ScheduledJobRepositoryInterface,
        private readonly registry: JobRegistry,
        private readonly synchronizer: ScheduledJobSynchronizer,
    ) {}

    onModuleInit(): void {
        this.logger.log(
            `Scheduling service initialized. Worker ID: ${this.workerId}`,
        );

        this.logger.log(
            `Registered executors: ${this.registry.getRegisteredSlugs().join(', ')}`,
        );
    }

    @Interval(5000)
    async processScheduledJobs(): Promise<void> {
        if (!this.synchronizer.isReady()) {
            return;
        }

        if (this.isPolling) {
            return;
        }

        this.isPolling = true;

        try {

            const jobs = await this.repository.claimDueJobs(
                this.workerId,
                this.BATCH_SIZE,
                this.LOCK_DURATION_SECONDS,
            );

            if (jobs.length === 0) {
                return;
            }

            this.logger.log(
                `${jobs.length} scheduled job(s) claimed.`,
            );

            for (const job of jobs) {
                await this.executeJob(job);
            }

        } catch (error) {

            this.logger.error(
                'Error while processing scheduled jobs.',
                error instanceof Error ? error.stack : String(error),
            );

        } finally {
            this.isPolling = false;
        }
    }

    private async executeJob(job: ScheduledJob): Promise<void> {

        this.logger.log(`Executing scheduled job: ${job.slug}`);

        try {

            const executor = this.registry.get(job.slug);

            if (!executor) {
                throw new Error(
                    `No executor registered for job: ${job.slug}`,
                );
            }

            await executor.execute();

            const nextExecutionAt = this.calculateNextExecution(
                job,
            );

            await this.repository.markAsExecuted(
                job.id.toString(),
                this.workerId,
                nextExecutionAt,
            );

            this.logger.log(
                `Job "${job.slug}" executed successfully. Next execution: ${
                    nextExecutionAt?.toISOString() ?? 'disabled'
                }`,
            );

        } catch (error) {

            await this.handleExecutionFailure(job, error);

        }
    }

    private calculateNextExecution(
        job: ScheduledJob,
    ): Date {

        const expression = CronExpressionParser.parse(
            job.cronExpression,
            {
                currentDate: new Date(),
                tz: job.timezone,
            },
        );

        return expression.next().toDate();
    }

    private async handleExecutionFailure(
        job: ScheduledJob,
        error: unknown,
    ): Promise<void> {

        const errorMessage = error instanceof Error
            ? error.message
            : String(error);

        const retryDelay = this.calculateRetryDelay(
            job.attempts,
        );

        const retryAt = new Date(
            Date.now() + retryDelay * 1000,
        );

        this.logger.error(
            `Job "${job.slug}" failed. Retry scheduled for ${retryAt.toISOString()}. Error: ${errorMessage}`,
        );

        try {

            await this.repository.markAsFailed(
                job.id.toString(),
                this.workerId,
                errorMessage,
                retryAt,
            );

        } catch (repositoryError) {

            this.logger.error(
                `Could not update failed job "${job.slug}". Its lock will expire automatically.`,
                repositoryError instanceof Error
                    ? repositoryError.stack
                    : String(repositoryError),
            );
        }
    }

    private calculateRetryDelay(attempts: number): number {

        const delay = this.INITIAL_RETRY_DELAY_SECONDS
            * Math.pow(2, Math.max(0, attempts - 1));

        return Math.min(
            delay,
            this.MAX_RETRY_DELAY_SECONDS,
        );
    }
}

import {
    Injectable,
    Logger,
    OnApplicationBootstrap,
} from '@nestjs/common';
import { CronExpressionParser } from 'cron-parser';
import { type ScheduledJobRepositoryInterface } from '../contracts/scheduled-job.repository';
import { JobRegistry } from './job.registry';

@Injectable()
export class ScheduledJobSynchronizer
    implements OnApplicationBootstrap {

    private readonly logger = new Logger(
        ScheduledJobSynchronizer.name,
    );

    private synchronized = false;

    constructor(
        private readonly registry: JobRegistry,
        private readonly repository: ScheduledJobRepositoryInterface,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        await this.synchronize();
    }

    isReady(): boolean {
        return this.synchronized;
    }

    async synchronize(): Promise<void> {

        const executors = this.registry.getAll();

        const definitions = executors.map((executor) => {

            const timezone = executor.schedule.timezone
                ?? 'UTC';

            const nextExecutionAt = CronExpressionParser
                .parse(executor.schedule.cronExpression, {
                    currentDate: new Date(),
                    tz: timezone,
                })
                .next()
                .toDate();

            return {
                slug: executor.slug,
                cronExpression: executor.schedule.cronExpression,
                timezone,
                enabled: executor.schedule.enabled ?? true,
                nextExecutionAt,
            };
        });

        await this.repository.synchronizeDefinitions(definitions);
        this.synchronized = true;
        
        this.logger.log(
            `${definitions.length} scheduled job(s) synchronized.`,
        );
    }
}

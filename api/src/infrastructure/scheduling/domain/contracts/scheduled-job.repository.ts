import { ScheduledJob } from "../models/scheduled-job.entity";

export interface ScheduledJobRepositoryInterface {
    findById(id: string): Promise<ScheduledJob | null>;
    findBySlug(slug: string): Promise<ScheduledJob | null>;
    claimDueJobs(workerId: string, limit: number, lockDurationSeconds: number): Promise<ScheduledJob[]>;
    markAsExecuted(id: string, workerId: string, nextExecutionAt: Date | null): Promise<void>;
    markAsFailed(id: string, workerId: string, error: string, retryAt: Date): Promise<void>;
    releaseLock(id: string, workerId: string): Promise<void>;
}

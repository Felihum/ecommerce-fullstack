
export interface JobSchedule {
    cronExpression: string;
    timezone?: string;
    enabled?: boolean;
}

export interface JobExecutor {
    readonly slug: string;
    readonly schedule: JobSchedule;

    execute(): Promise<void>;
}

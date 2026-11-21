export interface JobExecutor {
    readonly slug: string;

    execute(): Promise<void>;
}
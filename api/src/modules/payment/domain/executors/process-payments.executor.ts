import { JobExecutor } from "@infrastructure/scheduling/domain/contracts/job-executor.interface";
import { Logger } from "@nestjs/common";

export class ProcessPaymentsExecutor implements JobExecutor {
    slug = "process-payments";
    readonly schedule = {
        cronExpression: '*/5 * * * *',
        timezone: 'America/Sao_Paulo',
        enabled: true,
    };


    async execute(): Promise<void> {
        Logger.debug("Executing ProcessPaymentsExecutor job...");
        return
    }
}
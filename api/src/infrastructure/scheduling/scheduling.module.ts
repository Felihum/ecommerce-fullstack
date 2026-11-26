import { Module } from "@nestjs/common";
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { TypeOrmTransactionContext } from "@infrastructure/database/typeorm/typeorm-transaction-context";
import { SchedulingService } from "./domain/services/scheduling.service";
import { ScheduledJobEntity, ScheduledJobTypeormRepository } from "./infrastructure/scheduled-job.typeorm.repository";
import { ScheduledJobRepositoryInterface } from "./domain/contracts/scheduled-job.repository";
import { JobRegistry } from "./domain/services/job.registry";
import { DatabaseModule } from "@infrastructure/database/typeorm/typeorm.module";
import { PaymentModule } from "@modules/payment/payment.module";
import { ProcessPaymentsExecutor } from "@modules/payment/domain/executors/process-payments.executor";
import { ScheduledJobSynchronizer } from "./domain/services/scheduled-jobs-synchronizer.service";

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([
      ScheduledJobEntity,
    ]),
    PaymentModule,
  ],

  providers: [
    TypeOrmTransactionContext,
    {
      provide: ScheduledJobTypeormRepository,
      useFactory: (
        repository: Repository<ScheduledJobEntity>,
        datasource: DataSource
      ) => new ScheduledJobTypeormRepository(
        repository,
        datasource
      ),
      inject: [
        getRepositoryToken(ScheduledJobEntity),
        DataSource,
      ],
    },
    {
      provide: SchedulingService,
      useFactory: (
        scheduledJobRepository: ScheduledJobRepositoryInterface,
        jobRegistry: JobRegistry,
        synchronizer: ScheduledJobSynchronizer,
      ) => new SchedulingService(
        scheduledJobRepository,
        jobRegistry,
        synchronizer
      ),
      inject: [
        ScheduledJobTypeormRepository,
        JobRegistry,
        ScheduledJobSynchronizer,
      ],
    },
    {
      provide: JobRegistry,
      useFactory: (
          paymentExecutor: ProcessPaymentsExecutor,
      ) => new JobRegistry([
          paymentExecutor,
      ]),
      inject: [
          ProcessPaymentsExecutor,
      ]
    },
    {
      provide: ScheduledJobSynchronizer,
      useFactory: (
        jobRegistry: JobRegistry,
        scheduledJobRepository: ScheduledJobRepositoryInterface,
      ) => new ScheduledJobSynchronizer(
        jobRegistry,
        scheduledJobRepository,
      ),
      inject: [
        JobRegistry,
        ScheduledJobTypeormRepository,
      ],
    }
  ],

  exports: [
    SchedulingService,
    JobRegistry,
  ],
})
export class SchedulingModule {}

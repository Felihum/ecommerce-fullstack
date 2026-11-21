import { Module } from "@nestjs/common";
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { TypeOrmTransactionContext } from "@infrastructure/database/typeorm/typeorm-transaction-context";
import { SchedulingService } from "./domain/services/scheduling.service";
import { ScheduledJobEntity, ScheduledJobTypeormRepository } from "./infrastructure/scheduled-job.typeorm.repository";
import { ScheduledJobRepositoryInterface } from "./domain/contracts/scheduled-job.repository";
import { JobRegistry } from "./domain/services/job.registry";
import { JobExecutor } from "./domain/contracts/job-executor.interface";

export const SCHEDULED_JOB_TOKEN = {
  SCHEDULED_JOB_REPOSITORY: Symbol("SCHEDULED_JOB_REPOSITORY"),
  JOB_REGISTRY: Symbol("JOB_REGISTRY")
};

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ScheduledJobEntity,
    ]),
  ],

  providers: [
    TypeOrmTransactionContext,
    {
      provide: SCHEDULED_JOB_TOKEN.SCHEDULED_JOB_REPOSITORY,
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
        jobRegistry: JobRegistry
      ) => new SchedulingService(
        scheduledJobRepository,
        jobRegistry
      ),
      inject: [
        SCHEDULED_JOB_TOKEN.SCHEDULED_JOB_REPOSITORY,
        SCHEDULED_JOB_TOKEN.JOB_REGISTRY,
      ],
    },
    {
      provide: SCHEDULED_JOB_TOKEN.JOB_REGISTRY,
      useFactory: (
        registeredExecutors: JobExecutor[],
      ) => new JobRegistry(
        registeredExecutors,
      ),
    //   inject: [
    //     
    //   ],
    },
  ],

  exports: [
    SchedulingService,
    JobRegistry,
  ],
})
export class SchedulingModule {}

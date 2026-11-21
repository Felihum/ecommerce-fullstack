import { DatabaseModule } from '@infrastructure/database/typeorm/typeorm.module';
import { SchedulingModule } from '@infrastructure/scheduling/scheduling.module';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [
        DatabaseModule,
        ScheduleModule.forRoot(),
        SchedulingModule,
    ],
})
export class WorkerModule {}
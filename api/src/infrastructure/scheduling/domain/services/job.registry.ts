import { Injectable, OnModuleInit } from '@nestjs/common';
import { JobExecutor } from '../contracts/job-executor.interface';

@Injectable()
export class JobRegistry implements OnModuleInit {

    private readonly executors = new Map<string, JobExecutor>();

    constructor(
        private readonly registeredExecutors: JobExecutor[],
    ) {}

    onModuleInit(): void {
        for (const executor of this.registeredExecutors) {

            if (this.executors.has(executor.slug)) {
                throw new Error(
                    `Duplicate job executor: ${executor.slug}`,
                );
            }

            this.executors.set(executor.slug, executor);
        }
    }

    get(slug: string): JobExecutor | null {
        return this.executors.get(slug) ?? null;
    }

    has(slug: string): boolean {
        return this.executors.has(slug);
    }

    getRegisteredSlugs(): string[] {
        return [...this.executors.keys()];
    }
}

import { Module } from '@nestjs/common';
import { S3StorageService } from './s3/s3.service';
import { S3Client } from '@aws-sdk/client-s3';
import { EnvSchema } from '@config/env.schema';

const endpoint = EnvSchema.S3_ENDPOINT;

@Module({
  providers: [
    {
        provide: S3StorageService,
        useFactory: () => new S3StorageService(
            new S3Client({
                region: EnvSchema.S3_REGION,

                ...(endpoint && {
                    endpoint,
                    forcePathStyle: true,
                }),

                credentials: {
                    accessKeyId: EnvSchema.S3_ACCESS_KEY_ID,
                    secretAccessKey: EnvSchema.S3_SECRET_ACCESS_KEY,
                },
            })
        )
    },
  ],
  exports: [
    S3StorageService,
  ],
})
export class S3StorageModule {}
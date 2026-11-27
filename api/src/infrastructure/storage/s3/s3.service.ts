import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { StorageServiceInterface } from '../contracts/storage.service';

export class S3StorageService implements StorageServiceInterface{
  private readonly bucket = process.env.S3_BUCKET_NAME!;

  constructor(
    private readonly s3Client: S3Client,
  ) {}

  async upload(
    key: string,
    file: Buffer,
    contentType: string,
  ): Promise<void> {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ContentType: contentType,
      }),
    );
  }

  async delete(key: string): Promise<void> {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }
}
export interface StorageServiceInterface {
    upload(key: string, file: Buffer, contentType: string): Promise<void>;
    delete(key: string): Promise<void>;
}
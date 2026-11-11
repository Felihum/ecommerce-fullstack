export interface PasswordHasherInterface{
    encrypt(password: string): Promise<string>;
    compare(input: string, target: string): Promise<boolean>;
}
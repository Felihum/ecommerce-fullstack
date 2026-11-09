export interface PasswordHasherInterface{
    encrypt(password: string): string;
    compare(input: string, target: string): boolean;
}
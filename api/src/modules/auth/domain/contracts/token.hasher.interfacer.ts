export interface TokenHasherInterface{
    encrypt(token: string): string;
    compare(input: string, target: string): boolean;
}
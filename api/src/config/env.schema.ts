export const EnvSchema = {
    NODE_ENV: process.env.NODE_ENV as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    DATABASE_HOST: process.env.DATABASE_HOST as string,
    DATABASE_TYPE: process.env.DATABASE_TYPE as string,
    POSTGRES_PORT: Number(process.env.POSTGRES_PORT),
    POSTGRES_USER: process.env.POSTGRES_USER as string,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD as string,
    POSTGRES_DB: process.env.POSTGRES_DB as string,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
}
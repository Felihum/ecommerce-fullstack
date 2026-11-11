export const EnvSchema = {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_TYPE: process.env.DATABASE_TYPE,
    POSTGRES_PORT: process.env.POSTGRES_PORT ?? 5432,
    POSTGRES_USER: process.env.POSTGRES_USER ?? "ecommerce-api",
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD ?? "ecommerce-api",
    POSTGRES_DB: process.env.POSTGRES_DB ?? "ecommerce-api",
}
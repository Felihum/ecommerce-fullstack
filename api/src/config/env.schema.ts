import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z.string().default("development"),

    DATABASE_URL: z.string().optional(),
    DATABASE_HOST: z.string().min(1),
    DATABASE_TYPE: z.string().default("postgres"),

    POSTGRES_PORT: z.coerce.number().int().positive(),
    POSTGRES_USER: z.string().min(1),
    POSTGRES_PASSWORD: z.string().min(1),
    POSTGRES_DB: z.string().min(1),

    JWT_ACCESS_SECRET: z.string().min(1),
    JWT_REFRESH_SECRET: z.string().min(1),
});

export const EnvSchema = envSchema.parse(process.env);
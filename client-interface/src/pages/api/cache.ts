import Redis from "ioredis";

export const cache = new Redis({
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    host: process.env.REDIS_HOST || "127.0.0.1",
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
});

export const hasValidRedisEnvs = (): boolean => {
    return !!process.env.REDIS_USER_NAME && !!process.env.REDIS_PASSWORD;
};

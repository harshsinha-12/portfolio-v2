import { createClient } from "redis";

async function connectToRedis() {
  const username = process.env.REDIS_USERNAME;
  const password = process.env.REDIS_PASSWORD;
  const host = process.env.REDIS_HOST;
  const port = Number(process.env.REDIS_PORT);

  if (!username || !password || !host || !Number.isInteger(port)) {
    throw new Error("Redis environment variables are incomplete");
  }

  const socketOptions = {
    host,
    port,
    connectTimeout: 5_000,
    reconnectStrategy(retries: number) {
      return retries >= 2 ? false : Math.min(retries * 100, 500);
    },
  };

  const client = createClient({
    username,
    password,
    socket:
      process.env.REDIS_TLS === "true"
        ? { ...socketOptions, tls: true as const }
        : socketOptions,
  });

  client.on("error", () => {
    // The API route returns a quiet fallback without leaking connection data.
  });

  await client.connect();
  return client;
}

let redisClientPromise: ReturnType<typeof connectToRedis> | undefined;

export function getRedisClient() {
  redisClientPromise ??= connectToRedis().catch((error) => {
    redisClientPromise = undefined;
    throw error;
  });

  return redisClientPromise;
}

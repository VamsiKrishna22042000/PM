import { createClient } from "redis";

export const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 500),
  },
});

redisClient.on("connect", () => {
  console.log("Redis connected");
});

redisClient.on("error", (err) => {
  console.error("Redis error", err);
});

export async function initRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

export default redisClient;

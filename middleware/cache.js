// This code is a rate limiter middleware that limits the number of requests a user can make in a given time period. Here is a breakdown of the code:
import { createClient } from "redis";

// The code uses the Redis client to store and retrieve user request counts and timestamps. Redis is an in-memory data store that is often used for caching and rate limiting.
const client = createClient({
  password: process.env.REDIS_PASS,
  socket: {
    host: "redis-12924.c54.ap-northeast-1-2.ec2.cloud.redislabs.com",
    port: 12924,
  },
});

client.on("error", (err) => console.log("Redis Client Error", err));

client.connect();

export const cache = async (req, res, next) => {
  // The middleware first checks if the userId property exists on the req object. If it does not exist, it returns a 401 response with an "Unauthorized" message.
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized, no user ID found" });
  }

  // If the userId property exists, the middleware gets the number of requests the user has made by using Redis's get method. The key used to store the user's request count is in the format of user-${userId}. The Number function is used to convert the value to a number.
  const reqsDone = Number(await client.get(`user-${userId}`));

  // If the user has made more than 10 requests, the middleware checks the timestamp of the first request by using the get method again with the key of time-${userId}. If the time difference between the current time and the timestamp is less than an hour, it returns a 401 response with a "Request quota exceeded" message. If the time difference is greater than or equal to an hour, the middleware resets the request count to 1 and updates the timestamp by using the set method.
  if (reqsDone > 10) {
    const stTime = await client.get(`time-${userId}`);
    var difference = new Date(stTime) - Date.now();
    var hoursDifference = Math.floor(difference / 1000 / 60 / 60);
    if (hoursDifference >= 1) {
      await client.set(`user-${userId}`, 1);
      await client.set(`time-${userId}`, Date.now().toString());
      next();
    } else {
      return res.status(401).json({ message: "Request quota exceeded" });
    }
  } else {
    // If the user has made 10 or fewer requests, the middleware increments the user's request count by 1 by using the set method and the next callback is called to move the request to the next middleware.
    await client.set(`user-${userId}`, reqsDone + 1);
    next();
  }
};

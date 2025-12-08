const redis = require('redis');

const redisClient = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST || 'redis', // Use Docker service name
        port: process.env.REDIS_PORT || 6379,
        connectTimeout: 10000, // 10 seconds timeout
        lazyConnect: true,
        retryStrategy: (times) => {
            const delay = Math.min(times * 50, 2000);
            console.log(`Redis connection attempt ${times}, retrying in ${delay}ms`);
            return delay;
        }
    }
});

// Handle connection events
redisClient.on('connect', () => {
    console.log('Redis client connected');
});

redisClient.on('error', (err) => {
    console.log('Redis Client Error:', err.message);
});

redisClient.on('ready', () => {
    console.log('Redis client ready');
});

// Export for use in other files
module.exports = redisClient;
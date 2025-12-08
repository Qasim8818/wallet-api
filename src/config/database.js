// Change from container names to localhost
const redisConfig = {
    host: 'localhost',  // instead of 'redis'
    port: 6379
};

const mongoConfig = {
    url: 'mongodb://localhost:27017/yourdb'  // instead of 'mongo:27017'
};

const postgresConfig = {
    host: 'localhost',  // instead of 'postgres'
    port: 5432,
    // ... other config
};

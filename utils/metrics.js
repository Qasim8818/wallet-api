// utils/metrics.js
// Prometheus metrics for monitoring

const promClient = require('prom-client');
const config = require('./config');

// Create a Registry which registers the metrics
const register = new promClient.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
    app: 'wallet-api'
});

// Enable the collection of default metrics
promClient.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDuration = new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.5, 1, 2, 5, 10]
});

const walletOperationsTotal = new promClient.Counter({
    name: 'wallet_operations_total',
    help: 'Total number of wallet operations',
    labelNames: ['operation', 'status']
});

const activeConnections = new promClient.Gauge({
    name: 'active_connections',
    help: 'Number of active connections'
});

const cacheHitsTotal = new promClient.Counter({
    name: 'cache_hits_total',
    help: 'Total number of cache hits',
    labelNames: ['cache_type']
});

const cacheMissesTotal = new promClient.Counter({
    name: 'cache_misses_total',
    help: 'Total number of cache misses',
    labelNames: ['cache_type']
});

const dbQueryDuration = new promClient.Histogram({
    name: 'db_query_duration_seconds',
    help: 'Duration of database queries in seconds',
    labelNames: ['operation', 'collection'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5]
});

// Register metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(walletOperationsTotal);
register.registerMetric(activeConnections);
register.registerMetric(cacheHitsTotal);
register.registerMetric(cacheMissesTotal);
register.registerMetric(dbQueryDuration);

// Middleware to collect HTTP metrics
const metricsMiddleware = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = (Date.now() - start) / 1000;
        httpRequestDuration
            .labels(req.method, req.route?.path || req.path, res.statusCode.toString())
            .observe(duration);
    });

    next();
};

// Helper functions to record metrics
const recordWalletOperation = (operation, status) => {
    walletOperationsTotal.labels(operation, status).inc();
};

const recordCacheHit = (cacheType) => {
    cacheHitsTotal.labels(cacheType).inc();
};

const recordCacheMiss = (cacheType) => {
    cacheMissesTotal.labels(cacheType).inc();
};

const recordDbQuery = async (operation, collection, queryFn) => {
    const start = Date.now();
    try {
        const result = await queryFn();
        const duration = (Date.now() - start) / 1000;
        dbQueryDuration.labels(operation, collection).observe(duration);
        return result;
    } catch (error) {
        const duration = (Date.now() - start) / 1000;
        dbQueryDuration.labels(operation, collection).observe(duration);
        throw error;
    }
};

module.exports = {
    register,
    metricsMiddleware,
    recordWalletOperation,
    recordCacheHit,
    recordCacheMiss,
    recordDbQuery,
    activeConnections
};

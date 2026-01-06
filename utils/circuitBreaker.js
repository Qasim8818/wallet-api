// utils/circuitBreaker.js
// Circuit breaker pattern for database operations

class CircuitBreaker {
    constructor(options = {}) {
        this.failureThreshold = options.failureThreshold || 5;
        this.recoveryTimeout = options.recoveryTimeout || 60000; // 1 minute
        this.monitoringPeriod = options.monitoringPeriod || 10000; // 10 seconds

        this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
        this.failures = 0;
        this.lastFailureTime = null;
        this.successCount = 0;
        this.nextAttempt = null;
    }

    async execute(operation) {
        if (this.state === 'OPEN') {
            if (Date.now() < this.nextAttempt) {
                throw new Error('Circuit breaker is OPEN');
            }
            this.state = 'HALF_OPEN';
        }

        try {
            const result = await operation();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }

    onSuccess() {
        this.failures = 0;
        this.successCount++;
        if (this.state === 'HALF_OPEN') {
            this.state = 'CLOSED';
            console.log('Circuit breaker CLOSED');
        }
    }

    onFailure() {
        this.failures++;
        this.lastFailureTime = Date.now();

        if (this.failures >= this.failureThreshold) {
            this.state = 'OPEN';
            this.nextAttempt = Date.now() + this.recoveryTimeout;
            console.log(`Circuit breaker OPEN for ${this.recoveryTimeout}ms`);
        }
    }

    getState() {
        return {
            state: this.state,
            failures: this.failures,
            successCount: this.successCount,
            nextAttempt: this.nextAttempt
        };
    }
}

module.exports = CircuitBreaker;

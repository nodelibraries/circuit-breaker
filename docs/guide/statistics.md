# Statistics

The circuit breaker tracks detailed statistics for all operations. You can access these statistics to monitor the health and performance of your circuit breakers.

## Getting Statistics

Use the `getCircuitBreakerStats()` method to get statistics for all circuit breakers:

```typescript
const stats = circuitBreaker.getCircuitBreakerStats();
console.log(stats);
```

## Statistics Structure

The statistics object contains information for each circuit breaker:

```typescript
{
  'External::fetchUserData': {
    fires: 100,           // Total requests made
    cacheHits: 0,         // Number of cache hits
    cacheMisses: 0,       // Number of cache misses
    rejects: 5,           // Number of rejected requests (circuit open)
    failures: 10,         // Number of failed requests
    timeouts: 2,          // Number of timed out requests
    successes: 88,        // Number of successful requests
    semaphoreLocked: 0,   // Number of times semaphore was locked
    percentiles: {        // Percentile calculations
      '0': 10,
      '1': 15,
      '0.25': 20,
      '0.5': 25,
      '0.75': 30,
      '0.9': 35,
      '0.95': 40,
      '0.99': 50,
      '0.995': 55,
      '1': 100
    },
    latencyTimes: [10, 15, 20, 25, 30, ...], // Array of latency times
    latencyMean: 25,      // Mean latency
    // ... more statistics
  }
}
```

## Example: Basic Statistics

```typescript
import { CircuitBreaker, CircuitBreakerLevel } from '@nodelibraries/circuit-breaker';

const circuitBreaker = new CircuitBreaker();

// Execute some requests
for (let i = 0; i < 100; i++) {
  await circuitBreaker.execute({
    level: CircuitBreakerLevel.External,
    name: 'myService',
    requestFn: async () => {
      // Your async operation
      return await fetchData();
    },
  });
}

// Get statistics
const stats = circuitBreaker.getCircuitBreakerStats();
const serviceStats = stats['External::myService'];

console.log('Total requests:', serviceStats.fires);
console.log('Successful:', serviceStats.successes);
console.log('Failed:', serviceStats.failures);
console.log('Rejected:', serviceStats.rejects);
console.log('Timeouts:', serviceStats.timeouts);
```

## Example: Monitoring Dashboard

```typescript
function getServiceHealth(stats: Record<string, any>, serviceName: string) {
  const serviceStats = stats[serviceName];
  if (!serviceStats) {
    return { status: 'unknown', message: 'No statistics available' };
  }

  const totalRequests = serviceStats.fires;
  const failures = serviceStats.failures;
  const rejects = serviceStats.rejects;
  const timeouts = serviceStats.timeouts;
  const successes = serviceStats.successes;

  const failureRate =
    totalRequests > 0 ? ((failures + timeouts) / totalRequests) * 100 : 0;

  if (serviceStats.state === 'open') {
    return {
      status: 'open',
      message: 'Circuit breaker is open',
      failureRate: failureRate.toFixed(2) + '%',
    };
  }

  if (failureRate > 50) {
    return {
      status: 'unhealthy',
      message: 'High failure rate detected',
      failureRate: failureRate.toFixed(2) + '%',
    };
  }

  return {
    status: 'healthy',
    message: 'Service is operating normally',
    failureRate: failureRate.toFixed(2) + '%',
    successRate: ((successes / totalRequests) * 100).toFixed(2) + '%',
  };
}

// Usage
const stats = circuitBreaker.getCircuitBreakerStats();
const health = getServiceHealth(stats, 'External::myService');
console.log('Service Health:', health);
```

## Example: Logging Statistics

```typescript
function logStatistics(stats: Record<string, any>) {
  Object.entries(stats).forEach(([name, serviceStats]) => {
    console.log(`\n=== ${name} ===`);
    console.log(`Total Requests: ${serviceStats.fires}`);
    console.log(`Successful: ${serviceStats.successes}`);
    console.log(`Failed: ${serviceStats.failures}`);
    console.log(`Rejected: ${serviceStats.rejects}`);
    console.log(`Timeouts: ${serviceStats.timeouts}`);
    console.log(`Mean Latency: ${serviceStats.latencyMean}ms`);
    console.log(`State: ${serviceStats.state}`);
  });
}

// Log statistics periodically
setInterval(() => {
  const stats = circuitBreaker.getCircuitBreakerStats();
  logStatistics(stats);
}, 60000); // Every minute
```

## Example: Metrics Export

```typescript
function exportMetrics(stats: Record<string, any>) {
  const metrics = Object.entries(stats).map(([name, serviceStats]) => ({
    name,
    fires: serviceStats.fires,
    successes: serviceStats.successes,
    failures: serviceStats.failures,
    rejects: serviceStats.rejects,
    timeouts: serviceStats.timeouts,
    latencyMean: serviceStats.latencyMean,
    state: serviceStats.state,
    timestamp: new Date().toISOString(),
  }));

  // Send to monitoring system
  sendToMonitoring(metrics);
}

// Export metrics periodically
setInterval(() => {
  const stats = circuitBreaker.getCircuitBreakerStats();
  exportMetrics(stats);
}, 30000); // Every 30 seconds
```

## Example: Health Check Endpoint

```typescript
import express from 'express';

const app = express();

app.get('/health/circuit-breakers', (req, res) => {
  const stats = circuitBreaker.getCircuitBreakerStats();

  const health = Object.entries(stats).map(([name, serviceStats]) => ({
    name,
    state: serviceStats.state,
    totalRequests: serviceStats.fires,
    successRate:
      serviceStats.fires > 0
        ? ((serviceStats.successes / serviceStats.fires) * 100).toFixed(2) + '%'
        : '0%',
    failureRate:
      serviceStats.fires > 0
        ? ((serviceStats.failures / serviceStats.fires) * 100).toFixed(2) + '%'
        : '0%',
    meanLatency: serviceStats.latencyMean + 'ms',
  }));

  res.json({
    status: 'ok',
    circuitBreakers: health,
  });
});
```

## Available Statistics

- `fires`: Total number of requests
- `cacheHits`: Number of cache hits
- `cacheMisses`: Number of cache misses
- `rejects`: Number of rejected requests (circuit open)
- `failures`: Number of failed requests
- `timeouts`: Number of timed out requests
- `successes`: Number of successful requests
- `semaphoreLocked`: Number of times semaphore was locked
- `percentiles`: Percentile calculations (0, 1, 0.25, 0.5, 0.75, 0.9, 0.95, 0.99, 0.995, 1)
- `latencyTimes`: Array of latency times
- `latencyMean`: Mean latency
- `state`: Current state of the circuit breaker ('open', 'closed', 'halfOpen')

## Next Steps

- Learn about [Configuration Options](/guide/configuration)
- Explore [Examples](/examples/)
- Check out [API Reference](/api/)

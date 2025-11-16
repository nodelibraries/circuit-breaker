# Advanced Configuration

Example showing advanced configuration options for **@nodelibraries/circuit-breaker**.

## Custom Timeout and Error Threshold

```typescript
import { CircuitBreaker, CircuitBreakerLevel } from '@nodelibraries/circuit-breaker';

const circuitBreaker = new CircuitBreaker();

const result = await circuitBreaker.execute({
  level: CircuitBreakerLevel.External,
  name: 'criticalService',
  requestFn: criticalService,
  args: [data],
  options: {
    timeout: 5000, // 5 seconds timeout
    errorThresholdPercentage: 30, // Open after 30% failures (more sensitive)
    resetTimeout: 60000, // Wait 60 seconds before retrying
  },
});
```

## Error Filter

Ignore specific errors from triggering the circuit breaker:

```typescript
const result = await circuitBreaker.execute({
  level: CircuitBreakerLevel.External,
  name: 'apiService',
  requestFn: apiService,
  args: [data],
  options: {
    errorFilter: (error) => {
      // Ignore 404 errors (not found) - don't count as failures
      if (error.response?.status === 404) {
        return true; // This error won't count as a failure
      }
      // Ignore 400 errors (bad request) - don't count as failures
      if (error.response?.status === 400) {
        return true;
      }
      return false; // Other errors will count as failures
    },
  },
});
```

## Volume Threshold

Require a minimum number of requests before the circuit can open:

```typescript
const result = await circuitBreaker.execute({
  level: CircuitBreakerLevel.External,
  name: 'apiService',
  requestFn: apiService,
  args: [data],
  options: {
    volumeThreshold: 10, // Need at least 10 requests before opening
    errorThresholdPercentage: 50,
  },
});
```

## Caching

Enable caching of successful responses:

```typescript
const result = await circuitBreaker.execute({
  level: CircuitBreakerLevel.External,
  name: 'apiService',
  requestFn: apiService,
  args: [data],
  options: {
    cache: true, // Enable caching
    cacheTTL: 60000, // Cache for 60 seconds
  },
});
```

## Capacity (Concurrent Requests)

Limit the number of concurrent requests:

```typescript
const result = await circuitBreaker.execute({
  level: CircuitBreakerLevel.External,
  name: 'apiService',
  requestFn: apiService,
  args: [data],
  options: {
    capacity: 10, // Max 10 concurrent requests
  },
});
```

## Warm Up

Prevent early circuit opening by ignoring initial failures:

```typescript
const result = await circuitBreaker.execute({
  level: CircuitBreakerLevel.External,
  name: 'apiService',
  requestFn: apiService,
  args: [data],
  options: {
    allowWarmUp: true, // Ignore failures during warm-up period
  },
});
```

## Complete Advanced Example

```typescript
import { CircuitBreaker, CircuitBreakerLevel } from '@nodelibraries/circuit-breaker';
import axios from 'axios';

const circuitBreaker = new CircuitBreaker({
  timeout: () => console.error('Request timeout'),
  failure: () => console.error('Request failed'),
  open: () => console.error('Circuit breaker opened'),
  close: () => console.log('Circuit breaker closed'),
});

async function fetchUserData(userId: number) {
  const response = await axios.get(`https://api.example.com/users/${userId}`);
  return response.data;
}

async function fallbackUserData(userId: number) {
  return {
    id: userId,
    name: 'Unknown User',
    email: 'unknown@example.com',
    status: 'fallback',
  };
}

const user = await circuitBreaker.execute({
  level: CircuitBreakerLevel.External,
  name: 'fetchUserData',
  requestFn: fetchUserData,
  args: [userId],
  fallbackFn: fallbackUserData,
  fallbackFnArgs: [userId],
  options: {
    // Timeout configuration
    timeout: 5000, // 5 seconds

    // Error threshold
    errorThresholdPercentage: 50, // Open after 50% failures

    // Reset timeout
    resetTimeout: 30000, // Wait 30 seconds before retrying

    // Statistics window
    rollingCountTimeout: 10000, // Track stats over 10 seconds
    rollingCountBuckets: 10, // 10 buckets for statistics

    // Volume threshold
    volumeThreshold: 5, // Need at least 5 requests

    // Capacity
    capacity: 20, // Max 20 concurrent requests

    // Error filter
    errorFilter: (error) => {
      // Ignore 404 and 400 errors
      return error.response?.status === 404 || error.response?.status === 400;
    },

    // Caching
    cache: true,
    cacheTTL: 60000, // Cache for 60 seconds

    // Warm up
    allowWarmUp: true,
  },
});
```

## Monitoring and Statistics

```typescript
// Get statistics
const stats = circuitBreaker.getCircuitBreakerStats();
const serviceStats = stats['External::fetchUserData'];

console.log('Total requests:', serviceStats.fires);
console.log('Successful:', serviceStats.successes);
console.log('Failed:', serviceStats.failures);
console.log('Rejected:', serviceStats.rejects);
console.log('Timeouts:', serviceStats.timeouts);
console.log('Mean latency:', serviceStats.latencyMean + 'ms');
console.log('State:', serviceStats.state);

// Monitor percentiles
console.log('P50 latency:', serviceStats.percentiles['0.5']);
console.log('P95 latency:', serviceStats.percentiles['0.95']);
console.log('P99 latency:', serviceStats.percentiles['0.99']);
```

## Next Steps

- Learn about [Multiple Circuit Breakers](/examples/multiple)
- Explore [Error Handling](/examples/error-handling)

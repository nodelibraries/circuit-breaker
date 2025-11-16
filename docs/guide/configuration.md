# Configuration Options

You can customize the behavior of circuit breakers by providing options when executing a request.

## Available Options

All options are optional and have sensible defaults:

```typescript
interface Options {
  timeout?: number; // Max time (ms) for an operation to complete before failing
  errorThresholdPercentage?: number; // Failure rate (%) to trigger circuit breaker
  resetTimeout?: number; // Time (ms) before transitioning to "half-open" state
  rollingCountTimeout?: number; // Time window (ms) for tracking statistics
  rollingCountBuckets?: number; // Number of buckets in rollingCountTimeout window
  name?: string; // Custom name for the circuit breaker
  rollingPercentilesEnabled?: boolean; // Enables percentile calculations
  capacity?: number; // Max concurrent requests
  enabled?: boolean; // Enables circuit breaker on startup
  allowWarmUp?: boolean; // Prevents early circuit opening by ignoring failures initially
  volumeThreshold?: number; // Minimum requests before circuit breaker can open
  errorFilter?: (error: any) => boolean; // Ignores specific errors if function returns true
  cache?: boolean; // Enables caching of first successful response
  cacheTTL?: number; // Cache expiration time (ms), 0 means never expires
  cacheGetKey?: (...args: any[]) => string; // Defines cache key
  cacheTransport?: any; // Custom caching mechanism with get, set, flush methods
  abortController?: AbortController; // Uses AbortController to cancel async operations on timeout
  enableSnapshots?: boolean; // Enables snapshot events for statistics
  rotateBucketController?: EventEmitter; // Shares EventEmitter for multiple circuit breakers
}
```

## Default Values

```typescript
{
  timeout: 10000, // 10 seconds
  errorThresholdPercentage: 50, // 50%
  resetTimeout: 30000, // 30 seconds
  rollingCountTimeout: 10000, // 10 seconds
  rollingCountBuckets: 10,
  rollingPercentilesEnabled: true,
  capacity: Number.MAX_SAFE_INTEGER,
  enabled: true,
  allowWarmUp: false,
  volumeThreshold: 0,
  errorFilter: () => false,
  cache: false,
  cacheTTL: 0,
  enableSnapshots: true,
}
```

## Basic Configuration

```typescript
const result = await circuitBreaker.execute({
  name: 'myService',
  requestFn: myAsyncFunction,
  args: [],
  options: {
    timeout: 5000, // 5 seconds
    errorThresholdPercentage: 50, // Open after 50% failures
    resetTimeout: 30000, // Wait 30 seconds before retrying
  },
});
```

## Timeout Configuration

Control how long a request can take before timing out:

```typescript
// Short timeout for fast operations
await circuitBreaker.execute({
  name: 'fastOperation',
  requestFn: fastOperation,
  options: {
    timeout: 1000, // 1 second
  },
});

// Long timeout for slow operations
await circuitBreaker.execute({
  name: 'slowOperation',
  requestFn: slowOperation,
  options: {
    timeout: 60000, // 60 seconds
  },
});
```

## Error Threshold Configuration

Control when the circuit opens based on failure rate:

```typescript
// Open circuit after 30% failures (more sensitive)
await circuitBreaker.execute({
  name: 'criticalService',
  requestFn: criticalService,
  options: {
    errorThresholdPercentage: 30, // Open after 30% failures
  },
});

// Open circuit after 70% failures (less sensitive)
await circuitBreaker.execute({
  name: 'resilientService',
  requestFn: resilientService,
  options: {
    errorThresholdPercentage: 70, // Open after 70% failures
  },
});
```

## Reset Timeout Configuration

Control how long to wait before trying again:

```typescript
// Quick retry (10 seconds)
await circuitBreaker.execute({
  name: 'quickRetry',
  requestFn: myFunction,
  options: {
    resetTimeout: 10000, // 10 seconds
  },
});

// Slow retry (5 minutes)
await circuitBreaker.execute({
  name: 'slowRetry',
  requestFn: myFunction,
  options: {
    resetTimeout: 300000, // 5 minutes
  },
});
```

## Volume Threshold

Require a minimum number of requests before the circuit can open:

```typescript
// Require at least 10 requests before opening
await circuitBreaker.execute({
  name: 'myService',
  requestFn: myFunction,
  options: {
    volumeThreshold: 10, // Need at least 10 requests
  },
});
```

## Error Filter

Ignore specific errors from triggering the circuit breaker:

```typescript
await circuitBreaker.execute({
  name: 'myService',
  requestFn: myFunction,
  options: {
    errorFilter: (error) => {
      // Ignore 404 errors (not found)
      if (error.status === 404) {
        return true; // This error won't count as a failure
      }
      return false; // Other errors will count as failures
    },
  },
});
```

## Caching

Enable caching of successful responses:

```typescript
await circuitBreaker.execute({
  name: 'myService',
  requestFn: myFunction,
  options: {
    cache: true, // Enable caching
    cacheTTL: 60000, // Cache for 60 seconds
  },
});
```

## Capacity (Concurrent Requests)

Limit the number of concurrent requests:

```typescript
await circuitBreaker.execute({
  name: 'myService',
  requestFn: myFunction,
  options: {
    capacity: 10, // Max 10 concurrent requests
  },
});
```

## Warm Up

Prevent early circuit opening by ignoring initial failures:

```typescript
await circuitBreaker.execute({
  name: 'myService',
  requestFn: myFunction,
  options: {
    allowWarmUp: true, // Ignore failures during warm-up period
  },
});
```

## Complete Example

```typescript
const result = await circuitBreaker.execute({
  level: CircuitBreakerLevel.External,
  name: 'paymentGateway',
  requestFn: processPayment,
  args: [paymentData],
  fallbackFn: fallbackPayment,
  options: {
    timeout: 5000, // 5 seconds timeout
    errorThresholdPercentage: 50, // Open after 50% failures
    resetTimeout: 30000, // Wait 30 seconds before retrying
    rollingCountTimeout: 10000, // Track stats over 10 seconds
    rollingCountBuckets: 10, // 10 buckets for statistics
    volumeThreshold: 5, // Need at least 5 requests
    capacity: 20, // Max 20 concurrent requests
    errorFilter: (error) => {
      // Ignore 400 errors (bad request)
      return error.status === 400;
    },
  },
});
```

## Next Steps

- Learn about [Fallback Functions](/guide/fallback)
- Explore [Statistics](/guide/statistics)
- Check out [Examples](/examples/)

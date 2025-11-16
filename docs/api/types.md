# Types

TypeScript types and interfaces used in **@nodelibraries/circuit-breaker**.

## RequestFn

Type representing a request function that returns a promise.

```typescript
type RequestFn<T> = (...args: any[]) => Promise<T>;
```

## CircuitBreakerParams

Type representing parameters for a circuit breaker.

```typescript
type CircuitBreakerParams<T> = BaseCircuitBreakerParams &
  RequestParams<T> &
  Partial<FallbackParams<T>>;
```

### BaseCircuitBreakerParams

```typescript
interface BaseCircuitBreakerParams {
  level?: CircuitBreakerLevel;
  name: string;
  options?: Partial<OpossumCircuitBreaker.Options>;
}
```

### RequestParams

```typescript
interface RequestParams<T> {
  requestFn: RequestFn<T>;
  args?: Parameters<RequestFn<T>>;
}
```

### FallbackParams

```typescript
interface FallbackParams<T> {
  fallbackFn?: RequestFn<T>;
  fallbackFnArgs?: Parameters<RequestFn<T>>;
}
```

## EventHandlers

Interface representing event handlers for circuit breaker events.

```typescript
interface EventHandlers {
  fire?: () => void;
  reject?: () => void;
  timeout?: () => void;
  success?: () => void;
  failure?: () => void;
  open?: () => void;
  close?: () => void;
  halfOpen?: () => void;
  fallback?: () => void;
  semaphoreLocked?: () => void;
  healthCheckFailed?: () => void;
  shutdown?: () => void;
  cacheHit?: () => void;
  cacheMiss?: () => void;
}
```

## Options

Options for configuring circuit breaker behavior. These are passed through to the underlying [opossum](https://www.npmjs.com/package/opossum) library.

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

## See Also

- [Configuration Guide](/guide/configuration)
- [CircuitBreaker](/api/circuit-breaker)

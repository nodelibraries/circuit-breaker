# CircuitBreaker

Main class for managing circuit breakers.

## Constructor

```typescript
constructor(eventHandlers?: EventHandlers)
```

Creates a new instance of `CircuitBreaker`.

### Parameters

- `eventHandlers` (optional): Object containing event handler functions

### Example

```typescript
const circuitBreaker = new CircuitBreaker({
  timeout: () => console.error('Request timeout'),
  failure: () => console.error('Request failed'),
  open: () => console.error('Circuit breaker opened'),
});
```

## Methods

### execute

```typescript
execute<T>(params: CircuitBreakerParams<T>): Promise<T>
```

Executes a request function with circuit breaker protection.

#### Parameters

- `params`: Object containing:
  - `level` (optional): The level of the circuit breaker (`CircuitBreakerLevel`)
  - `name`: The name of the circuit breaker (string)
  - `requestFn`: The request function to be wrapped by the circuit breaker
  - `args` (optional): Arguments to be passed to the `requestFn`
  - `fallbackFn` (optional): Fallback function to be executed in case of failure
  - `fallbackFnArgs` (optional): Arguments to be passed to the `fallbackFn`
  - `options` (optional): Custom circuit breaker options

#### Returns

- `Promise<T>`: A promise that resolves to the result of the `requestFn`

#### Example

```typescript
const result = await circuitBreaker.execute({
  level: CircuitBreakerLevel.External,
  name: 'fetchUserData',
  requestFn: fetchUserData,
  args: [userId],
  fallbackFn: fallbackUserData,
  options: {
    timeout: 5000,
    errorThresholdPercentage: 50,
  },
});
```

### getCircuitBreakerStats

```typescript
getCircuitBreakerStats(): Record<string, any>
```

Gets statistics for all circuit breakers.

#### Returns

- `Record<string, any>`: An object containing statistics for all circuit breakers

#### Example

```typescript
const stats = circuitBreaker.getCircuitBreakerStats();
console.log(stats);
// {
//   'External::fetchUserData': {
//     fires: 100,
//     successes: 95,
//     failures: 5,
//     ...
//   }
// }
```

## Event Handlers

The following event handlers can be provided in the constructor:

- `fire?: () => void` - Emitted when a request is made
- `reject?: () => void` - Emitted when a request is rejected
- `timeout?: () => void` - Emitted when a request times out
- `success?: () => void` - Emitted when a request succeeds
- `failure?: () => void` - Emitted when a request fails
- `open?: () => void` - Emitted when the circuit opens
- `close?: () => void` - Emitted when the circuit closes
- `halfOpen?: () => void` - Emitted when the circuit transitions to half-open
- `fallback?: () => void` - Emitted when a fallback function is executed
- `semaphoreLocked?: () => void` - Emitted when the semaphore is locked
- `healthCheckFailed?: () => void` - Emitted when a health check fails
- `shutdown?: () => void` - Emitted when the circuit breaker shuts down
- `cacheHit?: () => void` - Emitted when a cached response is used
- `cacheMiss?: () => void` - Emitted when a cache miss occurs

## See Also

- [CircuitBreakerLevel](/api/circuit-breaker-level)
- [Types](/api/types)
- [Event Handlers Guide](/guide/event-handlers)

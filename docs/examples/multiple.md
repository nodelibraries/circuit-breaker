# Multiple Circuit Breakers

Example showing how to manage multiple circuit breakers in your application.

## Different Levels

You can have multiple circuit breakers at different levels:

```typescript
import { CircuitBreaker, CircuitBreakerLevel } from '@nodelibraries/circuit-breaker';

const circuitBreaker = new CircuitBreaker();

// Endpoint level
await circuitBreaker.execute({
  level: CircuitBreakerLevel.Endpoint,
  name: 'getUser',
  requestFn: getUserEndpoint,
  args: [userId],
});

// Service level
await circuitBreaker.execute({
  level: CircuitBreakerLevel.Service,
  name: 'userService',
  requestFn: userService.getAllUsers,
  args: [],
});

// Database level
await circuitBreaker.execute({
  level: CircuitBreakerLevel.Database,
  name: 'findUser',
  requestFn: db.findUser,
  args: [userId],
});

// External level
await circuitBreaker.execute({
  level: CircuitBreakerLevel.External,
  name: 'paymentGateway',
  requestFn: paymentGateway.processPayment,
  args: [paymentData],
});
```

## Same Name, Different Levels

You can use the same name at different levels - they are separate circuit breakers:

```typescript
// These are two separate circuit breakers:
// - "Endpoint::getUser"
// - "Service::getUser"

await circuitBreaker.execute({
  level: CircuitBreakerLevel.Endpoint,
  name: 'getUser',
  requestFn: getUserEndpoint,
});

await circuitBreaker.execute({
  level: CircuitBreakerLevel.Service,
  name: 'getUser',
  requestFn: userService.getUser,
});
```

## Different Configurations

Each circuit breaker can have different configurations:

```typescript
// Fast, sensitive circuit breaker
await circuitBreaker.execute({
  level: CircuitBreakerLevel.External,
  name: 'criticalService',
  requestFn: criticalService,
  options: {
    timeout: 2000, // 2 seconds
    errorThresholdPercentage: 30, // Open after 30% failures
    resetTimeout: 10000, // 10 seconds
  },
});

// Slow, resilient circuit breaker
await circuitBreaker.execute({
  level: CircuitBreakerLevel.External,
  name: 'resilientService',
  requestFn: resilientService,
  options: {
    timeout: 30000, // 30 seconds
    errorThresholdPercentage: 70, // Open after 70% failures
    resetTimeout: 60000, // 60 seconds
  },
});
```

## Statistics for All Circuit Breakers

Get statistics for all circuit breakers:

```typescript
const stats = circuitBreaker.getCircuitBreakerStats();

// Iterate over all circuit breakers
Object.entries(stats).forEach(([name, serviceStats]) => {
  console.log(`\n=== ${name} ===`);
  console.log(`State: ${serviceStats.state}`);
  console.log(`Total Requests: ${serviceStats.fires}`);
  console.log(`Successful: ${serviceStats.successes}`);
  console.log(`Failed: ${serviceStats.failures}`);
  console.log(`Mean Latency: ${serviceStats.latencyMean}ms`);
});
```

## Health Check for All Circuit Breakers

```typescript
function getHealthStatus(stats: Record<string, any>) {
  return Object.entries(stats).map(([name, serviceStats]) => ({
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
    isHealthy:
      serviceStats.state === 'closed' &&
      serviceStats.failures < serviceStats.successes,
  }));
}

const stats = circuitBreaker.getCircuitBreakerStats();
const health = getHealthStatus(stats);

console.log('Circuit Breaker Health:', health);
```

## Example: Multiple Services

```typescript
import { CircuitBreaker, CircuitBreakerLevel } from '@nodelibraries/circuit-breaker';
import axios from 'axios';

const circuitBreaker = new CircuitBreaker({
  open: (name) => console.error(`Circuit breaker opened: ${name}`),
  close: (name) => console.log(`Circuit breaker closed: ${name}`),
});

// User service
async function fetchUser(userId: number) {
  const response = await axios.get(`https://api.example.com/users/${userId}`);
  return response.data;
}

// Order service
async function fetchOrder(orderId: number) {
  const response = await axios.get(`https://api.example.com/orders/${orderId}`);
  return response.data;
}

// Payment service
async function processPayment(paymentData: any) {
  const response = await axios.post(
    'https://api.example.com/payments',
    paymentData
  );
  return response.data;
}

// Use different circuit breakers
const user = await circuitBreaker.execute({
  level: CircuitBreakerLevel.External,
  name: 'userService',
  requestFn: fetchUser,
  args: [userId],
  options: {
    timeout: 5000,
    errorThresholdPercentage: 50,
  },
});

const order = await circuitBreaker.execute({
  level: CircuitBreakerLevel.External,
  name: 'orderService',
  requestFn: fetchOrder,
  args: [orderId],
  options: {
    timeout: 10000,
    errorThresholdPercentage: 40,
  },
});

const payment = await circuitBreaker.execute({
  level: CircuitBreakerLevel.External,
  name: 'paymentService',
  requestFn: processPayment,
  args: [paymentData],
  options: {
    timeout: 15000,
    errorThresholdPercentage: 30, // More sensitive for payments
  },
});
```

## Next Steps

- Learn about [Error Handling](/examples/error-handling)
- Explore [Advanced Configuration](/examples/advanced)

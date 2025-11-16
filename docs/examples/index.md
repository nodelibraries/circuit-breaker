# Examples

Real-world examples demonstrating how to use **@nodelibraries/circuit-breaker**.

## Basic Examples

- [Basic Usage](/examples/basic) - Simple example showing basic usage
- [Error Handling](/examples/error-handling) - How to handle errors with circuit breakers

## Framework Integration

- [NestJS Integration](/examples/nestjs) - Using circuit breakers in NestJS applications
- [Express Integration](/examples/express) - Using circuit breakers in Express applications

## Advanced Examples

- [Advanced Configuration](/examples/advanced) - Advanced configuration options
- [Multiple Circuit Breakers](/examples/multiple) - Managing multiple circuit breakers

## Use Cases

### API Calls

Protect external API calls from failures:

```typescript
import { CircuitBreaker, CircuitBreakerLevel } from '@nodelibraries/circuit-breaker';
import axios from 'axios';

const circuitBreaker = new CircuitBreaker();

async function fetchUserData(userId: number) {
  const response = await axios.get(`https://api.example.com/users/${userId}`);
  return response.data;
}

const user = await circuitBreaker.execute({
  level: CircuitBreakerLevel.External,
  name: 'fetchUserData',
  requestFn: fetchUserData,
  args: [userId],
  fallbackFn: () => ({ id: userId, name: 'Unknown User' }),
});
```

### Database Operations

Protect database operations:

```typescript
const result = await circuitBreaker.execute({
  level: CircuitBreakerLevel.Database,
  name: 'findUser',
  requestFn: db.findUser,
  args: [userId],
  fallbackFn: () => null,
});
```

### Service Calls

Protect service-to-service calls:

```typescript
const result = await circuitBreaker.execute({
  level: CircuitBreakerLevel.Service,
  name: 'paymentService',
  requestFn: paymentService.processPayment,
  args: [paymentData],
  fallbackFn: () => ({ status: 'failed', reason: 'Service unavailable' }),
});
```

## Next Steps

- Read the [Getting Started Guide](/guide/quick-start)
- Explore the [API Reference](/api/)
- Check out more [Examples](/examples/)

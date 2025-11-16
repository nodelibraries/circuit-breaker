# Basic Usage

Simple example showing basic usage of **@nodelibraries/circuit-breaker**.

## Code

```typescript
import { CircuitBreaker, CircuitBreakerLevel } from '@nodelibraries/circuit-breaker';
import axios from 'axios';

// Create a circuit breaker instance
const circuitBreaker = new CircuitBreaker({
  timeout: () => console.error('Request timeout'),
  failure: () => console.error('Request failed'),
  open: () => console.error('Circuit breaker opened'),
  close: () => console.log('Circuit breaker closed'),
});

// Define your async function
async function fetchUserData(userId: number) {
  const response = await axios.get(`https://api.example.com/users/${userId}`);
  return response.data;
}

// Define a fallback function
async function fallbackUserData(userId: number) {
  return {
    id: userId,
    name: 'Unknown User',
    email: 'unknown@example.com',
    status: 'fallback',
  };
}

// Execute with circuit breaker protection
async function getUser(userId: number) {
  try {
    const user = await circuitBreaker.execute({
      level: CircuitBreakerLevel.External,
      name: 'fetchUserData',
      requestFn: fetchUserData,
      args: [userId],
      fallbackFn: fallbackUserData,
    });
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}

// Use it
getUser(123)
  .then((user) => {
    console.log('User:', user);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
```

## Expected Output

When the service is healthy:

```
User: { id: 123, name: 'John Doe', email: 'john@example.com' }
```

When the service is unavailable and fallback is used:

```
Request failed
Circuit breaker opened
User: { id: 123, name: 'Unknown User', email: 'unknown@example.com', status: 'fallback' }
```

## Key Points

- **Simple Setup**: Just create a `CircuitBreaker` instance and use `execute()`
- **Fallback Support**: Provide a fallback function for graceful degradation
- **Event Handling**: Monitor circuit breaker events with event handlers
- **Type Safety**: Full TypeScript support with type inference

## Next Steps

- Learn about [Error Handling](/examples/error-handling)
- Explore [Advanced Configuration](/examples/advanced)
- Check out [NestJS Integration](/examples/nestjs)

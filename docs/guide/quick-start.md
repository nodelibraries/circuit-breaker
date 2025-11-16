# Quick Start

This guide will walk you through creating your first circuit breaker setup.

## Basic Example

```typescript
import { CircuitBreaker, CircuitBreakerLevel } from '@nodelibraries/circuit-breaker';
import axios from 'axios';

// 1. Create a circuit breaker instance
const circuitBreaker = new CircuitBreaker({
  timeout: () => console.error('Request timeout'),
  failure: () => console.error('Request failed'),
  open: () => console.error('Circuit breaker opened'),
});

// 2. Define your async function
async function fetchUserData(userId: number) {
  const response = await axios.get(`https://api.example.com/users/${userId}`);
  return response.data;
}

// 3. Define a fallback function (optional)
async function fallbackUserData(userId: number) {
  return { id: userId, name: 'Unknown User', status: 'fallback' };
}

// 4. Execute with circuit breaker protection
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

// 5. Use it
getUser(123).then((user) => {
  console.log('User:', user);
});
```

## Step-by-Step Explanation

### 1. Create Circuit Breaker Instance

Create a new `CircuitBreaker` instance with optional event handlers:

```typescript
const circuitBreaker = new CircuitBreaker({
  timeout: () => console.error('Request timeout'),
  failure: () => console.error('Request failed'),
  open: () => console.error('Circuit breaker opened'),
});
```

### 2. Define Your Async Function

Your function should return a Promise:

```typescript
async function fetchUserData(userId: number) {
  const response = await axios.get(`https://api.example.com/users/${userId}`);
  return response.data;
}
```

### 3. Execute with Circuit Breaker

Use the `execute` method to run your function with circuit breaker protection:

```typescript
const result = await circuitBreaker.execute({
  level: CircuitBreakerLevel.External,
  name: 'fetchUserData',
  requestFn: fetchUserData,
  args: [userId],
  fallbackFn: fallbackUserData,
});
```

### Parameters

- `level`: (optional) The level of the circuit breaker
- `name`: Unique name for the circuit breaker
- `requestFn`: The async function to execute
- `args`: Arguments to pass to the function
- `fallbackFn`: (optional) Fallback function when circuit is open or request fails
- `options`: (optional) Custom configuration options

## With Custom Configuration

You can customize the circuit breaker behavior:

```typescript
const result = await circuitBreaker.execute({
  level: CircuitBreakerLevel.External,
  name: 'fetchUserData',
  requestFn: fetchUserData,
  args: [userId],
  fallbackFn: fallbackUserData,
  options: {
    timeout: 5000, // 5 seconds timeout
    errorThresholdPercentage: 50, // Open circuit after 50% failures
    resetTimeout: 30000, // Wait 30 seconds before trying again
  },
});
```

## Getting Statistics

Monitor your circuit breakers with built-in statistics:

```typescript
const stats = circuitBreaker.getCircuitBreakerStats();
console.log(stats);
// {
//   'External::fetchUserData': {
//     fires: 100,
//     cacheHits: 0,
//     cacheMisses: 0,
//     rejects: 0,
//     failures: 5,
//     timeouts: 2,
//     successes: 93,
//     ...
//   }
// }
```

## Next Steps

- Learn about [Circuit Breaker Levels](/guide/levels)
- Explore [Configuration Options](/guide/configuration)
- Check out [Examples](/examples/)

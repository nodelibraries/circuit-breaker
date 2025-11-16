# Introduction

**@nodelibraries/circuit-breaker** is a lightweight wrapper around the powerful [opossum](https://www.npmjs.com/package/opossum) circuit breaker library. It provides a simple, intuitive API for managing circuit breakers in your Node.js applications.

## What is a Circuit Breaker?

A circuit breaker is a design pattern used in distributed systems to prevent cascading failures. It acts as a safety mechanism that:

1. **Monitors** requests to a service
2. **Detects** when failures exceed a threshold
3. **Opens** the circuit to prevent further requests
4. **Allows** periodic attempts to check if the service has recovered
5. **Closes** the circuit when the service is healthy again

## Why Use Circuit Breaker?

- **Simple API**: Easy to use with minimal configuration
- **Multiple Levels**: Support for different levels of circuit breakers (Endpoint, Service, Application, Database, External)
- **Event-Driven**: Comprehensive event handling for monitoring and logging
- **TypeScript Support**: Full type safety with excellent IDE experience
- **Statistics**: Built-in statistics tracking for all circuit breakers
- **Framework Agnostic**: Works with any Node.js application

## How It Works

```typescript
import {
  CircuitBreaker,
  CircuitBreakerLevel,
} from '@nodelibraries/circuit-breaker';

// Create a circuit breaker instance
const circuitBreaker = new CircuitBreaker({
  timeout: () => console.error('Request timeout'),
  failure: () => console.error('Request failed'),
  open: () => console.error('Circuit breaker opened'),
});

// Execute a request with circuit breaker protection
const result = await circuitBreaker.execute({
  level: CircuitBreakerLevel.External,
  name: 'myService',
  requestFn: async () => {
    // Your async operation
    return await fetchData();
  },
  args: [],
  fallbackFn: () => {
    // Fallback when circuit is open or request fails
    return { default: 'value' };
  },
});
```

## Circuit Breaker States

A circuit breaker has three states:

1. **Closed**: Normal operation, requests pass through
2. **Open**: Circuit is open, requests are rejected immediately
3. **Half-Open**: Testing if the service has recovered

## Next Steps

- [Installation](/guide/installation) - Learn how to install the library
- [Quick Start](/guide/quick-start) - Get started with your first circuit breaker
- [Configuration](/guide/configuration) - Learn about configuration options
- [Examples](/examples/) - See real-world examples

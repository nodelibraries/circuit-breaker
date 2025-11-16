---
layout: home

hero:
  name: circuit-breaker
  text: Circuit Breaker for Node.js
  tagline: |
    A lightweight wrapper around opossum for easier circuit breaker management.
    Protect your applications from unexpected failures with a simple, intuitive API.

  actions:
    - theme: brand
      text: Get Started
      link: /guide/
    - theme: alt
      text: View on GitHub
      link: https://github.com/nodelibraries/circuit-breaker

features:
  - icon: 🛡️
    title: Resilient by Default
    details: Protect your applications from cascading failures with automatic circuit breaker patterns
  - icon: 🎯
    title: Simple API
    details: Easy to use with minimal configuration. Get started in minutes, not hours
  - icon: 🔄
    title: Multiple Levels
    details: Support for endpoint, service, application, database, and external service levels
  - icon: ⚡
    title: Event-Driven
    details: Comprehensive event handling for monitoring, logging, and observability
  - icon: 🎨
    title: Framework Agnostic
    details: Works seamlessly with NestJS, Express, and any Node.js application
  - icon: 📊
    title: Statistics
    details: Built-in statistics tracking for all circuit breakers with detailed metrics
  - icon: 🔧
    title: Flexible Configuration
    details: Customize timeout, error thresholds, and more to fit your needs
  - icon: 🚀
    title: TypeScript Support
    details: Full TypeScript support with type safety and excellent IDE experience
  - icon: 📦
    title: Lightweight
    details: Minimal dependencies, built on top of the battle-tested opossum library
---

## Quick Start

```bash
npm install @nodelibraries/circuit-breaker
```

```typescript
import {
  CircuitBreaker,
  CircuitBreakerLevel,
} from '@nodelibraries/circuit-breaker';
import axios from 'axios';

const circuitBreaker = new CircuitBreaker({
  timeout: () => console.error('Request timeout'),
  failure: () => console.error('Request failed'),
  open: () => console.error('Circuit breaker opened'),
});

async function fetchUserData(userId: number) {
  const response = await axios.get(`https://api.example.com/users/${userId}`);
  return response.data;
}

async function getUser(userId: number) {
  try {
    const user = await circuitBreaker.execute({
      level: CircuitBreakerLevel.External,
      name: 'fetchUserData',
      requestFn: fetchUserData,
      args: [userId],
      fallbackFn: () => ({ id: userId, name: 'Unknown User' }),
    });
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}
```

## Why Circuit Breaker?

**@nodelibraries/circuit-breaker** is a production-ready, lightweight wrapper around the powerful [opossum](https://www.npmjs.com/package/opossum) circuit breaker library. It simplifies circuit breaker management with an intuitive API while maintaining all the flexibility and power of the underlying library.

### 🎯 Clean & Simple

No complex setup, no framework lock-in. Your code remains clean and framework-agnostic.

```typescript
const result = await circuitBreaker.execute({
  level: CircuitBreakerLevel.External,
  name: 'myService',
  requestFn: myAsyncFunction,
  args: [arg1, arg2],
});
```

### 🔒 Type-Safe by Design

Built from the ground up for TypeScript. Full type inference, autocomplete, and compile-time safety.

```typescript
const result: User = await circuitBreaker.execute<User>({
  // TypeScript knows the return type
});
```

### 🚀 Production Ready

Battle-tested features including event handling, statistics tracking, and comprehensive error handling.

```typescript
const stats = circuitBreaker.getCircuitBreakerStats();
console.log(stats); // Detailed statistics for all circuit breakers
```

## Installation

```bash
npm install @nodelibraries/circuit-breaker
```

No additional configuration required! The library works out of the box.

## Support

If you find this project helpful, please consider supporting its development:

<p align="center">
  <a href="https://www.buymeacoffee.com/ylcnfrht" target="_blank">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" >
  </a>
</p>

## Next Steps

- Read the [Getting Started Guide](/guide/)
- Check out [Examples](/examples/)
- Browse the [API Reference](/api/)

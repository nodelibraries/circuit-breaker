# Circuit Breaker Levels

Circuit breaker levels help you organize and manage circuit breakers at different granularities in your application. This allows you to have separate circuit breakers for different parts of your system.

## Available Levels

The `CircuitBreakerLevel` enum provides the following levels:

- **Endpoint**: Circuit breaker for an individual endpoint
- **Service**: Circuit breaker for a specific service
- **Application**: Circuit breaker for the entire application
- **Database**: Circuit breaker for database calls
- **External**: Circuit breaker for external services

## Usage

```typescript
import { CircuitBreaker, CircuitBreakerLevel } from '@nodelibraries/circuit-breaker';

const circuitBreaker = new CircuitBreaker();

// Endpoint level - for specific API endpoints
await circuitBreaker.execute({
  level: CircuitBreakerLevel.Endpoint,
  name: 'getUserById',
  requestFn: getUserById,
  args: [userId],
});

// Service level - for entire services
await circuitBreaker.execute({
  level: CircuitBreakerLevel.Service,
  name: 'userService',
  requestFn: userService.getAllUsers,
  args: [],
});

// Database level - for database operations
await circuitBreaker.execute({
  level: CircuitBreakerLevel.Database,
  name: 'findUser',
  requestFn: db.findUser,
  args: [userId],
});

// External level - for external APIs
await circuitBreaker.execute({
  level: CircuitBreakerLevel.External,
  name: 'paymentGateway',
  requestFn: paymentGateway.processPayment,
  args: [paymentData],
});

// Application level - for application-wide operations
await circuitBreaker.execute({
  level: CircuitBreakerLevel.Application,
  name: 'healthCheck',
  requestFn: healthCheck,
  args: [],
});
```

## Naming Convention

When you specify a level, the circuit breaker name is prefixed with the level:

- `Endpoint::getUserById`
- `Service::userService`
- `Database::findUser`
- `External::paymentGateway`
- `Application::healthCheck`

This allows you to have multiple circuit breakers with the same name at different levels.

## Example: Multiple Levels

```typescript
// Different levels, same name - they are separate circuit breakers
await circuitBreaker.execute({
  level: CircuitBreakerLevel.Endpoint,
  name: 'getUser',
  requestFn: getUserEndpoint,
  args: [userId],
});

await circuitBreaker.execute({
  level: CircuitBreakerLevel.Service,
  name: 'getUser',
  requestFn: userService.getUser,
  args: [userId],
});

// These are two separate circuit breakers:
// - "Endpoint::getUser"
// - "Service::getUser"
```

## When to Use Each Level

### Endpoint Level

Use for individual API endpoints that might fail independently.

```typescript
// Each endpoint has its own circuit breaker
await circuitBreaker.execute({
  level: CircuitBreakerLevel.Endpoint,
  name: 'getUser',
  requestFn: getUserEndpoint,
});

await circuitBreaker.execute({
  level: CircuitBreakerLevel.Endpoint,
  name: 'createUser',
  requestFn: createUserEndpoint,
});
```

### Service Level

Use for entire services that might fail as a unit.

```typescript
// All operations in a service share the same circuit breaker
await circuitBreaker.execute({
  level: CircuitBreakerLevel.Service,
  name: 'userService',
  requestFn: userService.getUser,
});

await circuitBreaker.execute({
  level: CircuitBreakerLevel.Service,
  name: 'userService',
  requestFn: userService.createUser,
});
```

### Database Level

Use for database operations that might fail due to connection issues.

```typescript
await circuitBreaker.execute({
  level: CircuitBreakerLevel.Database,
  name: 'findUser',
  requestFn: db.findUser,
});
```

### External Level

Use for external APIs and third-party services.

```typescript
await circuitBreaker.execute({
  level: CircuitBreakerLevel.External,
  name: 'paymentGateway',
  requestFn: paymentGateway.processPayment,
});
```

### Application Level

Use for application-wide operations like health checks.

```typescript
await circuitBreaker.execute({
  level: CircuitBreakerLevel.Application,
  name: 'healthCheck',
  requestFn: healthCheck,
});
```

## No Level

You can also omit the level if you don't need hierarchical organization:

```typescript
await circuitBreaker.execute({
  name: 'myOperation', // Just "myOperation", no level prefix
  requestFn: myOperation,
});
```

## Next Steps

- Learn about [Event Handlers](/guide/event-handlers)
- Explore [Configuration Options](/guide/configuration)

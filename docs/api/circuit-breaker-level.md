# CircuitBreakerLevel

Enum representing different levels of circuit breakers.

## Values

```typescript
enum CircuitBreakerLevel {
  Endpoint = 'Endpoint',
  Service = 'Service',
  Application = 'Application',
  Database = 'Database',
  External = 'External',
}
```

## Description

Circuit breaker levels help you organize and manage circuit breakers at different granularities in your application. When you specify a level, the circuit breaker name is prefixed with the level (e.g., `Endpoint::getUser`).

## Usage

```typescript
import { CircuitBreakerLevel } from '@nodelibraries/circuit-breaker';

// Endpoint level - for individual API endpoints
await circuitBreaker.execute({
  level: CircuitBreakerLevel.Endpoint,
  name: 'getUser',
  requestFn: getUserEndpoint,
});

// Service level - for entire services
await circuitBreaker.execute({
  level: CircuitBreakerLevel.Service,
  name: 'userService',
  requestFn: userService.getAllUsers,
});

// Database level - for database operations
await circuitBreaker.execute({
  level: CircuitBreakerLevel.Database,
  name: 'findUser',
  requestFn: db.findUser,
});

// External level - for external APIs
await circuitBreaker.execute({
  level: CircuitBreakerLevel.External,
  name: 'paymentGateway',
  requestFn: paymentGateway.processPayment,
});

// Application level - for application-wide operations
await circuitBreaker.execute({
  level: CircuitBreakerLevel.Application,
  name: 'healthCheck',
  requestFn: healthCheck,
});
```

## Naming Convention

When you specify a level, the circuit breaker name is prefixed with the level:

- `Endpoint::getUser`
- `Service::userService`
- `Database::findUser`
- `External::paymentGateway`
- `Application::healthCheck`

This allows you to have multiple circuit breakers with the same name at different levels.

## See Also

- [Circuit Breaker Levels Guide](/guide/levels)
- [CircuitBreaker](/api/circuit-breaker)

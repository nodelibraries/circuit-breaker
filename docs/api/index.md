# API Reference

Complete API reference for **@nodelibraries/circuit-breaker**.

## Classes

- [CircuitBreaker](/api/circuit-breaker) - Main class for managing circuit breakers

## Enums

- [CircuitBreakerLevel](/api/circuit-breaker-level) - Enum representing different levels of circuit breakers

## Types

- [Types](/api/types) - TypeScript types and interfaces

## Quick Reference

### CircuitBreaker

```typescript
class CircuitBreaker {
  constructor(eventHandlers?: EventHandlers);
  execute<T>(params: CircuitBreakerParams<T>): Promise<T>;
  getCircuitBreakerStats(): Record<string, any>;
}
```

### CircuitBreakerLevel

```typescript
enum CircuitBreakerLevel {
  Endpoint = 'Endpoint',
  Service = 'Service',
  Application = 'Application',
  Database = 'Database',
  External = 'External',
}
```

## See Also

- [Getting Started Guide](/guide/quick-start)
- [Examples](/examples/)

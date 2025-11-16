# Event Handlers

Event handlers allow you to monitor and react to circuit breaker events. You can provide event handlers when creating a `CircuitBreaker` instance.

## Available Events

The following events are available:

- `fire`: Emitted when a request is made
- `reject`: Emitted when a request is rejected (circuit is open)
- `timeout`: Emitted when a request times out
- `success`: Emitted when a request succeeds
- `failure`: Emitted when a request fails
- `open`: Emitted when the circuit opens
- `close`: Emitted when the circuit closes
- `halfOpen`: Emitted when the circuit transitions to half-open state
- `fallback`: Emitted when a fallback function is executed
- `semaphoreLocked`: Emitted when the semaphore is locked (too many concurrent requests)
- `healthCheckFailed`: Emitted when a health check fails
- `shutdown`: Emitted when the circuit breaker shuts down
- `cacheHit`: Emitted when a cached response is used
- `cacheMiss`: Emitted when a cache miss occurs

## Basic Usage

```typescript
import { CircuitBreaker } from '@nodelibraries/circuit-breaker';

const circuitBreaker = new CircuitBreaker({
  fire: () => console.log('Request fired'),
  success: () => console.log('Request succeeded'),
  failure: () => console.error('Request failed'),
  timeout: () => console.error('Request timed out'),
  open: () => console.error('Circuit breaker opened'),
  close: () => console.log('Circuit breaker closed'),
  halfOpen: () => console.log('Circuit breaker half-open'),
  reject: () => console.warn('Request rejected - circuit is open'),
  fallback: () => console.log('Fallback function executed'),
});
```

## Example: Logging Events

```typescript
import { CircuitBreaker } from '@nodelibraries/circuit-breaker';

const circuitBreaker = new CircuitBreaker({
  fire: () => {
    console.log('[Circuit Breaker] Request fired');
  },
  success: () => {
    console.log('[Circuit Breaker] Request succeeded');
  },
  failure: (error) => {
    console.error('[Circuit Breaker] Request failed:', error);
  },
  timeout: () => {
    console.error('[Circuit Breaker] Request timed out');
  },
  open: () => {
    console.error('[Circuit Breaker] Circuit opened - service unavailable');
  },
  close: () => {
    console.log('[Circuit Breaker] Circuit closed - service recovered');
  },
  halfOpen: () => {
    console.log('[Circuit Breaker] Circuit half-open - testing service');
  },
  reject: () => {
    console.warn('[Circuit Breaker] Request rejected - circuit is open');
  },
  fallback: () => {
    console.log('[Circuit Breaker] Fallback function executed');
  },
});
```

## Example: Metrics Collection

```typescript
import { CircuitBreaker } from '@nodelibraries/circuit-breaker';

const metrics = {
  requests: 0,
  successes: 0,
  failures: 0,
  timeouts: 0,
  rejects: 0,
  circuitOpens: 0,
};

const circuitBreaker = new CircuitBreaker({
  fire: () => {
    metrics.requests++;
  },
  success: () => {
    metrics.successes++;
  },
  failure: () => {
    metrics.failures++;
  },
  timeout: () => {
    metrics.timeouts++;
  },
  reject: () => {
    metrics.rejects++;
  },
  open: () => {
    metrics.circuitOpens++;
    console.log('Circuit opened! Total opens:', metrics.circuitOpens);
  },
});

// Later, you can access metrics
console.log('Metrics:', metrics);
```

## Example: Alerting

```typescript
import { CircuitBreaker } from '@nodelibraries/circuit-breaker';

const circuitBreaker = new CircuitBreaker({
  open: () => {
    // Send alert when circuit opens
    sendAlert({
      severity: 'critical',
      message: 'Circuit breaker opened - service unavailable',
      timestamp: new Date(),
    });
  },
  failure: () => {
    // Log failures for monitoring
    logToMonitoring({
      event: 'circuit_breaker_failure',
      timestamp: new Date(),
    });
  },
  timeout: () => {
    // Alert on timeouts
    sendAlert({
      severity: 'warning',
      message: 'Request timeout detected',
      timestamp: new Date(),
    });
  },
});
```

## Example: NestJS Integration

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { CircuitBreaker } from '@nodelibraries/circuit-breaker';

@Injectable()
export class AppService {
  private readonly circuitBreaker: CircuitBreaker;
  private readonly logger = new Logger(AppService.name);

  constructor() {
    this.circuitBreaker = new CircuitBreaker({
      timeout: () => {
        this.logger.error('Circuit Breaker timeout');
      },
      failure: () => {
        this.logger.error('Circuit Breaker failure');
      },
      reject: () => {
        this.logger.error('Circuit Breaker reject');
      },
      open: () => {
        this.logger.error('Circuit Breaker opened');
      },
      close: () => {
        this.logger.log('Circuit Breaker closed');
      },
      halfOpen: () => {
        this.logger.log('Circuit Breaker half-open');
      },
    });
  }
}
```

## Event Handler Types

All event handlers are functions that take no parameters:

```typescript
interface EventHandlers {
  fire?: () => void;
  reject?: () => void;
  timeout?: () => void;
  success?: () => void;
  failure?: () => void;
  open?: () => void;
  close?: () => void;
  halfOpen?: () => void;
  fallback?: () => void;
  semaphoreLocked?: () => void;
  healthCheckFailed?: () => void;
  shutdown?: () => void;
  cacheHit?: () => void;
  cacheMiss?: () => void;
}
```

## Best Practices

1. **Log Important Events**: Always log `open`, `close`, and `failure` events for debugging
2. **Monitor Metrics**: Track `fire`, `success`, `failure`, and `timeout` for metrics
3. **Alert on Critical Events**: Set up alerts for `open` events
4. **Use Structured Logging**: Include timestamps and context in your logs

## Next Steps

- Learn about [Configuration Options](/guide/configuration)
- Explore [Fallback Functions](/guide/fallback)
- Check out [Examples](/examples/)

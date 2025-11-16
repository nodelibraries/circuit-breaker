# Express Integration

Example showing how to use **@nodelibraries/circuit-breaker** in an Express application.

## Installation

```bash
npm install @nodelibraries/circuit-breaker express
```

## Basic Example

```typescript
import express from 'express';
import axios from 'axios';
import { CircuitBreaker, CircuitBreakerLevel } from '@nodelibraries/circuit-breaker';

const app = express();
const port = 3000;

// Create a circuit breaker instance
const circuitBreaker = new CircuitBreaker({
  timeout: () => console.error('Circuit Breaker timeout'),
  failure: () => console.error('Circuit Breaker failure'),
  reject: () => console.error('Circuit Breaker reject'),
  open: () => console.error('Circuit Breaker opened'),
  close: () => console.log('Circuit Breaker closed'),
});

const stockServiceUrl = 'http://localhost:3001/stock';

async function checkStock(productId: number): Promise<{ available: boolean }> {
  const response = await axios.get(`${stockServiceUrl}/${productId}`);
  return response.data;
}

async function checkStockFallbackFunction(productId: number) {
  return { available: true };
}

app.get('/create-order/:productId', async (req, res) => {
  const productId = parseInt(req.params.productId, 10);

  try {
    const result: { available: boolean } = await circuitBreaker.execute({
      level: CircuitBreakerLevel.Endpoint,
      requestFn: checkStock,
      fallbackFn: checkStockFallbackFunction,
      name: 'checkStock',
      args: [productId],
      fallbackFnArgs: [productId],
    });

    if (result?.available) {
      res.send({ message: 'Order placed successfully!' });
    } else {
      res.status(400).send({ message: 'Product is out of stock' });
    }
  } catch (error) {
    res.status(503).send({ message: 'Service Unavailable' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

## Middleware Example

You can create a middleware to wrap routes with circuit breaker protection:

```typescript
import { Request, Response, NextFunction } from 'express';
import { CircuitBreaker, CircuitBreakerLevel } from '@nodelibraries/circuit-breaker';

const circuitBreaker = new CircuitBreaker({
  timeout: () => console.error('Circuit Breaker timeout'),
  failure: () => console.error('Circuit Breaker failure'),
  open: () => console.error('Circuit Breaker opened'),
});

export function circuitBreakerMiddleware(
  name: string,
  requestFn: (req: Request, res: Response) => Promise<any>,
  fallbackFn?: (req: Request, res: Response) => Promise<any>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await circuitBreaker.execute({
        level: CircuitBreakerLevel.Endpoint,
        name,
        requestFn: () => requestFn(req, res),
        fallbackFn: fallbackFn ? () => fallbackFn(req, res) : undefined,
      });

      if (!res.headersSent) {
        res.json(result);
      }
    } catch (error) {
      if (!res.headersSent) {
        res.status(503).json({ message: 'Service Unavailable' });
      }
    }
  };
}

// Usage
app.get(
  '/users/:id',
  circuitBreakerMiddleware(
    'getUser',
    async (req, res) => {
      const user = await fetchUser(req.params.id);
      return user;
    },
    async (req, res) => {
      return { id: req.params.id, name: 'Unknown User' };
    }
  )
);
```

## Health Check Endpoint

```typescript
app.get('/health/circuit-breakers', (req, res) => {
  const stats = circuitBreaker.getCircuitBreakerStats();

  const health = Object.entries(stats).map(([name, serviceStats]) => ({
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
  }));

  res.json({
    status: 'ok',
    circuitBreakers: health,
  });
});
```

## Error Handling Middleware

```typescript
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  if (err.message === 'Service is currently unavailable') {
    res.status(503).json({ message: 'Service Unavailable' });
  } else {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
```

## Complete Example

```typescript
import express from 'express';
import axios from 'axios';
import { CircuitBreaker, CircuitBreakerLevel } from '@nodelibraries/circuit-breaker';

const app = express();
app.use(express.json());

const circuitBreaker = new CircuitBreaker({
  timeout: () => console.error('[Circuit Breaker] Timeout'),
  failure: () => console.error('[Circuit Breaker] Failure'),
  reject: () => console.warn('[Circuit Breaker] Reject'),
  open: () => console.error('[Circuit Breaker] Opened'),
  close: () => console.log('[Circuit Breaker] Closed'),
});

// User service
async function fetchUser(userId: number) {
  const response = await axios.get(`https://api.example.com/users/${userId}`);
  return response.data;
}

async function fallbackUser(userId: number) {
  return { id: userId, name: 'Unknown User', status: 'fallback' };
}

app.get('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  try {
    const user = await circuitBreaker.execute({
      level: CircuitBreakerLevel.External,
      name: 'fetchUser',
      requestFn: fetchUser,
      args: [userId],
      fallbackFn: fallbackUser,
      fallbackFnArgs: [userId],
    });

    res.json(user);
  } catch (error) {
    res.status(503).json({ message: 'Service Unavailable' });
  }
});

// Health check
app.get('/health/circuit-breakers', (req, res) => {
  const stats = circuitBreaker.getCircuitBreakerStats();
  res.json({ status: 'ok', circuitBreakers: stats });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## Next Steps

- Learn about [NestJS Integration](/examples/nestjs)
- Explore [Advanced Configuration](/examples/advanced)

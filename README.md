# Circuit Breaker

**@nodelibraries/circuit-breaker** is a lightweight and powerful solution designed to protect your applications from unexpected failures. Built on top of the robust [opossum](https://www.npmjs.com/package/opossum) circuit breaker library, it offers an intuitive API to seamlessly manage and control failure handling for your requests. Whether you're building a microservice architecture or managing complex network interactions, Circuit Breaker ensures your system remains resilient and fault-tolerant.

<p align="center">
  <img src="easy-circuit-breaker.png" width="200"/>
</p>

<p align="center">
  <a href="https://github.com/nodelibraries/circuit-breaker">
    <img src="https://img.shields.io/github/stars/nodelibraries/circuit-breaker?style=social" alt="GitHub stars"/>
  </a>
  <a href="https://www.npmjs.com/package/@nodelibraries/circuit-breaker">
    <img src="https://img.shields.io/npm/v/@nodelibraries/circuit-breaker.svg" alt="npm version"/>
  </a>
  <a href="https://www.npmjs.com/package/@nodelibraries/circuit-breaker">
    <img src="https://img.shields.io/npm/dm/@nodelibraries/circuit-breaker.svg" alt="npm downloads"/>
  </a>
  <a href="https://github.com/nodelibraries/circuit-breaker/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/@nodelibraries/circuit-breaker.svg" alt="License"/>
  </a>
</p>

## Features

- 🛡️ **Resilient by Default** - Protect your applications from cascading failures
- 🎯 **Simple API** - Easy to use with minimal configuration
- 🔄 **Multiple Levels** - Support for endpoint, service, application, database, and external service levels
- ⚡ **Event-Driven** - Comprehensive event handling for monitoring and logging
- 🎨 **Framework Agnostic** - Works with NestJS, Express, and any Node.js application
- 📊 **Statistics** - Built-in statistics tracking for all circuit breakers
- 🔧 **Flexible Configuration** - Customize timeout, error thresholds, and more
- 🚀 **TypeScript Support** - Full TypeScript support with type safety
- 📦 **Lightweight** - Minimal dependencies, built on top of opossum

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

## Documentation

📚 **[Full Documentation](https://nodelibraries.github.io/circuit-breaker/)** - Complete guide with examples and API reference

- [Installation Guide](https://nodelibraries.github.io/circuit-breaker/guide/installation)
- [Quick Start](https://nodelibraries.github.io/circuit-breaker/guide/quick-start)
- [API Reference](https://nodelibraries.github.io/circuit-breaker/api/)
- [Examples](https://nodelibraries.github.io/circuit-breaker/examples/)

## Installation

To install the library, run the following command:

```bash
npm install @nodelibraries/circuit-breaker
```

## Usage

### Importing the Library

```typescript
import {
  CircuitBreaker,
  CircuitBreakerLevel,
} from '@nodelibraries/circuit-breaker';
```

### nest.js example

```typescript
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import {
  CircuitBreaker,
  CircuitBreakerLevel,
} from '@nodelibraries/circuit-breaker';

@Injectable()
export class AppService {
  private readonly circuitBreaker: CircuitBreaker;
  private readonly logger = new Logger(AppService.name);

  constructor() {
    this.circuitBreaker = new CircuitBreaker({
      timeout: () => {
        this.logger.error('Circuit Breaker is timeout');
      },
      failure: () => {
        this.logger.error('Circuit Breaker is failure');
      },
      reject: () => {
        this.logger.error('Circuit Breaker is reject');
      },
    });
  }

  private readonly stockServiceUrl = 'http://localhost:3001/stock';

  async checkStock(productId: number): Promise<{ available: boolean }> {
    const response = await axios.get(`${this.stockServiceUrl}/${productId}`);
    return response.data;
  }

  async checkStockFallbackFunction() {
    return { available: true };
  }

  async createOrder(productId: number) {
    try {
      const result: { available: boolean } = await this.circuitBreaker.execute({
        level: CircuitBreakerLevel.Endpoint,
        requestFn: this.checkStock.bind(this),
        // fallbackFn: this.checkStockFallbackFunction.bind(this),
        name: 'checkStock',
        args: [productId],
      });

      if (result?.available) {
        return { message: 'Order placed successfully!' };
      } else {
        throw new HttpException(
          'Product is out of stock',
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      throw new HttpException(
        'Service Unavailable',
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
  }
}
```

### express.js example

```typescript
import express from 'express';
import axios from 'axios';
import {
  CircuitBreaker,
  CircuitBreakerLevel,
} from '@nodelibraries/circuit-breaker';

const app = express();
const port = 3000;

const circuitBreaker = new CircuitBreaker({
  timeout: () => console.error('Circuit Breaker timeout'),
  failure: () => console.error('Circuit Breaker failure'),
  reject: () => console.error('Circuit Breaker reject'),
});

const stockServiceUrl = 'http://localhost:3001/stock';

async function checkStock(productId: number): Promise<{ available: boolean }> {
  const response = await axios.get(`${stockServiceUrl}/${productId}`);
  return response.data;
}

async function checkStockFallbackFunction() {
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

### Fallback Function Example

You can provide a fallback function that will be called when the request fails. Below is an example of how to implement a fallback function:

```typescript
async checkStockFallbackFunction(productId: number) {
  return { available: true }; // Default fallback value
}

async createOrder(productId: number) {
  try {
    const result: { available: boolean } = await this.circuitBreaker.execute({
      level: CircuitBreakerLevel.Endpoint,
      requestFn: this.checkStock.bind(this),
      fallbackFn: this.checkStockFallbackFunction.bind(this),
      name: 'checkStock',
      args: [productId],
      fallbackFnArgs: [productId], // Pass args to fallback function
    });

    if (result?.available) {
      return { message: 'Order placed successfully!' };
    } else {
      throw new HttpException('Product is out of stock', HttpStatus.BAD_REQUEST);
    }
  } catch (error) {
    throw new HttpException('Service Unavailable', HttpStatus.SERVICE_UNAVAILABLE);
  }
}
```

## API

### Circuit Breaker Levels

- **Endpoint**: Circuit breaker for an individual endpoint.
- **Service**: Circuit breaker for a specific service.
- **Application**: Circuit breaker for the entire application.
- **Database**: Circuit breaker for database calls.
- **External**: Circuit breaker for external services.

### Circuit Breaker Constructor

The `CircuitBreaker` class takes an optional `eventHandlers` object, which can be used to handle various circuit breaker events:

```typescript
{
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

### Method: `execute`

The `execute` method runs the provided request function with circuit breaker protection:

```typescript
async execute<T>(params: CircuitBreakerParams<T>): Promise<T>;
```

#### Parameters:

- `params`: An object that contains:
  - `level`: (optional) The level of the circuit breaker
  - `name`: The name of the circuit breaker.
  - `requestFn`: The request function to be wrapped by the circuit breaker.
  - `args`: Arguments to be passed to the `requestFn`.
  - `fallbackFn`: (optional) fallback function to be executed in case of failure.
  - `fallbackFnArgs`: Arguments to be passed to the `fallbackFnArgs`.
  - `options`: (optional) custom circuit breaker options. If not provided the default values will be used.

#### Returns:

- A promise that resolves to the result of the `requestFn`.

#### Example:

```typescript
const result = await this.circuitBreaker.execute({
  level: CircuitBreakerLevel.Endpoint,
  requestFn: this.checkStock.bind(this),
  name: 'checkStock',
  args: [productId],
});
```

### Options

The following options can be provided when creating a circuit breaker:

- `timeout`: Max time (ms) for an operation to complete before failing. **Default: 3000ms**
- `errorThresholdPercentage`: Failure rate (%) to trigger circuit breaker. **Default: 50%**
- `resetTimeout`: Time (ms) before transitioning to "half-open" state. **Default: 5000ms**
- `rollingCountTimeout`: Time window (ms) for tracking statistics. **Default: 10000ms**
- `rollingCountBuckets`: Number of buckets in `rollingCountTimeout` window. **Default: 10**
- `name`: Custom name for the circuit breaker. **Default: 'CircuitBreaker'**
- `rollingPercentilesEnabled`: Enables percentile calculations. **Default: false**
- `capacity`: Max concurrent requests. **Default: 10**
- `enabled`: Enables circuit breaker on startup. **Default: true**
- `allowWarmUp`: Prevents early circuit opening by ignoring failures initially. **Default: false**
- `volumeThreshold`: Minimum requests before circuit breaker can open. **Default: 5**
- `errorFilter`: Ignores specific errors if function returns true. **Default: null**
- `cache`: Enables caching of first successful response. **Default: false**
- `cacheTTL`: Cache expiration time (ms), 0 means never expires. **Default: 0**
- `cacheGetKey`: Defines cache key. **Default: null**
- `cacheTransport`: Custom caching mechanism with `get`, `set`, `flush` methods. **Default: null**
- `abortController`: Uses `AbortController` to cancel async operations on timeout. **Default: false**
- `enableSnapshots`: Enables snapshot events for statistics. **Default: false**
- `rotateBucketController`: Shares `EventEmitter` for multiple circuit breakers. **Default: null**

## Contributing

We welcome contributions of all kinds! To contribute, please check out the [Contributing Guide](Contributing.md).

### Security Issues

If you find a security vulnerability, please refer to our [Security Policies and Procedures](Security.md).

## Author

@nodelibraries/circuit-breaker is developed and maintained by [Ferhat Yalçın](https://github.com/ylcnfrht).

## License

[MIT License](LICENSE)

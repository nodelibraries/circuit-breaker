# NestJS Integration

Example showing how to use **@nodelibraries/circuit-breaker** in a NestJS application.

## Installation

```bash
npm install @nodelibraries/circuit-breaker
```

## Service Example

```typescript
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { CircuitBreaker, CircuitBreakerLevel } from '@nodelibraries/circuit-breaker';

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

  private readonly stockServiceUrl = 'http://localhost:3001/stock';

  async checkStock(productId: number): Promise<{ available: boolean }> {
    const response = await axios.get(`${this.stockServiceUrl}/${productId}`);
    return response.data;
  }

  async checkStockFallbackFunction(productId: number) {
    this.logger.warn(`Using fallback for product ${productId}`);
    return { available: true };
  }

  async createOrder(productId: number) {
    try {
      const result: { available: boolean } = await this.circuitBreaker.execute({
        level: CircuitBreakerLevel.Endpoint,
        requestFn: this.checkStock.bind(this),
        fallbackFn: this.checkStockFallbackFunction.bind(this),
        name: 'checkStock',
        args: [productId],
        fallbackFnArgs: [productId],
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

## Controller Example

```typescript
import { Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('orders')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post(':productId')
  async createOrder(@Param('productId') productId: number) {
    return await this.appService.createOrder(productId);
  }
}
```

## Module Example

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## Using as a Global Service

You can also create a global circuit breaker service:

```typescript
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CircuitBreaker, CircuitBreakerLevel } from '@nodelibraries/circuit-breaker';

@Injectable()
export class CircuitBreakerService implements OnModuleInit {
  private readonly circuitBreaker: CircuitBreaker;
  private readonly logger = new Logger(CircuitBreakerService.name);

  constructor() {
    this.circuitBreaker = new CircuitBreaker({
      timeout: () => this.logger.error('Circuit Breaker timeout'),
      failure: () => this.logger.error('Circuit Breaker failure'),
      open: () => this.logger.error('Circuit Breaker opened'),
      close: () => this.logger.log('Circuit Breaker closed'),
    });
  }

  onModuleInit() {
    this.logger.log('Circuit Breaker Service initialized');
  }

  async execute<T>(params: {
    level?: CircuitBreakerLevel;
    name: string;
    requestFn: (...args: any[]) => Promise<T>;
    args?: any[];
    fallbackFn?: (...args: any[]) => Promise<T>;
    fallbackFnArgs?: any[];
    options?: any;
  }): Promise<T> {
    return await this.circuitBreaker.execute(params);
  }

  getStats() {
    return this.circuitBreaker.getCircuitBreakerStats();
  }
}
```

Then use it in your services:

```typescript
@Injectable()
export class UserService {
  constructor(private readonly circuitBreaker: CircuitBreakerService) {}

  async getUser(userId: number) {
    return await this.circuitBreaker.execute({
      level: CircuitBreakerLevel.External,
      name: 'getUser',
      requestFn: async () => {
        // Your async operation
        return await fetchUser(userId);
      },
      args: [userId],
      fallbackFn: () => ({ id: userId, name: 'Unknown User' }),
    });
  }
}
```

## Health Check Endpoint

```typescript
import { Controller, Get } from '@nestjs/common';
import { CircuitBreakerService } from './circuit-breaker.service';

@Controller('health')
export class HealthController {
  constructor(private readonly circuitBreaker: CircuitBreakerService) {}

  @Get('circuit-breakers')
  getCircuitBreakerStats() {
    return {
      status: 'ok',
      circuitBreakers: this.circuitBreaker.getStats(),
    };
  }
}
```

## Next Steps

- Learn about [Express Integration](/examples/express)
- Explore [Advanced Configuration](/examples/advanced)

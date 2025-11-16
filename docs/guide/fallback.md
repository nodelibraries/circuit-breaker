# Fallback Functions

Fallback functions provide a way to handle failures gracefully by returning a default value or executing alternative logic when the circuit breaker is open or a request fails.

## Basic Usage

```typescript
async function fetchUserData(userId: number) {
  const response = await axios.get(`https://api.example.com/users/${userId}`);
  return response.data;
}

async function fallbackUserData(userId: number) {
  return {
    id: userId,
    name: 'Unknown User',
    email: 'unknown@example.com',
    status: 'fallback',
  };
}

const user = await circuitBreaker.execute({
  name: 'fetchUserData',
  requestFn: fetchUserData,
  args: [userId],
  fallbackFn: fallbackUserData,
});
```

## When Fallback is Executed

The fallback function is executed in the following scenarios:

1. **Circuit is Open**: When the circuit breaker is in the open state
2. **Request Fails**: When the request function throws an error
3. **Request Timeout**: When the request exceeds the timeout
4. **Request Rejected**: When the request is rejected (e.g., capacity exceeded)

## Fallback with Arguments

You can pass arguments to the fallback function:

```typescript
async function fallbackUserData(userId: number, includeEmail: boolean) {
  const user = {
    id: userId,
    name: 'Unknown User',
    status: 'fallback',
  };

  if (includeEmail) {
    user.email = 'unknown@example.com';
  }

  return user;
}

const user = await circuitBreaker.execute({
  name: 'fetchUserData',
  requestFn: fetchUserData,
  args: [userId, true],
  fallbackFn: fallbackUserData,
  fallbackFnArgs: [userId, true], // Pass same arguments to fallback
});
```

## Default Fallback

If you don't provide a fallback function, a default fallback is used that throws an error:

```typescript
// No fallback provided - will throw "Service is currently unavailable"
const user = await circuitBreaker.execute({
  name: 'fetchUserData',
  requestFn: fetchUserData,
  args: [userId],
  // No fallbackFn - will use default
});
```

## Example: Returning Cached Data

```typescript
const cache = new Map<number, User>();

async function fetchUserData(userId: number): Promise<User> {
  const response = await axios.get(`https://api.example.com/users/${userId}`);
  const user = response.data;
  cache.set(userId, user); // Cache the user
  return user;
}

async function fallbackUserData(userId: number): Promise<User> {
  // Try to return cached data
  const cachedUser = cache.get(userId);
  if (cachedUser) {
    return { ...cachedUser, status: 'cached' };
  }

  // Return default user
  return {
    id: userId,
    name: 'Unknown User',
    email: 'unknown@example.com',
    status: 'fallback',
  };
}

const user = await circuitBreaker.execute({
  name: 'fetchUserData',
  requestFn: fetchUserData,
  args: [userId],
  fallbackFn: fallbackUserData,
});
```

## Example: Multiple Fallback Strategies

```typescript
async function fetchUserData(userId: number): Promise<User> {
  const response = await axios.get(`https://api.example.com/users/${userId}`);
  return response.data;
}

async function fallbackUserData(userId: number): Promise<User> {
  // Strategy 1: Try to fetch from database
  try {
    const user = await db.findUser(userId);
    if (user) {
      return { ...user, source: 'database' };
    }
  } catch (error) {
    // Database also failed, continue to next strategy
  }

  // Strategy 2: Try to fetch from cache
  const cachedUser = cache.get(userId);
  if (cachedUser) {
    return { ...cachedUser, source: 'cache' };
  }

  // Strategy 3: Return default user
  return {
    id: userId,
    name: 'Unknown User',
    email: 'unknown@example.com',
    source: 'default',
  };
}

const user = await circuitBreaker.execute({
  name: 'fetchUserData',
  requestFn: fetchUserData,
  args: [userId],
  fallbackFn: fallbackUserData,
});
```

## Example: Logging in Fallback

```typescript
async function fallbackUserData(userId: number): Promise<User> {
  console.warn(`Fallback executed for user ${userId}`);

  // Log to monitoring system
  logToMonitoring({
    event: 'fallback_executed',
    userId,
    timestamp: new Date(),
  });

  return {
    id: userId,
    name: 'Unknown User',
    status: 'fallback',
  };
}
```

## Example: NestJS Integration

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { CircuitBreaker, CircuitBreakerLevel } from '@nodelibraries/circuit-breaker';

@Injectable()
export class UserService {
  private readonly circuitBreaker: CircuitBreaker;
  private readonly logger = new Logger(UserService.name);

  constructor() {
    this.circuitBreaker = new CircuitBreaker({
      fallback: () => {
        this.logger.warn('Fallback function executed');
      },
    });
  }

  async getUser(userId: number) {
    return await this.circuitBreaker.execute({
      level: CircuitBreakerLevel.External,
      name: 'getUser',
      requestFn: this.fetchUser.bind(this),
      args: [userId],
      fallbackFn: this.fallbackUser.bind(this),
    });
  }

  private async fetchUser(userId: number) {
    const response = await axios.get(`https://api.example.com/users/${userId}`);
    return response.data;
  }

  private async fallbackUser(userId: number) {
    this.logger.warn(`Using fallback for user ${userId}`);
    return {
      id: userId,
      name: 'Unknown User',
      status: 'fallback',
    };
  }
}
```

## Best Practices

1. **Always Provide Fallback**: Always provide a fallback function for critical operations
2. **Return Similar Structure**: Fallback should return data in the same format as the original function
3. **Log Fallback Execution**: Log when fallback is executed for monitoring
4. **Use Cached Data**: If possible, return cached data in fallback
5. **Graceful Degradation**: Provide meaningful default values

## Next Steps

- Learn about [Statistics](/guide/statistics)
- Explore [Configuration Options](/guide/configuration)
- Check out [Examples](/examples/)

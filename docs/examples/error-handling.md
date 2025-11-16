# Error Handling

Example showing how to handle errors with circuit breakers.

## Basic Error Handling

```typescript
import { CircuitBreaker, CircuitBreakerLevel } from '@nodelibraries/circuit-breaker';

const circuitBreaker = new CircuitBreaker();

try {
  const result = await circuitBreaker.execute({
    level: CircuitBreakerLevel.External,
    name: 'myService',
    requestFn: myAsyncFunction,
    args: [data],
    fallbackFn: () => ({ default: 'value' }),
  });

  // Use the result
  console.log('Result:', result);
} catch (error) {
  // Handle errors
  console.error('Error:', error);

  if (error.message === 'Service is currently unavailable') {
    // Circuit breaker is open or fallback failed
    console.error('Service unavailable');
  } else {
    // Other errors
    console.error('Unexpected error:', error);
  }
}
```

## Fallback Error Handling

The fallback function can also throw errors:

```typescript
async function fallbackFunction(data: any) {
  try {
    // Try alternative approach
    return await alternativeService.getData(data);
  } catch (error) {
    // If fallback also fails, throw error
    throw new Error('Fallback also failed');
  }
}

try {
  const result = await circuitBreaker.execute({
    level: CircuitBreakerLevel.External,
    name: 'myService',
    requestFn: myAsyncFunction,
    args: [data],
    fallbackFn: fallbackFunction,
  });
} catch (error) {
  // Handle both main function and fallback errors
  console.error('All attempts failed:', error);
}
```

## Error Filter

Use error filter to ignore specific errors:

```typescript
const result = await circuitBreaker.execute({
  level: CircuitBreakerLevel.External,
  name: 'myService',
  requestFn: myAsyncFunction,
  args: [data],
  options: {
    errorFilter: (error) => {
      // Ignore 404 errors - don't count as failures
      if (error.response?.status === 404) {
        return true; // This error won't count as a failure
      }

      // Ignore validation errors - don't count as failures
      if (
        error.response?.status === 400 &&
        error.response?.data?.code === 'VALIDATION_ERROR'
      ) {
        return true;
      }

      return false; // Other errors will count as failures
    },
  },
});
```

## Custom Error Messages

```typescript
async function myAsyncFunction(data: any) {
  try {
    const response = await axios.get('https://api.example.com/data', { data });
    return response.data;
  } catch (error) {
    // Wrap error with more context
    throw new Error(`Failed to fetch data: ${error.message}`);
  }
}

async function fallbackFunction(data: any) {
  // Return default value instead of throwing
  return {
    data: null,
    error: 'Service unavailable',
    timestamp: new Date(),
  };
}

try {
  const result = await circuitBreaker.execute({
    level: CircuitBreakerLevel.External,
    name: 'myService',
    requestFn: myAsyncFunction,
    args: [data],
    fallbackFn: fallbackFunction,
  });

  if (result.error) {
    // Handle fallback result
    console.warn('Using fallback data:', result);
  } else {
    // Use normal result
    console.log('Data:', result);
  }
} catch (error) {
  console.error('Error:', error);
}
```

## Error Logging

```typescript
const circuitBreaker = new CircuitBreaker({
  failure: (error) => {
    console.error('Request failed:', error);
    // Log to monitoring system
    logToMonitoring({
      event: 'circuit_breaker_failure',
      error: error.message,
      timestamp: new Date(),
    });
  },
  timeout: () => {
    console.error('Request timeout');
    logToMonitoring({
      event: 'circuit_breaker_timeout',
      timestamp: new Date(),
    });
  },
  open: () => {
    console.error('Circuit breaker opened');
    // Send alert
    sendAlert({
      severity: 'critical',
      message: 'Circuit breaker opened',
      timestamp: new Date(),
    });
  },
});

try {
  const result = await circuitBreaker.execute({
    level: CircuitBreakerLevel.External,
    name: 'myService',
    requestFn: myAsyncFunction,
    args: [data],
  });
} catch (error) {
  // Error is already logged by event handlers
  // Handle error appropriately
  throw error;
}
```

## Retry Logic with Circuit Breaker

```typescript
async function retryWithCircuitBreaker(
  requestFn: () => Promise<any>,
  maxRetries: number = 3
) {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await circuitBreaker.execute({
        level: CircuitBreakerLevel.External,
        name: 'myService',
        requestFn,
        args: [],
      });

      return result;
    } catch (error) {
      lastError = error;

      // Don't retry if circuit is open
      if (error.message === 'Service is currently unavailable') {
        throw error;
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }

  throw lastError!;
}

try {
  const result = await retryWithCircuitBreaker(() => myAsyncFunction(data), 3);
} catch (error) {
  console.error('All retries failed:', error);
}
```

## Next Steps

- Learn about [Advanced Configuration](/examples/advanced)
- Explore [Multiple Circuit Breakers](/examples/multiple)

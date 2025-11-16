# Installation

## Prerequisites

- Node.js 14.x or higher
- npm or yarn package manager

## Install via npm

```bash
npm install @nodelibraries/circuit-breaker
```

## Install via yarn

```bash
yarn add @nodelibraries/circuit-breaker
```

## Install via pnpm

```bash
pnpm add @nodelibraries/circuit-breaker
```

## TypeScript Support

The library is written in TypeScript and includes type definitions. No additional `@types` package is required.

## Peer Dependencies

**@nodelibraries/circuit-breaker** depends on:

- `opossum` - The underlying circuit breaker library

These dependencies are automatically installed when you install `@nodelibraries/circuit-breaker`.

## Verify Installation

After installation, you can verify that everything is working correctly:

```typescript
import {
  CircuitBreaker,
  CircuitBreakerLevel,
} from '@nodelibraries/circuit-breaker';

console.log('Circuit Breaker installed successfully!');
```

## Next Steps

- [Quick Start](/guide/quick-start) - Get started with your first circuit breaker
- [Configuration](/guide/configuration) - Learn about configuration options

import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Circuit Breaker',
  description:
    'A lightweight wrapper around opossum for easier circuit breaker management',
  base: '/circuit-breaker/',

  themeConfig: {
    logo: '/easy-circuit-breaker.png',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: 'Examples', link: '/examples/' },
      {
        text: 'GitHub',
        link: 'https://github.com/nodelibraries/circuit-breaker',
      },
      {
        text: '☕ Buy Me a Coffee',
        link: 'https://www.buymeacoffee.com/ylcnfrht',
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' },
          ],
        },
        {
          text: 'Concepts',
          items: [
            { text: 'Circuit Breaker Levels', link: '/guide/levels' },
            { text: 'Event Handlers', link: '/guide/event-handlers' },
            { text: 'Configuration Options', link: '/guide/configuration' },
            { text: 'Fallback Functions', link: '/guide/fallback' },
            { text: 'Statistics', link: '/guide/statistics' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'CircuitBreaker', link: '/api/circuit-breaker' },
            { text: 'CircuitBreakerLevel', link: '/api/circuit-breaker-level' },
            { text: 'Types', link: '/api/types' },
          ],
        },
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Overview', link: '/examples/' },
            { text: 'Basic Usage', link: '/examples/basic' },
            { text: 'NestJS Integration', link: '/examples/nestjs' },
            { text: 'Express Integration', link: '/examples/express' },
            { text: 'Advanced Configuration', link: '/examples/advanced' },
            { text: 'Multiple Circuit Breakers', link: '/examples/multiple' },
            { text: 'Error Handling', link: '/examples/error-handling' },
          ],
        },
      ],
    },

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/nodelibraries/circuit-breaker',
      },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright:
        'Copyright © 2025 ylcnfrht | <a href="https://www.buymeacoffee.com/ylcnfrht" target="_blank">☕ Buy Me a Coffee</a>',
    },
  },
});

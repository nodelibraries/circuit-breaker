import { h } from 'vue';
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import './custom.css';

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-title-after': () =>
        h('a', {
          href: 'https://www.buymeacoffee.com/ylcnfrht',
          target: '_blank',
          rel: 'noopener noreferrer',
          class: 'buy-me-coffee-header',
          style: {
            marginLeft: '1rem',
            display: 'inline-flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'var(--vp-c-text-1)',
            fontSize: '0.875rem',
            fontWeight: '500',
            transition: 'opacity 0.25s',
          },
          onMouseenter: (e: MouseEvent) => {
            (e.target as HTMLElement).style.opacity = '0.8';
          },
          onMouseleave: (e: MouseEvent) => {
            (e.target as HTMLElement).style.opacity = '1';
          },
        }, '☕ Buy Me a Coffee'),
    });
  },
} satisfies Theme;


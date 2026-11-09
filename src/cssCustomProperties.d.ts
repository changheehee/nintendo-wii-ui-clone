import 'react';

declare module 'react' {
  interface CSSProperties {
    readonly '--page-index'?: number;
  }
}

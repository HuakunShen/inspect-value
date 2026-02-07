/**
 * Type declarations for inspect-value-element custom elements.
 * Provides autocomplete in React (JSX) and Vue templates.
 */

interface InspectValueAttributes {
  value?: any;
  name?: string;
  theme?: string;
  search?: boolean | 'highlight' | 'filter' | 'filter-strict';
  depth?: number;
  showTypes?: boolean;
  showLength?: boolean;
  showPreview?: boolean;
  expandAll?: boolean;
}

interface InspectPanelAttributes {
  values?: any;
  value?: any;
  name?: string;
  theme?: string;
  search?: boolean | 'highlight' | 'filter' | 'filter-strict';
  depth?: number;
  position?: string;
  open?: boolean;
  height?: string;
  width?: string;
  showTypes?: boolean;
  showLength?: boolean;
  showPreview?: boolean;
}

// React JSX types
declare namespace JSX {
  interface IntrinsicElements {
    'inspect-value': InspectValueAttributes &
      React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'inspect-panel': InspectPanelAttributes &
      React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}

// Vue types
declare module 'vue' {
  export interface GlobalComponents {
    'inspect-value': InspectValueAttributes;
    'inspect-panel': InspectPanelAttributes;
  }
}

export {};

/**
 * Type declarations for inspect-value-element custom elements.
 *
 * The `theme` and `search` types are derived from svelte-inspect-value's
 * InspectOptions so they stay in sync with upstream automatically.
 * Other props (depth, position, height, width) are specific to the
 * web component wrapper.
 */

import type { InspectOptions } from 'svelte-inspect-value';

// ─── Derived attribute interfaces ────────────────────────────

export interface InspectValueAttributes {
  /** The value to inspect. Must be set via the DOM property for non-primitives. */
  value?: unknown;
  /** Label displayed before the value. */
  name?: string;
  /** Color theme. */
  theme?: InspectOptions['theme'];
  /** Enable search. */
  search?: InspectOptions['search'];
  /** Max expansion depth. Nodes deeper than this start collapsed. */
  depth?: number;
  /** Show type annotations next to values. */
  showTypes?: InspectOptions['showTypes'];
  /** Show collection lengths (e.g., Array(3)). */
  showLength?: InspectOptions['showLength'];
  /** Show inline previews for collapsed objects/arrays. */
  showPreview?: InspectOptions['showPreview'];
  /** Expand all nodes on render. */
  expandAll?: InspectOptions['expandAll'];
}

export interface InspectPanelAttributes {
  /** A single value to inspect. */
  value?: unknown;
  /** Multiple values to inspect (displayed as a list). */
  values?: unknown;
  /** Label displayed in the panel header. */
  name?: string;
  /** Color theme. */
  theme?: InspectOptions['theme'];
  /** Enable search. */
  search?: InspectOptions['search'];
  /** Max expansion depth. */
  depth?: number;
  /** Panel position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'. */
  position?: string;
  /** Whether the panel is expanded. */
  open?: boolean;
  /** Panel height when open (CSS value, e.g. '40vh'). */
  height?: string;
  /** Panel width (CSS value, e.g. '100%'). */
  width?: string;
  /** Z-index for the panel. Defaults to 9999 to stay above most UI. */
  zIndex?: number;
  /** Show type annotations next to values. */
  showTypes?: InspectOptions['showTypes'];
  /** Show collection lengths. */
  showLength?: InspectOptions['showLength'];
  /** Show inline previews. */
  showPreview?: InspectOptions['showPreview'];
}

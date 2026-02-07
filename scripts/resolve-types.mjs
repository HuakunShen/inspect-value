/**
 * Resolves InspectOptions property types from svelte-inspect-value at build time
 * and generates a standalone dist/index.d.ts with no external imports.
 *
 * This ensures that theme, search, etc. type literals stay in sync with upstream
 * while consumers don't need svelte-inspect-value installed.
 */

import ts from 'typescript';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// Create a program from the types entry file
const configPath = resolve(root, 'tsconfig.types.json');
const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
const parsedConfig = ts.parseJsonConfigFileContent(configFile.config, ts.sys, root);

const program = ts.createProgram(
  [resolve(root, 'src/types.ts')],
  parsedConfig.options
);
const checker = program.getTypeChecker();

// Find the InspectOptions type from svelte-inspect-value
const sourceFile = program.getSourceFile(resolve(root, 'src/types.ts'));
if (!sourceFile) throw new Error('Could not find src/types.ts');

// Resolve a specific property type from InspectOptions
function resolveOptionType(propName) {
  // Find the import declaration
  for (const stmt of sourceFile.statements) {
    if (ts.isImportDeclaration(stmt)) {
      const importClause = stmt.importClause;
      if (!importClause?.namedBindings || !ts.isNamedImports(importClause.namedBindings)) continue;

      for (const specifier of importClause.namedBindings.elements) {
        if (specifier.name.text === 'InspectOptions') {
          const symbol = checker.getSymbolAtLocation(specifier.name);
          if (!symbol) continue;
          const type = checker.getDeclaredTypeOfSymbol(symbol);
          const prop = type.getProperty(propName);
          if (!prop) throw new Error(`Property '${propName}' not found on InspectOptions`);
          const propType = checker.getTypeOfSymbolAtLocation(prop, sourceFile);
          return checker.typeToString(propType, sourceFile, ts.TypeFormatFlags.NoTruncation);
        }
      }
    }
  }
  throw new Error('Could not find InspectOptions import');
}

// Resolve the types we need
const theme = resolveOptionType('theme');
const search = resolveOptionType('search');
const showTypes = resolveOptionType('showTypes');
const showLength = resolveOptionType('showLength');
const showPreview = resolveOptionType('showPreview');
const expandAll = resolveOptionType('expandAll');

const output = `\
/**
 * Type declarations for inspect-value-element custom elements.
 * Provides autocomplete in React (JSX) and Vue templates.
 *
 * Types for theme, search, showTypes, showLength, showPreview, and expandAll
 * are resolved from svelte-inspect-value's InspectOptions at build time.
 *
 * @module
 */

export interface InspectValueAttributes {
  /** The value to inspect. Must be set via the DOM property for non-primitives. */
  value?: unknown;
  /** Label displayed before the value. */
  name?: string;
  /** Color theme. */
  theme?: ${theme};
  /** Enable search. */
  search?: ${search};
  /** Max expansion depth. Nodes deeper than this start collapsed. */
  depth?: number;
  /** Show type annotations next to values. */
  showTypes?: ${showTypes};
  /** Show collection lengths (e.g., Array(3)). */
  showLength?: ${showLength};
  /** Show inline previews for collapsed objects/arrays. */
  showPreview?: ${showPreview};
  /** Expand all nodes on render. */
  expandAll?: ${expandAll};
}

export interface InspectPanelAttributes {
  /** A single value to inspect. */
  value?: unknown;
  /** Multiple values to inspect (displayed as a list). */
  values?: unknown;
  /** Label displayed in the panel header. */
  name?: string;
  /** Color theme. */
  theme?: ${theme};
  /** Enable search. */
  search?: ${search};
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
  showTypes?: ${showTypes};
  /** Show collection lengths. */
  showLength?: ${showLength};
  /** Show inline previews. */
  showPreview?: ${showPreview};
}

// ─── React JSX augmentation ──────────────────────────────────

declare namespace JSX {
  interface IntrinsicElements {
    'inspect-value': InspectValueAttributes &
      React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'inspect-panel': InspectPanelAttributes &
      React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}

// ─── Vue template augmentation ───────────────────────────────

declare module 'vue' {
  export interface GlobalComponents {
    'inspect-value': InspectValueAttributes;
    'inspect-panel': InspectPanelAttributes;
  }
}

export {};
`;

writeFileSync(resolve(root, 'dist/index.d.ts'), output);

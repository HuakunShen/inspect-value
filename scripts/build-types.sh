#!/bin/sh
# Generate dist/index.d.ts with types resolved from svelte-inspect-value.
#
# Uses a Node script to resolve InspectOptions property types at build time,
# producing a standalone .d.ts with no external dependencies.

set -e

node scripts/resolve-types.mjs
echo "Generated dist/index.d.ts"

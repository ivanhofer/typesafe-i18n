import { build } from 'esbuild'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

//@ts-ignore
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const watch = process.argv.includes('--watch')

const getPath = (file: string) => resolve(__dirname, file)

build({
	entryPoints: [getPath('src/cli.ts')],
	bundle: true,
	outfile: getPath('../../cli/typesafe-i18n.mjs'),
	platform: 'node',
	external: ['typescript'],
	banner: {
		js: `#!/usr/bin/env node
import { createRequire } from 'module'
global.require = createRequire(import.meta.url)

import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)`,
	},
	format: 'esm',
	sourcemap: false,
	watch,
	tsconfig: './tsconfig.json',
}).catch(() => process.exit(1))

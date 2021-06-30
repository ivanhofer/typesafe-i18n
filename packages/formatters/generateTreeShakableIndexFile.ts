import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const content = readFileSync(resolve(__dirname, './src/index.ts')).toString()

writeFileSync(
	resolve(__dirname, '../../formatters/index.mjs'),
	content,
	{ encoding: 'utf8' },
)
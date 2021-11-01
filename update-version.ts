import { writeFileSync } from 'fs'
import { version } from './package.json'

writeFileSync(
	'./packages/version.ts',
	`// this file gets auto-generated
export const version = '${version}'
`,
)

// eslint-disable-next-line no-console
console.log(`version set to ${version}`)

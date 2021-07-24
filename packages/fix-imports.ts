import { readFileSync, writeFileSync } from "fs";
import { sync as glob } from 'glob';
import { resolve } from 'path';

const rootPath = resolve(__dirname, '..')

const formats = [
	{ regex: /require\("\.(.*)"\)/g, fileEnding: "cjs" },
	{ regex: /port .* from '\.(.*)'/g, fileEnding: "mjs" }
]

const folders = [
	'adapters',
	'detectors',
	'cjs',
	'esm',
	'formatters',
	'react',
	'svelte',
]

formats.forEach(({ regex, fileEnding }) => {
	const files = folders.flatMap(folder => glob(resolve(__dirname, `../${folder}/**/*.${fileEnding}`)))

	files.forEach(file => {
		const fullFilePath = resolve(__dirname, file)

		const content = readFileSync(fullFilePath).toString()

		const newContent = content
			.replace(regex, (requireStatement, path) => requireStatement.replace(path, path + `.${fileEnding}`))

		writeFileSync(
			fullFilePath,
			newContent,
			{ encoding: 'utf8' },
		)

		// eslint-disable-next-line no-console
		console.info(`fixed '${fileEnding}' imports for '.${file.replace(rootPath, '')}'`)
	})
});

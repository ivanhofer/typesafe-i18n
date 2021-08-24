// this file will replace all the expected.js files with their _actual equivalents
import fs from 'fs'
import glob from 'tiny-glob/sync.js'

glob('**/*.actual.*', { cwd: __dirname }).forEach((file) => {
	const actual = fs.readFileSync(`${__dirname}/${file}`, 'utf-8')
	fs.writeFileSync(`${__dirname}/${file.replace('.actual.', '.expected.')}`, actual)
})

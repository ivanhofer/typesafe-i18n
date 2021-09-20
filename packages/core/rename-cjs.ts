import { rename } from 'fs'
import { sync as glob } from 'glob'
import { resolve } from 'path'

const files = glob(resolve(__dirname, `../../cjs/**/*.js`))

files.forEach((file) =>
	rename(file, file.replace('.js', '.cjs'), () => {
		undefined
	}),
)

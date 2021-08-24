import { rename } from "fs"
import { sync as glob } from 'glob'
import { resolve } from 'path'

const files = glob(resolve(__dirname, `../../esm/**/*.js`))

files.forEach(file => rename(file, file.replace('.js', '.mjs'), () => { undefined }))
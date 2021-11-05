import { execSync } from 'child_process'
import path from 'path'
import { PackageJson } from 'type-fest'
import { importFile, readFile, writeFile } from '../../../generator/src/file-utils'
import { logger } from '../../../generator/src/generator-util'

const packageJsonPath = path.resolve('package.json')
let pck: PackageJson | undefined = undefined

const readPackageJson = async () => pck || (pck = await importFile<PackageJson | undefined>(packageJsonPath, false))

// --------------------------------------------------------------------------------------------------------------------

export const isEsmProject = async () => {
	const pck = await readPackageJson()

	return pck?.type === 'module'
}

// --------------------------------------------------------------------------------------------------------------------

export const getDependencyList = async () => {
	const pck = await readPackageJson()

	const dependencyList = Object.keys(pck?.dependencies || {})
	const devDependencyList = Object.keys(pck?.devDependencies || {})
	const peerDependencyList = Object.keys(pck?.peerDependencies || {})
	return [...dependencyList, ...devDependencyList, ...peerDependencyList]
}

// --------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

const installDependencies = async () => {
	const dependencies = await getDependencyList()
	if (dependencies.includes('typesafe-i18n')) return

	logger.info('installing dependencies ...')

	if (!pck) {
		const output = execSync('npm init -y').toString()
		// eslint-disable-next-line no-console
		console.log(output)
	}

	const output = execSync('npm i typesafe-i18n').toString()
	// eslint-disable-next-line no-console
	console.log(output)
}

// --------------------------------------------------------------------------------------------------------------------

// detects the amount of whitespace before and after the current scripts
const REGEX_DETECT_SCRIPT_SECTION = /"scripts":\s*{(?<begin>\s*)("([^"]|\\")*":\s*"([^"]|\\")*"(,\s*)?)*(?<end>\s+)}/gm

const addTypesafeI18nScript = async () => {
	const pck = await readPackageJson()
	if (pck?.scripts?.['typesafe-i18n']) return

	const content = await readFile(packageJsonPath)

	const { begin = '', end = '' } = REGEX_DETECT_SCRIPT_SECTION.exec(content)?.groups || {}

	if (!begin || !end) {
		logger.warn(`could not add 'typesafe-i18n' script to 'package.json'. You need to add it manually.`)
		return
	}

	const newContent = content.replace(REGEX_DETECT_SCRIPT_SECTION, (content) => {
		const lastIndex = content.lastIndexOf(end)
		return content.substring(0, lastIndex) + `,${begin}"typesafe-i18n": "typesafe-i18n"${end}}`
	})

	await writeFile(packageJsonPath, newContent)

	logger.info(`'typesafe-i18n' script added`)
}

// --------------------------------------------------------------------------------------------------------------------

export const updatePackageJson = async () => {
	await installDependencies()
	await addTypesafeI18nScript()
}

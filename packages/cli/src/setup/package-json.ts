import { execSync } from 'child_process'
import path from 'path'
import type { PackageJson } from 'type-fest'
import { doesPathExist, importFile, readFile, writeFile } from '../../../generator/src/file-utils'
import { logger } from '../../../generator/src/generator-util'

// --------------------------------------------------------------------------------------------------------------------

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

const npmLockPath = path.resolve('package-lock.json')
const yarnLockPath = path.resolve('yarn.lock')
const pnpmLockPath = path.resolve('pnpm-lock.yaml')

const getInstallCommand = async (): Promise<string | undefined> => {
	if (await doesPathExist(npmLockPath)) {
		return 'npm install typesafe-i18n'
	}

	if (await doesPathExist(yarnLockPath)) {
		return 'yarn add typesafe-i18n'
	}

	if (await doesPathExist(pnpmLockPath)) {
		return 'pnpm add typesafe-i18n'
	}

	logger.error(
		`Unsupported package manager. Please install the 'typesafe-i18n' npm-package manually and open a new issue at https://github.com/ivanhofer/typesafe-i18n/issues and tell us what package manager you are using.`,
	)

	return undefined
}

// --------------------------------------------------------------------------------------------------------------------

const installDependencies = async () => {
	const dependencies = await getDependencyList()
	if (dependencies.includes('typesafe-i18n')) return true

	if (!pck) {
		logger.error(`no 'package.json' found. You have to install 'typesafe-i18n' by yourself`)
		return false
	}

	logger.info('installing dependencies ...')

	const installCommand = await getInstallCommand()
	if (!installCommand) return false

	const output = execSync(installCommand).toString()
	// eslint-disable-next-line no-console
	console.log(output)

	return true
}

// --------------------------------------------------------------------------------------------------------------------

// detects the amount of whitespace before and after the current scripts
const REGEX_DETECT_SCRIPT_SECTION = /"scripts":\s*{(?<begin>\s*)("([^"]|\\")*":\s*"([^"]|\\")*"(,\s*)?)*(?<end>\s+)}/gm

const addTypesafeI18nScript = async () => {
	const pck = await readPackageJson()
	if (pck?.scripts?.['typesafe-i18n']) return true

	const content = await readFile(packageJsonPath)

	const { begin = '', end = '' } = REGEX_DETECT_SCRIPT_SECTION.exec(content)?.groups || {}

	if (!begin || !end) {
		logger.warn(`could not add 'typesafe-i18n' script to 'package.json'. You need to add it manually.`)
		return false
	}

	const newContent = content.replace(REGEX_DETECT_SCRIPT_SECTION, (content) => {
		const lastIndex = content.lastIndexOf(end)
		return content.substring(0, lastIndex) + `,${begin}"typesafe-i18n": "typesafe-i18n"${end}}`
	})

	await writeFile(packageJsonPath, newContent)

	logger.info(`'typesafe-i18n' script added`)

	return true
}

// --------------------------------------------------------------------------------------------------------------------

export const updatePackageJson = async (): Promise<boolean> => {
	let installed = await installDependencies()
	installed = installed && (await addTypesafeI18nScript())

	return installed
}

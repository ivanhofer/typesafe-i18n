export type FileSystemUtil = {
	readFile: (path: string | Buffer | URL) => Promise<string | Buffer>
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	readdir: (path: string | Buffer | URL, options?: any) => Promise<(string | Buffer)[] | Dirent[]>
}

type Dirent = { name: string | Buffer; isDirectory: () => boolean }

type GetFilesType = { name: string; folder: string }

const getFiles = async (fs: FileSystemUtil, path: string, depth = 0): Promise<GetFilesType[]> => {
	const entries = (await fs.readdir(path, { withFileTypes: true })) as Dirent[]

	const files = entries
		.filter((file) => !file.isDirectory())
		.map(({ name }) => ({ name: name.toString(), folder: '' }))

	const folders = entries.filter((folder) => folder.isDirectory())

	if (depth) {
		for (const folder of folders)
			files.push(
				...(await getFiles(fs, `${path}/${folder.name}/`, depth - 1)).map((file) => ({
					name: file.name.toString(),
					folder: folder.name.toString(),
				})),
			)
	}

	return files
}

export const getAllLocales = async (
	fs: FileSystemUtil,
	path: string,
	outputFormat: 'TypeScript' | 'JavaScript',
): Promise<string[]> => {
	const fileEnding = outputFormat === 'JavaScript' ? '.js' : '.ts'
	const files = await getFiles(fs, path, 1)

	return files.filter(({ folder, name }) => folder && name === `index${fileEnding}`).map(({ folder }) => folder)
}

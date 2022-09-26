import { typesafeI18nObject } from './util.object.mjs'

{
	const translations = {
		test: 'test',
		'with-arg': 'Hello {name:string}',
		something: 'test {abc} {cde}',
		optional: '{a?:number}',
		switch: 'Added a new photo to {gender|{male: his, female: her}} stream.',
		switchWithOtherArguments:
			'{name:string} added a new photo to {gender|{male: his, female: her, other: their}} stream.',
	} as const

	const LL = typesafeI18nObject('en', translations)

	// @ts-expect-error no argument allowed
	LL.test('')

	LL['with-arg']({ name: 'TypeScript' })
	// @ts-expect-error name must be of type number
	LL['with-arg']({ name: 123 })
	// @ts-expect-error names is not allowed
	LL['with-arg']({ names: '' })

	// @ts-expect-error expects an argument
	LL.something()
	// @ts-expect-error expects all arguments
	LL.something({ abc: true })
	LL.something({ abc: true, cde: false })
	LL.something({ abc: true, cde: false })

	LL.optional({})
	LL.optional({ a: undefined })
	LL.optional({ a: 123 })
	// @ts-expect-error prop must be of type number
	LL.optional({ a: '' })

	// @ts-expect-error expects an argument
	LL.switch()
	// @ts-expect-error expects an argument of type string
	LL.switch({ gender: 123 })
	// @ts-expect-error expects an argument of 'male' | 'female'
	LL.switch({ gender: 'some string' })
	LL.switch({ gender: 'male' })
	LL.switchWithOtherArguments({ name: 'Alex', gender: 'other' })
}

{
	const translations = {
		upper: '{a|uppercase}',
		invalid: '{a|lowercase}',
		chained: 'Added a new photo to {gender|uppercase|{male: his, female: her, *: their}} stream',
	} as const

	const LL = typesafeI18nObject('en', translations, {
		uppercase: (value: string) => value?.toUpperCase?.(),
		'some-fn': () => '',
	})

	LL.upper({ a: 'value' })

	// @ts-expect-error invalid formatter
	LL.invalid({ a: 'test' })

	// @ts-expect-error expects 'gender' parameter
	LL.chained({})
	LL.chained({ gender: '' })
}

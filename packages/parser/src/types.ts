export type TextPart = string

export type ArgumentPart = {
	k: string // key
	i?: string | undefined // type
	n?: boolean | undefined // non-mandatory (optional)
	f?: string[] | undefined // formatterFunctionKey
}

export type PluralPart = {
	k: string // key
	z?: string // zero
	o: string // one
	t?: string // two
	f?: string // few
	m?: string // many
	r: string // other
}

export type Part = TextPart | ArgumentPart | PluralPart

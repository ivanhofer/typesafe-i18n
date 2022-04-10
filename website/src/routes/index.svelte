<!-- TODO: create in multiple languages -->
<!-- TODO: ligt/dark mode -->

<div class="heading narrow">
	<h1>🌍typesafe-i18n</h1>
	<h2>A fully type-safe and lightweight localization library for all your TypeScript and JavaScript projects.</h2>
</div>

<div class="image">
	<!-- TODO: use video instead of gif -->
	<img
		src="https://raw.githubusercontent.com/ivanhofer/typesafe-i18n/main/assets/typesafe-i18n-demo.gif"
		alt="typesafe-i18n in action"
	/>
</div>

<div class="works-with narrow">
	<h3>Works with</h3>

	<!-- TODO: better responsive grid -->
	<div class="logos">
		<a title="TypeScript" target="_blank" href="https://github.com/ivanhofer/typesafe-i18n#usage">
			<img
				src="https://raw.githubusercontent.com/ivanhofer/typesafe-i18n/main/assets/icons/typescript.svg"
				alt="TypeScript logo"
				height="70"
			/>
		</a>
		<a
			title="Svelte"
			target="_blank"
			href="https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/adapter-svelte"
		>
			<img
				src="https://raw.githubusercontent.com/ivanhofer/typesafe-i18n/main/assets/icons/svelte.svg"
				alt="Svelte logo"
				height="70"
			/>
		</a>
		<a
			title="React"
			target="_blank"
			href="https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/adapter-react"
		>
			<img
				src="https://raw.githubusercontent.com/ivanhofer/typesafe-i18n/main/assets/icons/react.svg"
				alt="React logo"
				height="70"
			/>
		</a>
		<a
			title="Vue.js"
			target="_blank"
			href="https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/adapter-vue"
		>
			<img
				src="https://raw.githubusercontent.com/ivanhofer/typesafe-i18n/main/assets/icons/vuejs.svg"
				alt="Vue.js logo"
				height="70"
			/>
		</a>
		<a
			title="Angular"
			target="_blank"
			href="https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/adapter-angular"
		>
			<img
				src="https://raw.githubusercontent.com/ivanhofer/typesafe-i18n/main/assets/icons/angular.svg"
				alt="Angular logo"
				height="70"
			/>
		</a>
		<a
			title="SolidJS"
			target="_blank"
			href="https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/adapter-solid"
		>
			<img
				src="https://raw.githubusercontent.com/ivanhofer/typesafe-i18n/main/assets/icons/solidjs.svg"
				alt="SolidJS logo"
				height="70"
			/>
		</a>
		<a
			title="Node.js"
			target="_blank"
			href="https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/adapter-node"
		>
			<img
				src="https://raw.githubusercontent.com/ivanhofer/typesafe-i18n/main/assets/icons/nodejs.svg"
				alt="Node.js logo"
				height="70"
			/>
		</a>
		<a title="JavaScript" target="_blank" href="https://github.com/ivanhofer/typesafe-i18n#usage">
			<img
				src="https://raw.githubusercontent.com/ivanhofer/typesafe-i18n/main/assets/icons/javascript.svg"
				alt="JavaScript logo"
				height="70"
			/>
		</a>
	</div>
</div>

<div class="advantages narrow">
	<h3>Advantages</h3>
	<ul>
		<li>🐤 lightweight (~1kb)</li>
		<li>👌 easy to use syntax</li>
		<li>🏃 fast and efficient</li>
		<li>🦺 prevents you from making mistakes (also in plain JavaScript projects)</li>
		<li>👷 creates boilerplate code for you</li>
		<li>💬 supports plural rules</li>
		<li>📅 allows formatting of values e.g. locale-dependent date or number formats</li>
		<li>↔️ supports switch-case statements e.g. for gender-specific output</li>
		<li>⬇️ option for asynchronous loading of locales</li>
		<li>📚 supports multiple namespaces</li>
		<li>⏱️ supports SSR (Server-Side Rendering)</li>
		<li>🤝 can be used for frontend, backend and API projects</li>
		<li>🔍 locale-detection for browser and server environments</li>
		<li>🔄 import and export translations from/to files or services</li>
		<li>⛔ no external dependencies</li>
	</ul>
</div>

<nav class="links narrow">
	<a title="GitHub Repository" target="_blank" href="https://github.com/ivanhofer/typesafe-i18n">
		<img src="/github-logo.svg" alt="GitHub logo" height="30" />
	</a>
	<a title="npm registry" target="_blank" href="https://www.npmjs.com/package/typesafe-i18n">
		<img src="/npm-logo.svg" alt="npm logo" height="30" />
	</a>
</nav>

<style lang="scss">
	.narrow {
		max-width: 810px;
		width: 100%;
		padding-inline: 24px;
	}

	.heading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 50px;
		text-align: center;
	}

	h1 {
		font-family: monospace;
		font-size: 3rem;
	}

	h2 {
		margin-top: 2rem;
		font-size: 1.5rem;
	}

	h3 {
		font-size: 1.3rem;
		margin-block-end: 0.8rem;
	}

	.logos {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
	}

	ul {
		list-style-type: none;
		padding-inline-start: 0;
		font-size: 1.1rem;
	}

	.links {
		margin-block-start: 3rem;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		justify-content: flex-end;
		gap: 30px;
	}

	a {
		transition: transform 0.3s;

		&:hover {
			transform: scale(1.1);
		}
	}
</style>

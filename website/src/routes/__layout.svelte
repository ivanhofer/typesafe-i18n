<main>
	<slot />
</main>

<style lang="scss" global>
	@import '../styles/reset';

	html {
		font-family: Arial, Helvetica, sans-serif;
	}

	main {
		max-width: 1000px;
		margin-inline: auto;
		display: flex;
		gap: 3rem;
		flex-direction: column;
		align-items: center;
		padding-block-end: 5rem;
	}

	@media (max-width: 700px) {
		html {
			font-size: 0.8rem;
		}
	}

	@media (max-width: 500px) {
		html {
			font-size: 0.7rem;
		}
	}
</style>

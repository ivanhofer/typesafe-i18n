<script setup lang="ts">
import { ref } from 'vue'
import { i18n } from '../i18n/i18n-vue'

defineProps<{ msg: string }>()

const { LL } = i18n()

console.log(LL.value.STARTUP())

const count = ref(0)
</script>

<template>
	<h1>{{ msg }}</h1>

	<p>
		{{ LL.RECOMMENDED_SETUP() }}
		<a href="https://code.visualstudio.com/" target="_blank">VSCode</a>
		+
		<a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
	</p>

	<p>
		<a href="https://vitejs.dev/guide/features.html" target="_blank">Vite Docs</a>
		|
		<a href="https://v3.vuejs.org/" target="_blank">Vue 3 Docs</a>
		|
		<a href="https://github.com/ivanhofer/typesafe-i18n" target="_blank">typesafe-i18n Docs</a>
	</p>

	<button type="button" @click="count++">{{ LL.COUNT({ count }) }}</button>
	<p v-html="LL.EDIT({ component: 'components/HelloWorld.vue' })"></p>

	<p>{{ LL.TODAY({ date: new Date() }) }}</p>
</template>

<style scoped>
a {
	color: #42b983;
}

label {
	margin: 0 0.5em;
	font-weight: bold;
}

p >>> code {
	background-color: #eee;
	padding: 2px 4px;
	border-radius: 4px;
	color: #304455;
}
</style>

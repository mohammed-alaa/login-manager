<template>
	<div class="search">
		<FormInput v-model="searchLogin" id="searchElement" nolabel placeholder="Search logins (/)" nomargins
			size="normal" @keydown.esc="searchLogin = ''" />
	</div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import FormInput from '@/components/FormInput'

const store = useStore()

const searchLogin = ref('')
let searchElement = null

const focusSearch = (event) => {
	const isValidSlash = ((event.target.localName !== "input") && (event.key === "/"))
	if (isValidSlash) {
		event.preventDefault()
		searchElement.focus()
	}
}
watch(searchLogin, (newValue) => store.dispatch('setSearchText', newValue.trim()))
onMounted(() => {
	searchElement = document.getElementById("searchElement")
	document.addEventListener('keydown', focusSearch)
})
onUnmounted(() => document.removeEventListener('keydown', focusSearch))
</script>

<style scoped lang="sass">
.search
	grid-area: search
	padding: calc(var(--search-height) / 4) var(--main-start-offset)
	border-right: 1px solid var(--main-border-color)
	border-bottom: 1px solid var(--main-border-color)
</style>

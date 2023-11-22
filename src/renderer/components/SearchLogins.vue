<script setup lang="ts">
import { reactive, computed, watch } from "vue"
import store from "@store"
import FormInput from "@components/FormInput"

const search = reactive({
	data: "",
	timeoutId: -1,
})

watch(
	() => search.data,
	(newValue) => {
		clearTimeout(search.timeoutId)
		search.timeoutId = setTimeout(() => {
			store.searchLogins(newValue.trim())
		}, 300)
	}
)
</script>

<template>
	<div
		class="search px-4 flex items-center justify-center border-e border-b border-main"
	>
		<FormInput
			id="searchElement"
			v-model="search.data"
			class="w-full"
			placeholder="Search logins"
			@keydown.esc="search.data = ''"
		/>
	</div>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from "vue"
import store from "@store"
import FormInput from "@components/FormInput"

const loginsNumber = computed(() => store.getters.loginsNumber)
const isSearchingDisabled = computed(() => !loginsNumber.value)
const placeHolder = computed(() =>
	isSearchingDisabled.value
		? "Searching is disabled."
		: `Search ${loginsNumber.value} logins`
)

const search = reactive({
	data: "",
	timeoutId: -1,
})

watch(
	() => search.data,
	(newValue) => {
		newValue = newValue.trim()

		if (!newValue.length) {
			return
		}

		clearTimeout(search.timeoutId)
		search.timeoutId = setTimeout(() => {
			store.searchLogins(newValue)
			console.log("value searched")
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
			:placeholder="placeHolder"
			:readonly="isSearchingDisabled"
			:disabled="isSearchingDisabled"
			@keydown.esc="search.data = ''"
		/>
	</div>
</template>

<script setup>
// import { computed } from "vue"
import AppButton from "./AppButton.vue"

defineProps({
	size: {
		type: String,
		default: "normal",
	},
	theme: {
		type: String,
		default: "outline-light",
	},
})

defineEmits(["click"])
</script>

<template>
	<AppButton
		no-padding
		no-border-radius
		type="button"
		:size="size"
		:theme="theme"
		@click="$emit('click', $event)"
	>
		<slot />
	</AppButton>
</template>

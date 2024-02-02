<script setup lang="ts">
import { computed } from "vue"
import AppIcon from "@components/AppIcon"

const props = defineProps({
	type: {
		type: String,
		required: true,
	},
	alertText: {
		type: String,
		required: true,
	},
})

const typeComputed = computed(() => ({
	"bg-alert-danger text-alert-danger border-alert-danger":
		props.type === "danger",
	"bg-alert-success text-alert-success border-alert-success":
		props.type === "success",
}))
</script>

<template>
	<div
		class="rounded-lg px-4 py-2 border flex gap-2 items-center"
		:class="typeComputed"
		role="alert"
	>
		<template v-if="type === 'danger'">
			<AppIcon icon="exclamation-circle" />
		</template>
		<template v-else-if="type === 'success'">
			<AppIcon icon="circle-check" />
		</template>
		<p v-text="alertText" />
	</div>
</template>

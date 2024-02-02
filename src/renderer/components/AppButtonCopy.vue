<script setup lang="ts">
import { ref } from "vue"
import AppButton from "@components/AppButton"
import AppIcon from "@components/AppIcon"

const isCopied = ref(false)
const props = defineProps({
	value: {
		type: String,
		default: "",
	},
})

const copyText = () => {
	if (props.value.trim().length && !isCopied.value) {
		navigator.clipboard.writeText(props.value)
		isCopied.value = true
		setTimeout(() => (isCopied.value = false), 1000)
	}
}
</script>

<template>
	<AppButton
		rounded="circle"
		color="secondary"
		:variant="isCopied ? 'filled' : 'outlined'"
		@click="copyText"
	>
		<template v-if="isCopied">
			<AppIcon icon="clipboard-check" />
		</template>
		<template v-else>
			<AppIcon icon="clipboard" />
		</template>
	</AppButton>
</template>

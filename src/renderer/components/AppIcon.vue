<template>
	<template v-if="error">
		<b>{{ iconName }}</b>
	</template>
	<template v-else>
		<component :is="iconSvg" />
	</template>
</template>

<script setup>
import { ref, computed, defineAsyncComponent } from "vue"

const props = defineProps({
	icon: {
		type: String,
		required: true,
	},
	size: {
		type: String,
		default: "md",
	},
})

const iconName = computed(() => props.icon)

const error = ref(false)
const iconSvg = defineAsyncComponent(() =>
	import(`@icons/${iconName.value}`).catch(() => () => {
		error.value = true
	})
)
</script>

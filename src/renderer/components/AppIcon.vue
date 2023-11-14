<template>
	<template v-if="error">
		<b>{{ iconName }}</b>
	</template>
	<template v-else>
		<component
			:is="iconSvg"
			:class="[
				`inline align-text-top text-${size}`,
				{ 'ms-2': startSpace, 'me-2': endSpace },
			]"
		/>
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
	startSpace: {
		type: Boolean,
		default: false,
	},
	endSpace: {
		type: Boolean,
		default: true,
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

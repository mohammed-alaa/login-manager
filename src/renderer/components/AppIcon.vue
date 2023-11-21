<script setup lang="ts">
import { computed } from "vue"

interface IconProps {
	icon: string
	size?: false | "sm" | "md" | "lg"
	startSpace?: boolean
	endSpace?: boolean
	animated?: boolean
}

const props = withDefaults(defineProps<IconProps>(), {
	size: false,
	startSpace: false,
	endSpace: false,
	animated: false,
})

const sizeComputed = computed(() => ({
	"text-sm": props.size === "sm",
	"text-md": props.size === "md",
	"text-lg": props.size === "lg",
}))
</script>

<template>
	<i
		:class="[
			`ti ti-${icon} ${animated ? 'inline-block' : 'inline'}`,
			{ ...sizeComputed, 'ms-1': startSpace, 'me-1': endSpace },
		]"
	/>
</template>

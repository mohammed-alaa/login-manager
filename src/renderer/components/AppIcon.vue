<script setup lang="ts">
interface IconProps {
	icon: string
	startSpace?: boolean
	endSpace?: boolean
}

const props = withDefaults(defineProps<IconProps>(), {
	startSpace: false,
	endSpace: false,
})
</script>

<template>
	<i
		:class="[
			`ti inline-block align-top ti-${icon}`,
			{ 'ms-1': startSpace, 'me-1': endSpace },
		]"
	/>
</template>

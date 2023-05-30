<template>
	<i class="bi d-inline-block" :class="`bi-${icon}`" />
</template>

<script setup>
import { defineProps, } from 'vue'

defineProps({
	icon: {
		type: String,
		required: true,
	},
})
</script>

<style scoped lang="sass">
.bi
	&::before
		width: 1.25rem
	&.bi-x::before
		font-size: 1.5rem
		vertical-align: -0.425rem
</style>

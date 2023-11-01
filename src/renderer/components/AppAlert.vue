<template>
	<div :class="`alert alert-${type}`">
		<AppIcon v-if="type === 'danger'" icon="exclamation-circle" />
		<AppIcon v-else-if="type === 'success'" icon="check-circle" />
		<span class="ms-1 pl-2" v-text="alertText" />
	</div>
</template>

<script setup>
import AppIcon from "@components/AppIcon"

defineProps({
	type: {
		type: String,
		required: true,
	},
	alertText: {
		type: String,
		required: true,
	},
})
</script>

<style scoped lang="sass">

.alert
    &.pl-2
        padding-left: .3rem
    &.alert-success
        color: #0b3823
        background-color: #90d4b5
        border-color: #447b62

    &.alert-danger
        color: #fff
        background-color: #b16b72
        border-color: #9e4f57
</style>

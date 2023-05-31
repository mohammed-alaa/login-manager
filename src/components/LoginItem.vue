<template>
	<div class="login-item position-relative" :class="{ 'active': isActive, }" @click.prevent="$emit('click')" tabindex="0" @keydown.enter="$emit('click')">
		<div class="website text-truncate">
			<AppIcon :icon="`${isActive ? 'envelope-open-fill' : 'envelope'}`" />
			<span class="ms-1" v-text="getWebsiteAddressName" />
		</div>
		<div class="username text-truncate">
			<AppIcon :icon="`person${isActive ? '-fill' : ''}`" />
			<span class="ms-1" v-text="getUsername" />
		</div>
	</div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import { getWebsiteName } from '@/utils/frontend'
import AppIcon from '@/components/AppIcon'

defineEmits(['click'])
const props = defineProps({
	login: {
		type: [Object, null],
		required: false,
		default: null,
	},
	isActive: {
		type: Boolean,
		required: false,
		default: false,
	},
})

const getWebsiteAddressName = computed(() => getWebsiteName(props.login.website))
const getUsername = computed(() => (props.login.username))
</script>

<style scoped lang="sass">
$item-background-color: #1e1f24
$item-hover-background-color: #242731
$item-hover-border-color: #5e6889
$item-hover-color: #dedede
$item-active-background-color: #272a37
$item-active-border-color: #97a9e4
$item-active-color: #f9f9f9

.login-item
	padding: 0.8rem 1rem
	cursor: pointer
	background-color: $item-background-color
	border: 1px solid var(--main-border-color)
	transition: all 150ms ease-in-out
	border-radius: 1rem

	&:focus-visible
		outline: none
		box-shadow: 0 0 0 .2rem #{$item-hover-border-color}

	&:hover, &:focus-visible
		background-color: #{$item-hover-background-color}
		border-color: #{$item-hover-border-color}
		box-shadow: 0 0 0 .2rem #{$item-hover-border-color}
		.website, .username
			color: #{$item-hover-color}
	&.active
		cursor: initial
		background-color: #{$item-active-background-color}
		border-color: #{$item-active-border-color}
		box-shadow: 0 0 0 .2rem #{$item-active-border-color}
		.website, .username
			color: #{$item-active-color}
			font-size: 1.01rem
	.website, .username
		font-size: 1rem
		color: var(--color-gray)
		transition: all 150ms ease-in-out
</style>

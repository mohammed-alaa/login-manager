<template>
	<button
		:key="0"
		class="btn whitespace-nowrap capitalize"
		:class="[
			`btn-${size} btn-${theme}`,
			{
				active: isActive,
				border: border,
				noborderradius: noBorderRadius,
				nopadding: noPadding,
				'w-full': block,
			},
		]"
		:type="type"
		:disabled="isButtonDisabled"
		:aria-disabled="isButtonDisabled"
		:tabindex="`${isButtonDisabled ? -1 : 0}`"
		@click="buttonClicked"
	>
		<!-- <transition-group name="fade"> -->
		<template v-if="loading">
			<AppIcon :key="1" icon="refresh" class="animate-spin" />
		</template>
		<slot v-else :key="2">
			<span class="text-white" v-text="text" />
		</slot>
		<!-- </transition-group> -->
	</button>
</template>

<script setup>
import { computed } from "vue"
import AppIcon from "@components/AppIcon"

const props = defineProps({
	type: {
		type: String,
		required: false,
		default: "button",
	},
	text: {
		type: String,
		required: false,
		default: "Button",
	},
	loading: {
		type: Boolean,
		required: false,
		default: false,
	},
	size: {
		type: String,
		required: false,
		default: "lg",
	},
	theme: {
		type: String,
		required: false,
		default: "primary",
	},
	isActive: {
		type: Boolean,
		required: false,
		default: false,
	},
	noPadding: {
		type: Boolean,
		required: false,
		default: false,
	},
	noBorderRadius: {
		type: Boolean,
		required: false,
		default: false,
	},
	border: {
		type: Boolean,
		required: false,
		default: false,
	},
	disabled: {
		type: Boolean,
		required: false,
		default: false,
	},
	block: {
		type: Boolean,
		default: false,
	},
})

const emits = defineEmits(["click"])

const isButtonDisabled = computed(() => props.disabled || props.loading)

const buttonClicked = (e) => {
	if (isButtonDisabled.value || props.type === "submit") {
		return
	}

	e.preventDefault()
	emits("click")
}
</script>

<style scoped lang="sass">
.btn
	-webkit-app-region: no-drag
	border: none

	&:disabled
		pointer-events: auto
		cursor: not-allowed
	&:not(.nopadding)
		padding: 0.5rem 1rem
	&:not(.noborderradius)
		border-radius: var(--border-radius)
	&.border
		border: 1px solid transparent
	&.btn-primary
		background-color: #4E2F52
		border-color: #996296
		&:hover, &:active
			background-color: darken(#4E2F52, 4)
			border-color: darken(#996296, 4)
	&.btn-outline-info
		color: #dfc7ff
		border-color: #dfc7ff
		background-color: #4E2F52
		&:hover:not(:disabled), &:active:not(:disabled), &.active:not(:disabled)
			background-color: #783880
			border-color: #783880
			color: var(--color-white)
		&:focus, &:focus:active, &:focus.active
			box-shadow: 0 0 0 0.25rem #974ba0e6
		&:disabled
			color: #dfc7ff
			background-color: #4E2F52ab
	&.btn-outline-warning
		background-color: #392a5f
		color: #a8abff
		border-color: #a8abff
		&:hover:not(:disabled), &:active:not(:disabled), &.active:not(:disabled)
			background-color: #4d429a
			border-color: #4d429a
			color: var(--color-white)
		&:focus, &:focus:active, &:focus.active
			box-shadow: 0 0 0 .25rem #3a2963e6
		&:disabled
			color: #a8abff
			background-color: #392a5fab

	&.btn-outline-danger
		background-color: #5f2a2a
		border-color: #ffb9bf
		color: #ffb9bf
		&:hover:not(:disabled), &:active:not(:disabled), &.active:not(:disabled)
			background-color: #a01111
			border-color: #a01111
			color: var(--color-white)
		&:focus, &:focus:active, &:focus.active
			box-shadow: 0 0 0 .25rem #d81a2c80
		&:disabled
			color: #ffb9bf
			background-color: #5f2a2aab

	&.btn-outline-primary
		background-color: #3e1c42
		color: #dfc7ff
		border-color: #dfc7ff
		&:hover:not(:disabled), &:active:not(:disabled), &.active:not(:disabled)
			background-color: #783880
			border-color: #783880
		&:focus, &:focus:active, &:focus.active
			box-shadow: 0 0 0 .25rem #b70dfd80
		&:disabled
			color: #dfc7ff
			background-color: #3e1c42ab
	&.btn-outline-light
		&:focus, &:focus:active, &:focus.active
			box-shadow: none
</style>

<script setup>
import AppIcon from "./AppIcon.vue"

defineProps({
	modelValue: {
		type: Boolean,
		required: false,
		default: false,
	},
	id: {
		type: String,
		required: true,
	},
	label: {
		type: String,
		required: true,
	},
	icon: {
		type: String,
		required: false,
		default: null,
	},
	disabled: {
		type: Boolean,
		required: false,
		default: false,
	},
})

defineEmits(["update:modelValue"])
</script>

<template>
	<div class="d-flex flex-row align-items-center justify-content-start gap-3">
		<input
			:id="id"
			class="form-check-input m-0 overflow-hidden position-relative float-none border-0"
			type="checkbox"
			role="switch"
			:checked="modelValue"
			:disabled="disabled"
			:tabindex="disabled ? -1 : 0"
			@change="$emit('update:modelValue', $event.target.checked)"
		/>
		<label class="form-check-label" :for="id">
			<template v-if="icon">
				<AppIcon :icon="icon" class="me-1" />
			</template>
			<span v-text="label" />
		</label>
	</div>
</template>

<style scoped lang="sass">

$width: 3
$height: 1.4rem
$start-offset: 0.2rem
$size: $height - $start-offset * 2
$speed: 100 * calc($width / 2)

.form-check-input
	background-image: none !important
	width: #{$width}rem
	height: $height
	background-color: transparent
	cursor: pointer
	border-radius: 50rem

	&::before, &::after
		content: ''
		position: absolute
		left: 0
		transition: all #{$speed}ms linear

	&::before
		top: calc(50% - $height / 2 + $start-offset)
		transform: translateY(calc(50% - $height / 2 + $start-offset))
		transform: translateX($start-offset)
		background-color: var(--color-gray)
		border-radius: 50%
		width: abs($size)
		height: abs($size)
		z-index: 1

	&::after
		top: 0
		height: 100%
		width: 100%
		background-color: #5f46a0

	&:checked
		&::before
			background-color: var(--color-white)
			transform: translateX(calc(#{$width}rem - #{$size} - #{$start-offset}))
		&::after
			background-color: #6136cf

	&:disabled
		&::before
			opacity: 0.65
		&::after
			opacity: 0.65

	&:focus
		box-shadow: none !important
		outline: none !important

.form-check-label
	cursor: pointer
	font-size: 1.3rem
	user-select: none
</style>

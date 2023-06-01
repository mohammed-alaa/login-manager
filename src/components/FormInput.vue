<template>
	<div :class="`w-100 ${!nomargins ? 'mt-3 mb-4' : ''}`">
		<slot name="label" :for="id" v-if="!nolabel">
			<label :for="id" class="text-white mb-2">
				{{ label }}
			</label>
		</slot>
		<input class="form-control"
			:class="[`form-control-${size}`, { 'form-control-plaintext': readonly, 'is-invalid': (isSubmitted && error), 'is-valid': (isSubmitted && !error), }]"
			:type="type" :id="id" :value="modelValue" :placeholder="placeholder"
			@input="$emit('update:modelValue', $event.target.value)" @focus="$emit('focus', $event)" :readonly="readonly" />
		<div class="mt-2">
			<slot name="default" />
		</div>
	</div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
defineProps({
	type: {
		type: String,
		required: false,
		default: "text",
	},
	id: {
		type: String,
		required: false,
		default: ""
	},
	label: {
		type: String,
		required: false,
		default: ""
	},
	modelValue: {
		type: String,
		required: false,
		default: "",
	},
	nolabel: {
		type: Boolean,
		required: false,
		default: false
	},
	placeholder: {
		type: String,
		required: false,
		default: ""
	},
	size: {
		type: String,
		required: false,
		default: "lg",
	},
	readonly: {
		type: Boolean,
		required: false,
		default: false,
	},
	nomargins: {
		type: Boolean,
		required: false,
		default: false,
	},
	error: {
		type: Boolean,
		required: false,
		default: false,
	},
	isSubmitted: {
		type: Boolean,
		required: false,
		default: false,
	},
})

defineEmits(['update:modelValue', 'focus'])
</script>

<style scoped lang="sass">
$form-control-placeholder-color: #bbb
$form-control-focus-color: #e6e6e6
$form-control-focus-background-color: #141414

.form-control
	&, &.form-control-plaintext
		background-color: var(--main-background-color)
		color: var(--color-gray)

		&:not(.is-invalid, .is-valid)
			border-color: var(--main-border-color)
	&.form-control-plaintext
		padding: 0.375rem 0.75rem
		border-width: 1px
	&:focus
		color: #{$form-control-focus-color}
		background-color: #{$form-control-focus-background-color}
		box-shadow: none
	&::-webkit-input-placeholder
		color: #{$form-control-placeholder-color}
</style>

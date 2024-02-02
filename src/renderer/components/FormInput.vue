<script setup lang="ts">
import { computed } from "vue"
const emits = defineEmits(["update:modelValue", "focus"])

type FormInputProps = {
	type?: "text" | "number" | "password" | "email" | string
	id?: string
	label?: string
	modelValue: string | number
	placeholder?: string
	readonly?: boolean
	error?: string
	min?: number | string
	isSubmitted?: boolean
	rounded?: false | "sm" | "md" | "lg" | "circle"
	disabled?: boolean
}

const props = withDefaults(defineProps<FormInputProps>(), {
	id: "",
	label: "",
	placeholder: "",
	type: "text",
	readonly: false,
	error: "",
	isSubmitted: false,
	rounded: "md",
	min: 0,
	disabled: false,
})

const modelValue = computed({
	get: () => props.modelValue,
	set: (value) => emits("update:modelValue", value),
})

const isError = computed(() => !!props.error?.length)
const roundedComputed = computed(() => ({
	"rounded-sm": props.rounded === "sm",
	"rounded-md": props.rounded === "md",
	"rounded-lg": props.rounded === "lg",
	"rounded-circle": props.rounded === "circle",
}))
</script>

<template>
	<div>
		<template v-if="label || $slots.label">
			<label :for="id" class="block text-white cursor-pointer mb-2">
				<slot name="label" :for="id">
					{{ label }}
				</slot>
			</label>
		</template>
		<input
			:id="id"
			v-model="modelValue"
			:type="type"
			:min="min"
			:readonly="readonly"
			:placeholder="placeholder"
			:disabled="disabled"
			:class="[
				'form-input bg-input border border-main focus:bg-focus block w-full py-2 px-4 transition ease-in-out ring-0 text-white',
				{
					...roundedComputed,
					'opacity-70 cursor-not-allowed': disabled,
					'focus:ring-2 focus:ring-blue-500': !disabled,
					'ring-red-500': !disabled && isError,
					'ring-green-500': !disabled && !isError,
				},
			]"
			@focus="$emit('focus', $event)"
		/>
		<template v-if="isError">
			<div class="text-red-500 text-sm mt-2">
				{{ error }}
			</div>
		</template>
	</div>
</template>

<style scoped lang="sass">
$form-control-placeholder-color: #888
$form-control-focus-color: #e6e6e6

.submitted .form-input
	@apply ring-2

.form-input
	&:focus
		color: #{$form-control-focus-color}
		@apply outline-0
	&::-webkit-input-placeholder
		color: #{$form-control-placeholder-color}
</style>

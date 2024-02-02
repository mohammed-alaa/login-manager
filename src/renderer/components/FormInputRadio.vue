<script setup lang="ts">
import { computed } from "vue"

type FormInputRadioProps = {
	id: string
	label: string
	value: string | boolean | number
	modelValue: string | boolean | number
	color?: "primary" | "danger" | "secondary" | "warning" | string
}

const emit = defineEmits(["update:modelValue"])

const props = withDefaults(defineProps<FormInputRadioProps>(), {
	color: "primary",
})

const modelValue = computed({
	get: () => props.modelValue,
	set: (value: string | boolean | number) => emit("update:modelValue", value),
})
</script>

<template>
	<div class="flex items-center gap-2">
		<input
			:id="id"
			v-model="modelValue"
			type="radio"
			:value="value"
			class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
		/>
		<label class="text-sm text-gray cursor-pointer" :for="id">
			{{ label }}
		</label>
	</div>
</template>

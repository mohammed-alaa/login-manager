<script setup lang="ts">
import { computed } from "vue"
import AppIcon from "@components/AppIcon"

const emits = defineEmits(["update:modelValue"])

const props = defineProps({
	modelValue: {
		type: [Boolean, Array],
		required: true,
	},
	multiple: {
		type: Boolean,
		default: false,
	},
	value: {
		type: [String, Boolean, Number],
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
})

const modelValue = computed({
	get: () => props.modelValue,
	set: (value) => emits("update:modelValue", value),
})
const isInputChecked = computed(() =>
	props.multiple
		? modelValue.value.includes(props.value)
		: modelValue.value === props.value
)
</script>

<template>
	<div>
		<input
			:id="id"
			v-model="modelValue"
			type="checkbox"
			class="sr-only"
			:value="value"
			:multiple="multiple"
		/>
		<label :for="id" class="text-white cursor-pointer">
			<template v-if="isInputChecked">
				<AppIcon end-space icon="square-check-filled" />
			</template>
			<template v-else>
				<AppIcon end-space icon="square" />
			</template>
			<template v-if="label">
				<span>{{ label }}</span>
			</template>
		</label>
	</div>
</template>

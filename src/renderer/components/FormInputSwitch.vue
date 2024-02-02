<script setup lang="ts">
import { computed } from "vue"

const emits = defineEmits(["update:modelValue"])
const props = defineProps({
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

const modelValue = computed({
	get: () => props.modelValue,
	set: (value) => emits("update:modelValue", value),
})
</script>

<template>
	<label
		class="relative flex items-center gap-2"
		:class="{
			'opacity-60 cursor-not-allowed': disabled,
			'cursor-pointer': !disabled,
		}"
		:for="id"
	>
		<input
			:id="id"
			v-model="modelValue"
			class="sr-only peer"
			type="checkbox"
			:disabled="disabled"
			:tabindex="disabled ? -1 : 0"
		/>
		<div
			class="peer transition ease-in-out peer-focus:ring-4 peer-focus:ring-switch-focus rounded-full"
		>
			<div
				class="w-9 h-5 rounded-full after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:border after:rounded-circle after:w-4 after:h-4 after:transition-all after:ease-linear"
				:class="{
					'bg-switch-on after:bg-switch-circle-on after:translate-x-full after:border-switch-circle-on':
						modelValue,
					'bg-switch-off after:bg-switch-circle-off after:start-[2px] after:border-switch-circle-off':
						!modelValue,
				}"
			/>
		</div>
		<div>
			<span class="text-sm text-gray select-none" v-text="label" />
		</div>
	</label>
</template>

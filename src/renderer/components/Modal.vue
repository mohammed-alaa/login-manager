<script setup lang="ts">
import { computed } from "vue"
import AppIcon from "@components/AppIcon"
import AppButton from "@components/AppButton"

const emits = defineEmits(["update:modelValue"])

const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	title: {
		type: String,
		default: "",
	},
})

const modelValue = computed({
	get: () => props.modelValue,
	set: (value) => emits("update:modelValue", value),
})

const closeModal = () => {
	if (props.disabled) {
		return
	}

	modelValue.value = false
}
</script>

<template>
	<div
		class="absolute inset-0 z-10 transition transition-all ease-in-out bg-black/90"
		:class="[
			`${
				modelValue
					? 'opacity-1 scale-x-1 scale-y-1'
					: 'opacity-0 select-none scale-x-0 scale-y-0'
			}`,
		]"
		@click.self="closeModal"
	>
		<div
			class="m-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full transition transition-all ease-linear max-w-50 bg-body rounded-lg flex flex-col gap-4 justify-between p-4"
		>
			<template v-if="modelValue">
				<div>
					<slot v-if="$slots.title || title" name="title">
						<h3 class="text-white">{{ title }}</h3>
					</slot>
					<div class="absolute -top-4 -right-4">
						<AppButton
							rounded="circle"
							color="secondary"
							:disabled="disabled"
							@click="closeModal"
						>
							<AppIcon icon="x" />
						</AppButton>
					</div>
				</div>
				<div class="flex-1">
					<slot />
				</div>
				<div v-if="$slots.actions">
					<slot name="actions" />
				</div>
			</template>
		</div>
	</div>
</template>

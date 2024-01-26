<script setup lang="ts">
import { ref, computed } from "vue"
import AppIcon from "@components/AppIcon"
import AppButton from "@components/AppButton"

type FormInputFileProps = {
	modelValue: File | null
	accept: string
	color?: "primary" | "danger" | "secondary" | "warning" | string
}

const emit = defineEmits(["update:modelValue"])

const importFileInput = ref<HTMLInputElement | null>(null)

const props = withDefaults(defineProps<FormInputFileProps>(), {
	color: "primary",
})

const modelValue = computed({
	get: () => props.modelValue,
	set: (value: File | null) => emit("update:modelValue", value),
})

const onInputFileChange = (event: Event) => {
	const target = event.target as HTMLInputElement
	const file = target.files?.[0]

	if (file) {
		modelValue.value = file
	}
}

const importFile = () => {
	if (importFileInput.value) {
		importFileInput.value.click()
	}
}
</script>

<template>
	<div class="flex flex-col gap-2">
		<AppButton
			:color="color"
			:variant="modelValue ? 'filled' : 'outlined'"
			class="normal-case"
			@click="importFile"
		>
			<AppIcon end-space icon="file" />
			<template v-if="modelValue">
				<span v-text="modelValue.name" />
			</template>
			<template v-else>
				<span>Select File</span>
			</template>
		</AppButton>
		<input
			ref="importFileInput"
			type="file"
			:accept="accept"
			class="sr-only"
			@change="onInputFileChange"
		/>
	</div>
</template>

<script setup>
import { computed } from "vue"
import Modal from "@components/Modal"
import AppIcon from "@components/AppIcon"
import AppAlert from "@components/AppAlert"
import AppButton from "@components/AppButton"

const emits = defineEmits(["update:modelValue", "confirm"])

const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	error: {
		type: Boolean,
		default: false,
	},
})

const modelValue = computed({
	get: () => props.modelValue,
	set: (value) => emits("update:modelValue", value),
})

const confirm = () => emits("confirm")
const closeModal = () => (modelValue.value = false)
</script>

<template>
	<Modal v-model="modelValue" title="Delete Login" :disabled="disabled">
		<template v-if="error">
			<AppAlert
				class="mb-4"
				type="danger"
				alert-text="An error occured while deleting this login."
			/>
		</template>
		<p class="text-white">
			<span>Are you sure? </span>
			<b class="underline">You cannot undo this action!</b>
		</p>
		<template #actions>
			<div class="flex items-center justify-between gap-2">
				<AppButton
					block
					variant="outlined"
					color="danger"
					:disabled="disabled"
					:loading="disabled"
					@click="confirm"
				>
					<AppIcon end-space icon="trash" />
					<span>Delete</span>
				</AppButton>
				<AppButton
					block
					color="secondary"
					:disabled="disabled"
					@click="closeModal"
				>
					<AppIcon end-space icon="x" />
					<span>Cancel</span>
				</AppButton>
			</div>
		</template>
	</Modal>
</template>

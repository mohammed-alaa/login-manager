<script setup lang="ts">
import { ref, reactive } from "vue"
import type { CreateEditFormData } from "@types"
import AppForm from "@components/AppForm"
import AppIcon from "@components/AppIcon"
import FormInput from "@components/FormInput"
import AppButton from "@components/AppButton"
import GeneratePassword from "@components/GeneratePassword"

type CreateEditFormProps = CreateEditFormData & {
	disabled?: boolean
}

const emits = defineEmits(["submit"])

const props = withDefaults(defineProps<CreateEditFormProps>(), {
	website: "",
	username: "",
	password: "",
	disabled: false,
})

const generatedPassword = ref("")
const formValues = reactive<CreateEditFormData>({
	website: props.website,
	username: props.username,
	password: props.password,
})

const formSubmit = () => {
	if (props.disabled) {
		return
	}

	emits("submit", formValues)
}
</script>

<template>
	<AppForm @submit="formSubmit">
		<FormInput
			id="Website"
			v-model="formValues.website"
			:readonly="disabled"
			placeholder="e.g: http://example.com"
		>
			<template #label>
				<AppIcon end-space icon="world" />
				<span>Website:</span>
			</template>
		</FormInput>
		<FormInput
			id="Username"
			v-model="formValues.username"
			:readonly="disabled"
			class="mt-4"
			placeholder="e.g: admin"
		>
			<template #label>
				<AppIcon end-space icon="user" />
				<span>Username:</span>
			</template>
		</FormInput>
		<FormInput
			id="Password"
			v-model="formValues.password"
			:readonly="disabled"
			class="mt-4"
			placeholder="Enter manually or generate from below"
		>
			<template #label>
				<AppIcon end-space icon="password-user" />
				<span>Password:</span>
			</template>
		</FormInput>
		<GeneratePassword v-model="generatedPassword" class="mt-4" />
		<AppButton
			block
			type="submit"
			class="mt-4"
			rounded="lg"
			:disabled="disabled"
		>
			<slot name="submit">Submit</slot>
		</AppButton>
	</AppForm>
</template>

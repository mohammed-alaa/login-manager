<script setup lang="ts">
import { reactive } from "vue"
import type { CreateEditFormData } from "@types"
import store from "@store"
import AppIcon from "@components/AppIcon"
import AppAlert from "@components/AppAlert"
import CreateEditForm from "@components/CreateEditForm"
import TitleWithContent from "@layouts/TitleWithContent"

const form = reactive({
	loading: false,
	error: false,
	success: false,
	data: {
		website: "",
		username: "",
		password: "",
	},
})

const formSubmit = (formValues: CreateEditFormData) => {
	if (form.loading) {
		return
	}

	form.loading = true
	form.error = false
	form.success = false

	store
		.createNewItem(formValues)
		.then(() => (form.success = true))
		.catch(() => (form.error = true))
		.finally(() => (form.loading = false))
}
</script>

<template>
	<TitleWithContent>
		<template #title> New Login </template>
		<template #content>
			<template v-if="form.error">
				<AppAlert
					class="my-4"
					type="danger"
					alert-text="An error occured while creating a new login."
				/>
			</template>
			<template v-else-if="form.success">
				<AppAlert
					class="my-4"
					type="success"
					alert-text="Login has been created successfully."
				/>
			</template>

			<CreateEditForm
				:disabled="form.loading"
				:loading="form.loading"
				v-bind="form.data"
				@submit="formSubmit"
			>
				<template #submit>
					<AppIcon end-space icon="plus" />
					<span>Create</span>
				</template>
			</CreateEditForm>
		</template>
	</TitleWithContent>
</template>

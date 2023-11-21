<script setup lang="ts">
import { reactive } from "vue"
import { useRouter } from "vue-router"
import type { CreateEditFormData } from "@types"
import store from "@store"
import AppIcon from "@components/AppIcon"
import AppAlert from "@components/AppAlert"
import AppButton from "@components/AppButton"
import CreateEditForm from "@components/CreateEditForm"

const router = useRouter()

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

const homePage = () => router.push({ name: "home" })
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
	<section class="mx-8 my-4 p-4 border border-main rounded-lg bg-main">
		<div class="flex items-center gap-2 mb-4">
			<AppButton
				variant="text"
				color="secondary"
				:disabled="form.loading"
				@click="homePage"
			>
				<AppIcon icon="arrow-left" />
			</AppButton>
			<h2 class="text-white">New Login</h2>
		</div>

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
	</section>
</template>

<script setup lang="ts">
import { reactive, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"
import type { CreateEditFormData, LoginItem } from "@types"
import store from "@store"
import AppIcon from "@components/AppIcon"
import AppAlert from "@components/AppAlert"
import AppButton from "@components/AppButton"
import CreateEditForm from "@components/CreateEditForm"

const router = useRouter()

const form = reactive({
	loginId: 0,
	data: {
		website: "",
		username: "",
		password: "",
	},
	get: {
		loading: false,
		error: false,
	},
	update: {
		loading: false,
		error: false,
	},
})

const homePage = () => router.push({ name: "home" })
const formSubmit = (formValues: CreateEditFormData) => {
	form.update.loading = true
	form.update.error = false

	store
		.updateLogin(form.loginId, formValues)
		.then(() => homePage())
		.catch(() => (form.update.error = true))
		.finally(() => (form.update.loading = false))
}

onMounted(() => {
	form.loginId = Number(useRoute().params.id)

	if (isNaN(form.loginId)) {
		form.get.error = true
		form.get.loading = false
	} else {
		form.get.loading = true
		form.get.error = false

		store
			.retrieveLogin(form.loginId)
			.then((login: LoginItem) => (form.data = login))
			.catch(() => (form.get.error = true))
			.finally(() => (form.get.loading = false))
	}
})
</script>

<template>
	<section class="mx-8 my-4 p-4 rounded-lg bg-main border border-main">
		<div class="flex items-center mb-4 gap-2">
			<AppButton
				variant="text"
				color="secondary"
				:disabled="form.update.loading"
				@click="homePage"
			>
				<AppIcon icon="arrow-left" />
			</AppButton>
			<h2 class="text-white">Edit Login</h2>
		</div>

		<template v-if="form.get.loading">
			<div class="text-lg flex items-center justify-center text-white">
				<AppIcon
					animated
					end-space
					icon="loader-2"
					class="animate-spin"
				/>
				<span>Loading...</span>
			</div>
		</template>
		<template v-else-if="form.get.error">
			<AppAlert
				type="danger"
				alert-text="An error occured whileretrieving login data."
			/>
		</template>
		<template v-else>
			<template v-if="form.update.error">
				<AppAlert
					class="my-4"
					type="danger"
					alert-text="An error occured while updating login data."
				/>
			</template>

			<CreateEditForm
				:disabled="form.update.loading"
				:loading="form.update.loading"
				v-bind="form.data"
				@submit="formSubmit"
			>
				<template #submit>
					<AppIcon end-space icon="edit" />
					<span>Update</span>
				</template>
			</CreateEditForm>
		</template>
	</section>
</template>

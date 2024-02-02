<script setup lang="ts">
import { reactive } from "vue"
import { useRouter } from "vue-router"
import store from "@store"
import AppForm from "@components/AppForm"
import FormInput from "@components/FormInput"
import AppButton from "@components/AppButton"
import AppIcon from "@components/AppIcon"

const router = useRouter()

const installForm = reactive({
	data: {
		primaryPassword: "43mBcn8gqkXndZk6",
		confirmedPrimaryPassword: "",
	},
	errors: {
		primaryPassword: "",
		confirmedPrimaryPassword: "",
	},
	loading: false,
})

const formSubmit = async () => {
	installForm.loading = true
	installForm.errors.primaryPassword = ""
	installForm.errors.confirmedPrimaryPassword = ""

	try {
		await store.install(installForm.data)
		router.replace({ name: "Login" })
	} catch (error: any) {
		const { errors } = error
		installForm.errors.primaryPassword = errors.primaryPassword ?? ""
		installForm.errors.confirmedPrimaryPassword =
			errors.confirmedPrimaryPassword ?? ""
	}

	installForm.loading = false
}
</script>

<template>
	<div class="h-fullscreen flex items-center justify-center">
		<div class="bg-main border border-main rounded-lg p-8 w-50">
			<h1 class="text-center text-white mb-4">
				<AppIcon end-space icon="settings" />
				<span>Install</span>
			</h1>
			<AppForm @submit="formSubmit">
				<FormInput
					id="primaryPassword"
					v-model="installForm.data.primaryPassword"
					class="mb-4"
					:error="installForm.errors.primaryPassword"
				>
					<template #label>
						<AppIcon end-space icon="user-star" />
						<span>Enter the key</span>
					</template>
				</FormInput>
				<FormInput
					id="confirmedPrimaryPassword"
					v-model="installForm.data.confirmedPrimaryPassword"
					class="mb-4"
					:error="installForm.errors.confirmedPrimaryPassword"
					placeholder="Has to be the same as above"
				>
					<template #label>
						<AppIcon end-space icon="user-star" />
						<span>Confirm the key</span>
					</template>
				</FormInput>
				<AppButton
					block
					type="submit"
					text="Submit"
					:loading="installForm.loading"
				/>
			</AppForm>
		</div>
	</div>
</template>

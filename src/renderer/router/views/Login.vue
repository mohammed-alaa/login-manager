<script setup lang="ts">
import { reactive } from "vue"
import { useRouter } from "vue-router"
import store from "@store"
import AppForm from "@components/AppForm"
import FormInput from "@components/FormInput"
import AppButton from "@components/AppButton"
import AppIcon from "@components/AppIcon"

const router = useRouter()

const loginForm = reactive({
	password: "43mBcn8gqkXndZk6",
	error: "",
	loading: false,
})

const formSubmit = async () => {
	if (loginForm.loading) {
		return
	}

	loginForm.error = ""
	loginForm.loading = true

	try {
		await store.login({ primaryPassword: loginForm.password })
		router.replace({ name: "home" })
	} catch (error: any) {
		const { errors, message } = error
		loginForm.error = errors?.primaryPassword ?? message ?? ""
	}

	loginForm.loading = false
}
</script>

<template>
	<div class="h-fullscreen flex items-center justify-center">
		<div class="bg-main border border-main rounded-lg p-8 w-50">
			<h1 class="text-center text-white mb-4">
				<AppIcon end-space icon="password-user" />
				<span>Login</span>
			</h1>
			<AppForm @submit="formSubmit">
				<FormInput
					id="password"
					v-model="loginForm.password"
					class="mb-4"
					label="Primary Password"
					placeholder="Enter your primary password"
					:error="loginForm.error"
				/>
				<AppButton
					block
					type="submit"
					:loading="loginForm.loading"
					:disabled="loginForm.loading"
				>
					<span>Login</span>
					<AppIcon start-space icon="login-2" />
				</AppButton>
			</AppForm>
		</div>
	</div>
</template>

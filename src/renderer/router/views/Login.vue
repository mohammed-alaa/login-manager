<script setup lang="ts">
import { reactive } from "vue"
import { useRouter } from "vue-router"
import type { LoginForm } from "@types"
import { resetFormErrors } from "@utils"
import store from "@store"
import AppForm from "@components/AppForm"
import FormInput from "@components/FormInput"
import AppButton from "@components/AppButton"
import AppIcon from "@components/AppIcon"
import AppAlert from "@components/AppAlert"

const router = useRouter()

const loginForm = reactive({
	loading: false,
	data: {
		primaryPassword: "43mBcn8gqkXndZk6",
	} as LoginForm["Data"],
	errors: {} as LoginForm["Errors"],
})

const formSubmit = () => {
	if (loginForm.loading) {
		return
	}

	loginForm.loading = true
	loginForm.errors = resetFormErrors<LoginForm["Errors"]>(loginForm.errors)

	store
		.login(loginForm.data)
		.then(() => router.replace({ name: "home" }))
		.catch((errors: LoginForm["Errors"]) => {
			console.log("error", errors)
			loginForm.errors = errors
		})
		.finally(() => {
			loginForm.loading = false
		})
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
				<template v-if="loginForm.errors.general">
					<AppAlert
						type="danger"
						:alert-text="loginForm.errors.general"
					/>
				</template>
				<FormInput
					id="password"
					v-model="loginForm.data.primaryPassword"
					class="mb-4"
					label="Primary Password"
					placeholder="Enter your primary password"
					:error="loginForm.errors.primaryPassword"
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

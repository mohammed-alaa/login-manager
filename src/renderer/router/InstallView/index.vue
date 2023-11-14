<script setup lang="ts">
import { reactive, computed } from "vue"
import { useRouter } from "vue-router"
import store from "@store"
import AppForm from "@components/AppForm"
import FormInput from "@components/FormInput"
import AppButton from "@components/AppButton"
import AppIcon from "@components/AppIcon"

const router = useRouter()

const installForm = reactive({
	data: {
		passPhrase: "43mBcn8gqkXndZk6",
		confirmedPassPhrase: "",
	},
	errors: {
		passPhrase: "",
		confirmedPassPhrase: "",
	},
})

const isLoading = computed(() => store.getters.getIsLoading)

const resetErrors = () => {
	installForm.errors.passPhrase = ""
	installForm.errors.confirmedPassPhrase = ""
}

const formSubmit = async () => {
	resetErrors()

	try {
		await store.createPassPhrase(installForm.data)
		setTimeout(() => router.replace({ name: "PassPhrase" }), 1000)
	} catch (error: any) {
		const { errors } = error
		installForm.errors.passPhrase = errors.passPhrase ?? ""
		installForm.errors.confirmedPassPhrase =
			errors.confirmedPassPhrase ?? ""
	}
}
</script>

<template>
	<div class="h-full flex items-center justify-center">
		<div class="validate-phrase-container border rounded-lg p-8 w-50">
			<h1 class="text-center text-white mb-4">
				<AppIcon icon="settings" />
				<span>Install</span>
			</h1>
			<AppForm @submit="formSubmit">
				<FormInput
					id="passPhrase"
					v-model="installForm.data.passPhrase"
					class="mb-4"
					:error="installForm.errors.passPhrase"
				>
					<template #label>
						<AppIcon icon="user-star" />
						<span>Enter the key</span>
					</template>
				</FormInput>
				<FormInput
					id="confirmedPassPhrase"
					v-model="installForm.data.confirmedPassPhrase"
					class="mb-4"
					:error="installForm.errors.confirmedPassPhrase"
					placeholder="Has to be the same as above"
				>
					<template #label>
						<AppIcon icon="user-star" />
						<span>Confirm the key</span>
					</template>
				</FormInput>
				<AppButton
					block
					type="submit"
					theme="primary"
					text="Save the 🔑"
					:loading="isLoading"
				/>
			</AppForm>
		</div>
	</div>
</template>

<style scoped lang="sass">
.validate-phrase-container
    background-color: var(--secondary-background-color)
    border-color: var(--main-border-color)
    box-shadow: 0 0 .3rem var(--main-border-color)
</style>

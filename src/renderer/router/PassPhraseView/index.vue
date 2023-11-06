<template>
	<div class="validate-phrase flex flex-col justify-center items-center">
		<div
			class="validate-phrase-container rounded-1 w-50 border border-solid"
		>
			<form novalidate @submit.prevent="formSubmit">
				<FormInput
					id="password"
					v-model="passPhrase"
					type="text"
					:error="isMasterPasswordError"
					:is-submitted="isMasterPasswordSubmitted"
					placeholder="Enter your key"
				>
					<template #label="{ props }">
						<h1 v-bind="props" class="text-center text-white mb-3">
							<AppIcon icon="person-fill" />
							<span class="ms-4">Master Key 🔑</span>
						</h1>
					</template>
					<template #default>
						<transition-group name="swap">
							<template v-if="isMasterPasswordSubmitted">
								<template v-if="isMasterPasswordError">
									<AppAlertVue
										:key="0"
										type="danger"
										alert-text="Oops! You got the wrong 🔑."
									/>
								</template>
								<template v-else>
									<AppAlertVue
										:key="1"
										type="success"
										alert-text="Yay! Welcome back, master. 😊"
									/>
								</template>
							</template>
						</transition-group>
					</template>
				</FormInput>
				<AppButton
					type="submit"
					:loading="isLoading"
					text="Check the 🔑"
					class="w-full"
					@click.prevent="formSubmit"
				/>
			</form>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useStore } from "vuex"
import FormInput from "@components/FormInput"
import AppButton from "@components/AppButton"
import AppAlertVue from "@components/AppAlert"
import AppIcon from "@components/AppIcon"

const store = useStore()
const router = useRouter()
const isMasterPasswordSubmitted = ref(false)
const isMasterPasswordError = ref(false)
const passPhrase = ref("43mBcn8gqkXndZk6")
const isLoading = computed(() => store.getters.getIsLoading)

const formSubmit = async () => {
	isMasterPasswordError.value = true
	isMasterPasswordSubmitted.value = false
	const validPassPhrase = await store.dispatch(
		"validatePassPhrase",
		passPhrase.value
	)
	isMasterPasswordSubmitted.value = true
	isMasterPasswordError.value = !validPassPhrase
	validPassPhrase && setTimeout(() => router.replace({ name: "home" }), 1000)
}

onMounted(async () => {
	const installationValidationResult = await store.dispatch(
		"validateInstalltion"
	)
	if (!installationValidationResult) {
		router.replace({ name: "install" })
	}
})
</script>

<style scoped lang="sass">
.validate-phrase
    height: calc(100vh - var(--app-header-min-height))

    .validate-phrase-container
        border-color: var(--main-border-color)
        background-color: var(--secondary-background-color)
        box-shadow: 0 0 .3rem var(--main-border-color)
</style>

<script setup lang="ts">
import { reactive, computed, watch, onMounted } from "vue"
import { useRouter } from "vue-router"
import type { Settings } from "@types"
import store from "@store"
import AppIcon from "@components/AppIcon"
import AppForm from "@components/AppForm"
import AppButton from "@components/AppButton"
import FormInputSwitch from "@components/FormInputSwitch"
import AppSettingsItem from "@components/AppSettingsItem"

const router = useRouter()

const appSettings = reactive({
	get: {
		error: false,
		loading: false,
	},
	update: {
		error: false,
		loading: false,
	},
	data: {},
})

const getAppInformation = computed(() => store.getters.getAppInformation)

const goHome = () => router.push({ name: "home" })
const saveApplicationSettings = () => {
	if (appSettings.update.loading) {
		return
	}

	appSettings.update.error = false
	appSettings.update.loading = true
	const data = {
		startOnLogin: appSettings.data.startOnLogin,
		startMinimized: appSettings.data.startMinimized,
	}

	store
		.updateAppSettings(data)
		.then((settings: Settings) => (appSettings.data = settings))
		.catch(() => (appSettings.update.error = true))
		.finally(() => (appSettings.update.loading = false))
}

watch(
	() => appSettings.data.startOnLogin,
	(value) => {
		if (!value) {
			appSettings.data.startMinimized = false
		}
	}
)

onMounted(() => {
	if (appSettings.get.loading) {
		return
	}

	appSettings.get.error = false
	appSettings.get.loading = true

	store
		.retrieveAppSettings()
		.then((settings: Settings) => (appSettings.data = settings))
		.catch(() => (appSettings.get.error = true))
		.finally(() => (appSettings.get.loading = false))
})
</script>

<template>
	<section class="settings max-w-80 mx-auto">
		<div
			class="settings-header px-4 flex items-center gap-2 sticky top-0 z-10 bg-secondary border-x border-b border-main"
		>
			<AppButton variant="text" color="secondary" @click="goHome">
				<AppIcon icon="arrow-left" />
			</AppButton>
			<h2 class="text-white">Settings</h2>
		</div>
		<template v-if="appSettings.get.loading">
			<div
				class="bg-main flex items-center justify-center text-white border border-t-0 border-main p-8"
			>
				<AppIcon
					animated
					end-space
					icon="refresh"
					class="animate-spin"
				/>
				<span>Loading...</span>
			</div>
		</template>
		<template v-else>
			<div
				class="settings-body h-full p-4 flex flex-col gap-4 bg-main border border-t-0 border-main"
			>
				<AppForm
					class="flex flex-col gap-2"
					@submit="saveApplicationSettings"
				>
					<h3 class="text-white mb-2">Application Startup</h3>
					<AppSettingsItem>
						<FormInputSwitch
							id="startOnLogin"
							v-model="appSettings.data.startOnLogin"
							label="Open automaitcally after you login into the computer"
						/>
					</AppSettingsItem>
					<AppSettingsItem>
						<FormInputSwitch
							id="startMinimized"
							v-model="appSettings.data.startMinimized"
							label="Hide on startup"
							:disabled="!appSettings.data.startOnLogin"
						/>
					</AppSettingsItem>
					<div>
						<AppButton
							type="submit"
							:loading="appSettings.update.loading"
							:disabled="appSettings.update.loading"
						>
							<AppIcon end-space icon="save2-fill" />
							<span>Save</span>
						</AppButton>
					</div>
				</AppForm>
				<div>
					<h3 class="text-white mb-2">About</h3>
					<div class="text-gray flex flex-col gap-1">
						<div>
							<p>
								{{ getAppInformation.appName }} v{{ getAppInformation.version }}
							</p>
							<p>
								{{ getAppInformation.description }}
							</p>
						</div>
						<div class="flex flex-wrap items-center gap-1">
							<span>Found an issue?</span>
							<a
								noreferrer
								target="_blank"
								class="underline"
								:href="getAppInformation.bugs.url"
							>
								Report here
							</a>
							<span>or</span>
							<a
								noreferrer
								target="_blank"
								:href="`mailto:${getAppInformation.bugs.email}`"
							>
								<AppButton size="sm" rounded="circle">
									<AppIcon icon="mail" />
								</AppButton>
							</a>
						</div>
						<div>
							<a
								noreferrer
								target="_blank"
								title="Homepage"
								:href="getAppInformation.homepage"
							>
								<AppIcon end-space size="lg" icon="home" />
							</a>
							<a
								noreferrer
								target="_blank"
								title="Github Repository"
								:href="getAppInformation.repository"
							>
								<AppIcon end-space size="lg" icon="brand-github" />
							</a>
						</div>
					</div>
				</div>
			</div>
		</template>
	</section>
</template>

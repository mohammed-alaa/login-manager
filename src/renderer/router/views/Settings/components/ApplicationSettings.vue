<script setup lang="ts">
import { reactive, watch, onMounted } from "vue"
import type { Settings } from "@types"
import store from "@store"
import AppIcon from "@components/AppIcon"
import AppForm from "@components/AppForm"
import AppAlert from "@components/AppAlert"
import AppButton from "@components/AppButton"
import FormInputSwitch from "@components/FormInputSwitch"

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
	<h3 class="text-white">Application Startup</h3>
	<template v-if="appSettings.get.loading">
		<div class="flex items-center justify-center text-white">
			<AppIcon end-space icon="refresh" class="animate-spin" />
			<span class="sr-only">Loading...</span>
		</div>
	</template>
	<template v-else>
		<AppForm class="flex flex-col gap-2" @submit="saveApplicationSettings">
			<template v-if="appSettings.update.error">
				<AppAlert
					type="danger"
					class="mb-2"
					alert-text="Error occured while saving the settings."
				/>
			</template>
			<div>
				<FormInputSwitch
					id="startOnLogin"
					v-model="appSettings.data.startOnLogin"
					label="Open automaitcally after you login into the computer"
				/>
			</div>
			<div>
				<FormInputSwitch
					id="startMinimized"
					v-model="appSettings.data.startMinimized"
					label="Hide on startup"
					:disabled="!appSettings.data.startOnLogin"
				/>
			</div>
			<div>
				<AppButton
					type="submit"
					class="mt-2"
					:loading="appSettings.update.loading"
					:disabled="appSettings.update.loading"
				>
					<AppIcon end-space icon="save2-fill" />
					<span>Save</span>
				</AppButton>
			</div>
		</AppForm>
	</template>
</template>

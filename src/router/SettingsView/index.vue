<template>
	<section class="settings overflow-hidden">
		<div class="container text-white">
			<div class="settings-header d-flex flex-row align-items-center justify-content-between position-sticky top-0">
				<div class="title">
					<h1 class="text-white">Settings</h1>
				</div>
				<div class="actions">
					<AppButton @click="goHome" theme="outline-warning" size="normal">
						<AppIcon icon="lock-fill" />
						<span>Home</span>
					</AppButton>
				</div>
			</div>
			<div class="settings-body d-flex flex-column overflow-auto gap-5">
				<AppSettingsItem>
					<FormInputSwitch id="startOnLogin" v-model="appSettings.startOnLogin"
						label="Open automaitcally after you login into the computer" />
				</AppSettingsItem>
				<AppSettingsItem>
					<FormInputSwitch id="startMinimized" v-model="appSettings.startMinimized"
						:disabled="!appSettings.startOnLogin" label="Hide on startup" />
				</AppSettingsItem>
				<div>
					<AppButton size="normal" @click="saveSettings" :disabled="!isDataDirty || isLoading">
						<AppIcon icon="save2-fill" />
						<span class="ms-1">Update settings</span>
					</AppButton>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon'
import AppButton from '@/components/AppButton'
import FormInputSwitch from '@/components/FormInputSwitch.vue'
import AppSettingsItem from '@/components/AppSettingsItem.vue'

const store = useStore()
const router = useRouter()

const isLoading = computed(() => store.getters.getIsLoading)
const originalSettings = computed(() => store.getters.getAppSettings)
const isDataDirty = computed(() => (JSON.stringify(appSettings.value) !== JSON.stringify(originalSettings.value)))

const appSettings = ref({
	...originalSettings.value,
})

const goHome = () => router.push({ name: 'home' })
const saveSettings = () => {
	store.dispatch('updateAppSettings', appSettings.value)
}

watch(() => appSettings.value.startOnLogin, (value) => {
	if (!value) appSettings.value.startMinimized = false
})
</script>

<style scoped lang="sass">
$settings-header: 5.5rem
.settings
	background-color: var(--secondary-background-color)

	.settings-header
		padding-inline: var(--secondary-start-offset)
		border-inline: 1px solid var(--main-border-color)
		background-color: var(--main-background-color)
		min-height: $settings-header
	.settings-body
		background-color: var(--main-background-color)
		border: 1px solid var(--main-border-color)
		padding: var(--secondary-start-offset)
		height: calc(100vh - $settings-header - var(--app-header-min-height))
</style>

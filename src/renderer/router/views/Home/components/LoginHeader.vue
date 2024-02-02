<script setup lang="ts">
import { useRouter } from "vue-router"
import Tooltip from "@components/Tooltip"
import AppIcon from "@components/AppIcon"
import AppButton from "@components/AppButton"

const router = useRouter()

const createNewLogin = () => router.push({ name: "create" })
const openSettings = () => router.push({ name: "settings" })
const onImportClick = () => router.push({ name: "import" })
const onExportClick = () => router.push({ name: "export" })
</script>

<template>
	<div
		class="login-header flex items-center justify-between border-b border-main px-4"
	>
		<div class="flex items-center gap-2">
			<AppButton @click="onImportClick">
				<AppIcon end-space icon="file-import" />
				<span>Import</span>
			</AppButton>
			<AppButton @click="onExportClick">
				<span>Export</span>
				<AppIcon start-space icon="file-export" />
			</AppButton>
		</div>
		<div class="flex items-center gap-2">
			<Tooltip id="create-new-login">
				<AppButton
					theme="outline-primary"
					rounded="circle"
					@click="createNewLogin"
				>
					<AppIcon icon="plus" />
				</AppButton>

				<template #content>
					<span>Create New Login</span>
				</template>
			</Tooltip>
			<Tooltip id="open-settings">
				<AppButton
					theme="outline-warning"
					rounded="circle"
					@click="openSettings"
				>
					<AppIcon icon="settings" />
				</AppButton>
				<template #content>
					<span>Open Settings</span>
				</template>
			</Tooltip>
		</div>
	</div>
</template>

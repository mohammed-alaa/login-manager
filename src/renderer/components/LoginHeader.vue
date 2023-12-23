<script setup lang="ts">
import { computed } from "vue"
import { useRouter } from "vue-router"
import store from "@store"
import Tooltip from "@components/Tooltip"
import AppIcon from "@components/AppIcon"
import AppButton from "@components/AppButton"

const router = useRouter()

const loginsNumber = computed(() => store.getters.loginsNumber)

const createNewLogin = () => router.push({ name: "create" })
const openSettings = () => router.push({ name: "settings" })
</script>

<template>
	<div
		class="login-header flex items-center justify-between border-b border-main px-4"
	>
		<div class="text-white">
			<h2>{{ loginsNumber }} Logins</h2>
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

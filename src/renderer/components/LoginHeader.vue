<script setup lang="ts">
import { computed } from "vue"
import { useRouter } from "vue-router"
import store from "@store"
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
			<AppButton
				id="newLogin"
				theme="outline-primary"
				rounded="circle"
				@click="createNewLogin"
			>
				<AppIcon icon="plus" />
			</AppButton>

			<AppButton
				theme="outline-warning"
				rounded="circle"
				@click="openSettings"
			>
				<AppIcon icon="settings" />
			</AppButton>
		</div>
	</div>
</template>

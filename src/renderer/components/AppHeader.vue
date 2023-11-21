<script setup>
import { computed } from "vue"
import store from "@store"
import AppIcon from "@components/AppIcon"
import AppButton from "@components/AppButton"

const getAppInformation = computed(() => store.getters.getAppInformation)
const getAppName = computed(() => getAppInformation.value.appName ?? "")

const minApplication = () => store.minimizeApplication()
const maxApplication = () => store.maximizeApplication()
const closeApplication = () => store.exitApplication()
</script>

<template>
	<header class="app-header flex items-center justify-between">
		<h1 class="text-white" v-text="getAppName" />
		<div class="h-full flex items-center gap-2">
			<AppButton color="primary" variant="text" @click="minApplication">
				<AppIcon icon="minimize" />
			</AppButton>
			<AppButton color="primary" variant="text" @click="maxApplication">
				<AppIcon icon="square" />
			</AppButton>
			<AppButton
				color="danger"
				variant="outlined"
				@click="closeApplication"
			>
				<AppIcon icon="x" />
			</AppButton>
		</div>
	</header>
</template>

<script setup>
import { computed } from "vue"
import store from "@store"

const getAppInformation = computed(() => store.getters.getAppInformation)
const getAppName = computed(() => getAppInformation.value.appName ?? "")
</script>

<template>
	<header class="app-header">
		<h1 class="text-white select-none" v-text="getAppName" />
	</header>
</template>

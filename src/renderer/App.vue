<template>
	<main class="main relative h-screen">
		<AppHeader />
		<AppLoading />
		<router-view />
	</main>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import store from "@store"
import AppHeader from "@components/AppHeader"
import AppLoading from "@components/AppLoading"

onMounted(() => {
	store.init()
})
</script>

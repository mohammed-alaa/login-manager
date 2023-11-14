<template>
	<main class="main relative min-h-screen">
		<AppHeader />
		<AppLoading />
		<div class="wrapper">
			<router-view />
		</div>
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

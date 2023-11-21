<script setup lang="ts">
import { computed, onBeforeMount } from "vue"
import store from "@store"
import AppHeader from "@components/AppHeader"

const getAppInformation = computed(() => store.getters.getAppInformation)
const canShowCustomAppHeader = computed(
	() => !!getAppInformation.value.customAppHeader
)

onBeforeMount(() => store.init())
</script>

<template>
	<main class="main relative" :class="{ appHeader: canShowCustomAppHeader }">
		<template v-if="canShowCustomAppHeader">
			<AppHeader />
		</template>
		<router-view />
	</main>
</template>

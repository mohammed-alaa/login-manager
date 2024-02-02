<script setup lang="ts">
import { computed, onMounted, onUnmounted } from "vue"
import store from "@store"
import LoginList from "./components/LoginList.vue"
import LoginBody from "./components/LoginBody.vue"
import LoginHeader from "./components/LoginHeader.vue"
import SearchLogins from "./components/SearchLogins.vue"
import LoginBodyEmpty from "./components/LoginBodyEmpty.vue"

const isActiveLoginValid = computed(() => store.getters.isActiveLoginValid)

onMounted(() => {
	store.resetLoginsPaginationData()
	store.retrieveLogins().catch(() => {})
})

onUnmounted(() => {
	store.resetSearch()
	store.resetActiveLoginId()
	store.resetLoginsPaginationData()
})
</script>

<template>
	<div class="login-view h-fullscreen grid">
		<SearchLogins />
		<LoginHeader />
		<LoginList />
		<div class="login-body-wrapper p-4 overflow-x-hidden">
			<template v-if="isActiveLoginValid">
				<LoginBody />
			</template>
			<template v-else>
				<LoginBodyEmpty />
			</template>
		</div>
	</div>
</template>

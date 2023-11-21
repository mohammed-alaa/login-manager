<script setup lang="ts">
import { computed, onMounted, onUnmounted } from "vue"
import store from "@store"
import LoginList from "@components/LoginList"
import LoginHeader from "@components/LoginHeader"
import LoginBody from "@components/LoginBody"
import LoginBodyEmpty from "@components/LoginBodyEmpty"
import SearchLogins from "@components/SearchLogins"

const isActiveLoginValid = computed(() => store.getters.isActiveLoginValid)

onMounted(() => store.retrieveLogins())
onUnmounted(() => store.clearActiveLoginId())
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

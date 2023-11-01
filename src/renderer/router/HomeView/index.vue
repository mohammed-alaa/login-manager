<template>
	<div class="login-view d-grid">
		<SearchLogins />
		<LoginHeader />
		<LoginList />
		<LoginBody />
	</div>
</template>

<script setup>
import { onMounted } from "vue"
import { useStore } from "vuex"
import LoginList from "@components/LoginList"
import LoginHeader from "@components/LoginHeader"
import LoginBody from "@components/LoginBody"
import SearchLogins from "@components/SearchLogins"

const store = useStore()
onMounted(() => store.dispatch("retrieveLogins"))
</script>

<style scoped lang="sass">
.login-view
	height: calc(100vh - var(--app-header-min-height))
	grid-template-rows: var(--search-height) auto
	grid-template-columns: var(--login-list-width) auto
</style>

<style scoped lang="scss">
.login-view {
	grid-template-areas:
		"search info"
		"list body";
}
</style>

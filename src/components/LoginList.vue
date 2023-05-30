<template>
	<div class="login-list">
		<transition-group name="swap">
			<template v-if="computedFilteredLogins.length">
				<LoginItem v-for="(login) in filteredLogins()" :key="login.id" :is-active="isLoginActive(login.id)"
					@click="activeLoginChange(login.id)" :login="login" />
			</template>
			<template v-else>
				<div class="empty-logins-list h-100 d-flex flex-column align-items-center justify-content-center">
					<div class="text-white">
						No logins found
					</div>
					<p class="body mb-0">
						There are no results matching your search.
					</p>
				</div>
			</template>
		</transition-group>
	</div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { filterLogins } from '@/utils/frontend'
import LoginItem from '@/components/LoginItem'

const store = useStore()

const searchLogin = computed(() => store.getters.getSearchText)
const logins = computed(() => store.getters.getLoginList)
const activeLogin = computed(() => store.getters.getActiveLogin)
const computedFilteredLogins = computed(() => filterLogins(logins.value, searchLogin.value))

const isLoginActive = (loginId) => (activeLogin.value === loginId)
const filteredLogins = () => (computedFilteredLogins.value)
const activeLoginChange = (loginId) => store.dispatch('activeLoginChange', loginId)
</script>

<style lang="sass" scoped>
.login-list
	grid-area: list
	background-color: var(--main-background-color)
	border-right: 1px solid var(--main-border-color)
	overflow: hidden auto !important

	.empty-logins-list
		font-size: 2.25rem
		.body
			font-size: 1.05rem
			color: var(--color-gray)
</style>

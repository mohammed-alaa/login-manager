<template>
	<div class="login-list">
		<transition-group name="swap">
			<template v-if="computedFilteredLogins.length">
				<ol class="list-unstyled m-0 login-list-listbox">
					<transition-group name="fade" :key="6">
						<LoginItem v-for="(login) in filteredLogins()" :key="login.id" :is-active="isLoginActive(login.id)"
							@click="activeLoginChange(login.id)" :login="login" />
					</transition-group>
				</ol>
			</template>
			<template v-else>
				<div class="empty-logins-list h-100 d-flex flex-column align-items-center justify-content-center">
					<div class="text-white">
						No logins found
					</div>
					<div class="body">
						There are no results matching your search.
					</div>
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
$login-list-top-offset: calc(var(--app-header-min-height) + var(--login-header-min-height) + 2px)
.login-list
	grid-area: list
	background-color: var(--main-background-color)
	border-right: 1px solid var(--main-border-color)
	overflow: hidden auto !important

	.empty-logins-list
		padding: 2rem
		.body
			font-size: .9rem
			color: var(--color-gray)
</style>

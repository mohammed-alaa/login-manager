<script setup lang="ts">
import { computed } from "vue"
import store from "@store"
import LoginItem from "@components/LoginItem"

const logins = computed(() => store.getters.getLoginList)
const loginsNumber = computed(() => store.getters.loginsNumber)
const getActiveLoginId = computed({
	get: () => store.getters.getActiveLoginId,
	set: (value) => (store.getters.getActiveLoginId = value),
})

const isLoginActive = (loginId: number) => loginId === getActiveLoginId.value
const retrieveLogin = (loginId: number) => (getActiveLoginId.value = loginId)
</script>

<template>
	<div
		class="login-list border-e border-main py-2 px-4"
		:class="{
			'flex flex-col overflow-y-auto gap-2': loginsNumber,
		}"
	>
		<transition-group name="swap">
			<template v-if="loginsNumber">
				<template v-for="login in logins" :key="login.id">
					<LoginItem
						:is-active="isLoginActive(login.id)"
						:login="login"
						@click="retrieveLogin(login.id)"
					/>
				</template>
			</template>
			<template v-else>
				<h3 class="text-white py-8 text-center">No logins found.</h3>
			</template>
		</transition-group>
	</div>
</template>

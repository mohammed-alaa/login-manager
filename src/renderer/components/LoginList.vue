<script setup lang="ts">
import { computed } from "vue"
import type { LoginList } from "@types"
import store from "@store"
import AppIcon from "@components/AppIcon"
import Tooltip from "@components/Tooltip"
import AppButton from "@components/AppButton"
import LoginItem from "@components/LoginItem"

const logins = computed<LoginList>(() => store.getters.getLoginList)
const getLoginListSort = computed(() => store.getters.getLoginListSort)
const isLoginListHasMore = computed(() => store.getters.isLoginListHasMore)
const isLoginListLoading = computed(() => store.getters.isLoginListLoading)
const loginsNumber = computed(() => store.getters.loginsNumber)
const getActiveLoginId = computed({
	get: () => store.getters.getActiveLoginId,
	set: (value) => (store.getters.getActiveLoginId = value),
})

const isLoginActive = (loginId: number) => loginId === getActiveLoginId.value
const retrieveLogin = (loginId: number) => (getActiveLoginId.value = loginId)
const updateLoginsSortOrder = () => store.updateLoginsSortOrder()

const loginListScroll = (e: Event) => {
	if (isLoginListLoading.value || !isLoginListHasMore.value) return

	const target = e.target as HTMLDivElement

	if (
		Math.ceil(target.scrollTop + target.clientHeight) >
		target.scrollHeight - 20
	) {
		store.retrieveLogins()
	}
}
</script>

<template>
	<div
		class="login-list border-e border-main overflow-hiddena"
		:class="{
			'flex flex-col': loginsNumber,
		}"
	>
		<div
			class="sticky top-0 z-10 py-2 px-4 bg-main shadow-md shadow-black/40 flex items-center justify-between"
		>
			<p class="text-gray">{{ loginsNumber }} logins</p>
			<Tooltip id="login-list-sort">
				<AppButton
					rounded="circle"
					color="secondary"
					variant="outlined"
					:disabled="isLoginListLoading"
					@click="updateLoginsSortOrder"
				>
					<AppIcon :icon="`sort-${getLoginListSort}ending`" />
				</AppButton>
				<template #content>
					<span>Sorting {{ getLoginListSort }}ending</span>
				</template>
			</Tooltip>
		</div>
		<!-- <transition-group name="swap"> -->
		<template v-if="isLoginListLoading">
			<div class="h-full flex items-center justify-center text-white">
				<AppIcon icon="refresh" class="animate-spin" />
			</div>
		</template>
		<template v-else-if="logins.length">
			<div
				class="py-2 px-4 flex flex-col gap-2 overflow-y-auto"
				@scroll.prevent="loginListScroll"
			>
				<template v-for="login in logins" :key="login.id">
					<LoginItem
						:is-active="isLoginActive(login.id)"
						:login="login"
						@click="retrieveLogin(login.id)"
					/>
				</template>
			</div>
		</template>
		<template v-else>
			<h3 class="text-white py-8 text-center">No logins found.</h3>
		</template>
		<!-- </transition-group> -->
	</div>
</template>

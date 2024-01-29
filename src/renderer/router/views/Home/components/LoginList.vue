<script setup lang="ts">
import { computed, onMounted, onUnmounted } from "vue"
import constants from "@/constants"
import type { LoginList, WindowType } from "@types"
import store from "@store"
import AppIcon from "@components/AppIcon"
import Tooltip from "@components/Tooltip"
import AppButton from "@components/AppButton"
import LoginItem from "./LoginItem.vue"

const appHeaderHeight = (
	window as WindowType
).navigator.windowControlsOverlay.getTitlebarAreaRect().height
const {
	loginListItem: loginListItemHeight,
	loginListToolbar: loginListToolbarHeight,
	loginListInfinitScroll,
} = constants.height

const logins = computed<LoginList>(() => store.getters.getLoginList)
const getLoginListSort = computed(() => store.getters.getLoginListSort)
const isLoginListHasMore = computed(() => store.getters.isLoginListHasMore)
const isLoginListLoading = computed(() => store.getters.isLoginListLoading)
const getLoginsLimit = computed(() => store.getters.getLoginsLimit)
const loginsNumber = computed(() => store.getters.loginsNumber)
const getActiveLoginId = computed({
	get: () => store.getters.getActiveLoginId,
	set: (value) => (store.getters.getActiveLoginId = value),
})

const isLoginActive = (loginId: number) => loginId === getActiveLoginId.value
const retrieveLogin = (loginId: number) => (getActiveLoginId.value = loginId)
const updateLoginsSortOrder = () => store.updateLoginsSortOrder()

const loginListScroll = (e: Event) => {
	if (isLoginListLoading.value || !isLoginListHasMore.value) {
		return
	}

	const target = e.target as HTMLDivElement

	if (
		Math.ceil(target.scrollTop + target.clientHeight) >
		target.scrollHeight - loginListInfinitScroll
	) {
		store.retrieveLogins()
	}
}

const onWindowResize = () => {
	const loginListHeight =
		window.innerHeight -
		loginListItemHeight -
		appHeaderHeight -
		loginListToolbarHeight
	const loginListItemsNumber = Math.floor(
		loginListHeight / loginListItemHeight
	)

	if (getLoginsLimit.value < loginListItemsNumber) {
		store.setLoginsLimit(loginListItemsNumber)
		store.retrieveLogins()
	}
}

onMounted(() => {
	onWindowResize()
	window.addEventListener("resize", onWindowResize)
})

onUnmounted(() => {
	window.removeEventListener("resize", onWindowResize)
})
</script>

<template>
	<div
		class="login-list border-e border-main overflow-hidden gap-2"
		:class="{
			'flex flex-col': loginsNumber,
		}"
	>
		<div
			class="min-h-login-list-toolbar sticky top-0 z-10 px-4 bg-main shadow-md shadow-black/40 flex items-center justify-between"
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
		<transition-group name="swap">
			<template v-if="logins.length">
				<div
					class="px-4 flex flex-col gap-2 overflow-y-auto"
					@scroll="loginListScroll"
				>
					<template v-for="login in logins" :key="login.id">
						<LoginItem
							:is-active="isLoginActive(login.id)"
							:login="login"
							@click="retrieveLogin(login.id)"
						/>
					</template>
				</div>

				<div
					v-show="isLoginListLoading"
					class="flex items-center justify-center text-white py-2"
				>
					<AppIcon icon="refresh" class="animate-spin" />
				</div>
			</template>
			<template v-else>
				<h3 class="text-white py-8 text-center">No logins found.</h3>
			</template>
		</transition-group>
	</div>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from "vue"
import store from "@store"
import { getWebsiteName } from "@utils"
import AppIcon from "@components/AppIcon"
import AppAlert from "@components/AppAlert"
import AppButton from "@components/AppButton"
import AppButtonCopy from "@components/AppButtonCopy"
import LoginBodyActions from "@components/LoginBodyActions"
import DeleteConfirmation from "@components/DeleteConfirmation"

const activeLogin = reactive({
	data: {
		website: "",
		username: "",
		password: "",
	},
	loading: false,
	error: false,
	isPasswordVisible: false,
})

const getMode = computed(() => store.getters.getMode)
const isDeleting = computed(() => getMode.value === "d")
const activeLoginId = computed(() => store.getters.getActiveLoginId)
const isActiveLoginValid = computed(() => store.getters.isActiveLoginValid)
const getLoginWebsiteAddress = computed(() => ({
	view: activeLogin.data.website
		? getWebsiteName(activeLogin.data.website)
		: "<no website>",
	copy: activeLogin.data.website,
}))
const getLoginUsername = computed(() => ({
	view: activeLogin.data.username || "<no username>",
	copy: activeLogin.data.username,
}))
const getLoginPassword = computed(() => ({
	view: activeLogin.isPasswordVisible
		? activeLogin.data.password
		: "********",
	copy: activeLogin.data.password,
}))

const cancelDeleting = () => store.dispatch("setViewMode")
const confirmDeletion = () => store.dispatch("deleteLogin")
const retrieveLogin = () => {
	if (!isActiveLoginValid.value || activeLogin.loading) {
		return
	}

	activeLogin.error = false
	activeLogin.loading = true
	activeLogin.isPasswordVisible = false

	store
		.retrieveLogin(activeLoginId.value)
		.then((data) => (activeLogin.data = data))
		.catch(() => (activeLogin.error = true))
		.finally(() => (activeLogin.loading = false))
}

watch(activeLoginId, () => retrieveLogin(), { immediate: true })
</script>

<template>
	<div class="login-body flex flex-col gap-4 text-gray p-4">
		<template v-if="activeLogin.loading">
			<div class="text-lg text-center text-white">
				<AppIcon end-space icon="loader-2" class="animate-spin" />
				<span>Loading...</span>
			</div>
		</template>
		<template v-else-if="activeLogin.error">
			<AppAlert
				type="danger"
				alert-text="Error occured while retrieving login details."
			/>
		</template>
		<template v-else>
			<LoginBodyActions />
			<div class="website">
				<div class="head text-lg text-white mb-2">
					<AppIcon end-space icon="world" />
					<span>Website</span>
				</div>
				<div class="flex justify-between items-center">
					<component
						:is="getLoginWebsiteAddress.copy ? 'a' : 'p'"
						noreferrer
						target="_blank"
						class="text-white lowercase truncate"
						:href="getLoginWebsiteAddress.copy"
					>
						{{ getLoginWebsiteAddress.view }}
					</component>
					<AppButtonCopy :value="getLoginWebsiteAddress.copy" />
				</div>
			</div>
			<div class="username">
				<div class="head text-lg text-white mb-2">
					<AppIcon end-space icon="user-circle" />
					<span>Username</span>
				</div>
				<div class="flex justify-between items-center">
					<span
						class="text-white truncate"
						v-text="getLoginUsername.view"
					/>
					<AppButtonCopy :value="getLoginUsername.copy" />
				</div>
			</div>
			<div class="password">
				<div
					class="head text-lg text-white mb-2 flex items-center gap-2"
				>
					<AppIcon icon="password-user" />
					<span>Password</span>
					<AppButton
						size="sm"
						rounded="circle"
						color="warning"
						:variant="`${
							activeLogin.isPasswordVisible
								? 'filled'
								: 'outlined'
						}`"
						@click="
							activeLogin.isPasswordVisible =
								!activeLogin.isPasswordVisible
						"
					>
						<AppIcon
							:icon="`${
								activeLogin.isPasswordVisible
									? 'eye-off'
									: 'eye'
							}`"
						/>
					</AppButton>
				</div>
				<div class="flex justify-between items-center">
					<span
						class="text-white truncate"
						v-text="getLoginPassword.view"
					/>
					<AppButtonCopy :value="getLoginPassword.copy" />
				</div>
			</div>
			<template v-if="isDeleting">
				<DeleteConfirmation
					@confirm-deleting="confirmDeletion"
					@cancel-deleting="cancelDeleting"
				/>
			</template>
		</template>
	</div>
</template>

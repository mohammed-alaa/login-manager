<template>
	<div class="login-body flex flex-col gap-4">
		<LoginBodyActions />
		<transition-group name="swap">
			<template v-if="isEditing || isCreating">
				<div :key="0" class="website">
					<div class="head">
						<AppIcon icon="globe" type="regular" />
						<span class="ms-2">Website</span>
					</div>
					<div
						:key="11"
						class="rest flex justify-between items-center"
					>
						<FormInput
							id="website"
							v-model="loginPlaceholder.website"
							type="text"
							nolabel
							nomargins
						/>
					</div>
				</div>
			</template>
			<div :key="1" class="username">
				<div class="head">
					<AppIcon icon="person-badge-fill" type="regular" />
					<span class="ms-2">Username</span>
				</div>
				<template v-if="isViewing || isDeleting">
					<div
						:key="12"
						class="rest flex justify-between items-center"
					>
						<span
							class="text-white text-truncate"
							v-text="getLoginUsername"
						/>
						<AppButtonCopy :value="getLoginUsername" />
					</div>
				</template>
				<template v-else-if="isEditing || isCreating">
					<div
						:key="13"
						class="rest flex justify-between items-center"
					>
						<FormInput
							id="website"
							v-model="loginPlaceholder.username"
							type="text"
							nolabel
							nomargins
						/>
					</div>
				</template>
			</div>
			<div :key="3" class="password">
				<div class="head">
					<AppIcon icon="lock-fill" type="regular" />
					<span class="ms-2 me-2">Password</span>
					<template v-if="isViewing || isDeleting">
						<AppButton
							:key="7"
							class="show-password"
							size="normal"
							:theme="`${
								isPasswordVisible ? 'danger' : 'outline-warning'
							}`"
							@click="isPasswordVisible = !isPasswordVisible"
						>
							<AppIcon
								:icon="`${
									isPasswordVisible
										? 'eye-slash-fill'
										: 'eye-fill'
								}`"
							/>
						</AppButton>
					</template>
				</div>
				<template v-if="isViewing || isDeleting">
					<div
						:key="8"
						class="rest flex justify-between items-center"
					>
						<span
							class="text-white truncate"
							v-text="togglablePassword"
						/>
						<AppButtonCopy :value="getLoginPassword" />
					</div>
				</template>
				<template v-else-if="isEditing || isCreating">
					<div :key="9">
						<div class="rest flex justify-between items-center">
							<FormInput
								id="website"
								v-model="loginPlaceholder.password"
								type="text"
								nolabel
								nomargins
							/>
						</div>
						<GeneratePassword />
					</div>
				</template>
			</div>
			<template v-if="isCreating">
				<AppButton :key="4" theme="success" @click="createLoginSubmit">
					<AppIcon icon="plus-lg" />
					<span class="ms-1">Create</span>
				</AppButton>
			</template>
			<template v-else-if="isEditing">
				<AppButton :key="5" theme="success" @click="editLoginSubmit">
					<AppIcon icon="pencil-fill" />
					<span class="ms-1">Update</span>
				</AppButton>
			</template>
			<template v-else-if="isDeleting">
				<DeleteConfirmation
					:key="7"
					@confirm-deleting="confirmDeletion"
					@cancel-deleting="cancelDeleting"
				/>
			</template>
		</transition-group>
	</div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from "vue"
import { useStore } from "vuex"
import AppButtonCopy from "@components/AppButtonCopy"
import AppButton from "@components/AppButton"
import AppIcon from "@components/AppIcon"
import FormInput from "@components/FormInput"
import DeleteConfirmation from "@components/DeleteConfirmation"
import LoginBodyActions from "@components/LoginBodyActions"
import GeneratePassword from "@components/GeneratePassword"

const store = useStore()
const isPasswordVisible = ref(false)
const loginPlaceholder = ref({
	website: "",
	username: "",
	password: "",
})

const getMode = computed(() => store.getters.getMode)
const isCreating = computed(() => getMode.value === "c")
const isEditing = computed(() => getMode.value === "e")
const isDeleting = computed(() => getMode.value === "d")
const isViewing = computed(() => getMode.value === "v")
const logins = computed(() => store.getters.getLoginList)
const activeLoginId = computed(() => store.getters.getActiveLogin)
const activeLoginPassword = computed(() => store.getters.getActiveLoginPassword)
const loginInformation = computed(() =>
	logins.value.find((login) => login.id === activeLoginId.value)
)
const getLoginWebsiteAddress = computed(
	() => loginInformation.value?.website || ""
)
const getLoginUsername = computed(() => loginInformation.value?.username || "")
const getLoginPassword = computed(() => activeLoginPassword.value || "")
const togglablePassword = computed(() => {
	let password = getLoginPassword.value
	let passwordStars = ""
	if (!isPasswordVisible.value) {
		password.split("").forEach(() => {
			passwordStars += "*"
		})
		password = passwordStars
	}
	return password
})

const cancelDeleting = () => store.dispatch("setViewMode")
const createLoginSubmit = () =>
	store.dispatch("createNewLogin", loginPlaceholder.value)
const editLoginSubmit = () =>
	store.dispatch("updateLogin", loginPlaceholder.value)
const confirmDeletion = () => store.dispatch("deleteLogin")
const updateModeOnEscape = (event) => {
	if (!isViewing.value) {
		const isSearchElement = event.target.id === "search"
		if (!isSearchElement) {
			const isEscapeClicked = event.keyCode === 27
			isEscapeClicked && store.dispatch("setViewMode")
		}
	}
}

watch(isEditing, (newValue) => {
	if (newValue) {
		loginPlaceholder.value = {
			website: getLoginWebsiteAddress.value,
			username: getLoginUsername.value,
			password: getLoginPassword.value,
		}
	}
})

watch(isCreating, (newValue) => {
	if (newValue) {
		loginPlaceholder.value = {
			website: "",
			username: "",
			password: "",
		}
	}
})

watch(activeLoginId, () => {
	isPasswordVisible.value = false
})

onMounted(() => {
	document.addEventListener("keydown", updateModeOnEscape)
})
onUnmounted(() => {
	document.removeEventListener("keydown", updateModeOnEscape)
})
</script>

<style scoped lang="sass">
.login-body
	background-color: var(--secondary-background-color)
	overflow: hidden auto
	padding: var(--secondary-start-offset)

	.website, .username, .password
		.head
			font-size: 1.4rem
			color: var(--color-gray)
			margin-bottom: 0.5rem
		.rest
			font-size: 1.4rem

	.website .head > i
		color: #2196f3
	.username .head > i
		color: #47cc47
	.password .head > i
		color: #bf772d
</style>

<template>
	<div class="login-body d-flex flex-column gap-4">
		<LoginBodyActions />
		<transition-group name="swap">
			<div class="website" :key="0" v-if="isEditing || isCreating">
				<div class="head">
					<AppIcon icon="globe" type="regular" />
					<span class="ms-2">Website</span>
				</div>
				<div class="rest d-flex flex-row justify-content-between align-items-center" :key="11">
					<FormInput type="text" id="website" nolabel nomargins v-model="loginPlaceholder.website"
						size="normal" />
				</div>
			</div>
			<div class="username" :key="1">
				<div class="head">
					<AppIcon icon="person-circle" type="regular" />
					<span class="ms-2">Username</span>
				</div>
				<div class="rest d-flex flex-row justify-content-between align-items-center" v-if="isViewing || isDeleting" :key="12">
					<span class="value overflow-hidden" v-text="getLoginUsername" />
					<AppButtonCopy :value="getLoginUsername" />
				</div>
				<div class="rest d-flex flex-row justify-content-between align-items-center" v-else-if="isEditing || isCreating" :key="13">
					<FormInput type="text" id="website" nolabel nomargins v-model="loginPlaceholder.username"
						size="normal" />
				</div>
			</div>
			<div class="password" :key="3">
				<div class="head">
					<AppIcon icon="lock" type="regular" />
					<span class="ms-2 me-2">Password</span>
					<AppButton class="show-password" type="button" size="sm"
						:theme="`${isPasswordVisible ? 'danger' : 'outline-warning'}`"
						@click="isPasswordVisible = !isPasswordVisible" v-if="isViewing || isDeleting" :key="7">
						<AppIcon :icon="`${isPasswordVisible ? 'eye-slash' : 'eye'}`" />
					</AppButton>
				</div>
				<div class="rest d-flex flex-row justify-content-between align-items-center" v-if="isViewing || isDeleting" :key="8">
					<span class="value overflow-hidden" v-text="togglablePassword" />
					<AppButtonCopy :value="getLoginPassword" />
				</div>
				<div v-else-if="isEditing || isCreating" :key="9">
					<div class="rest d-flex flex-row justify-content-between align-items-center">
						<FormInput type="text" id="website" nolabel nomargins v-model="loginPlaceholder.password"
							size="normal" />
					</div>
					<GeneratePassword />
				</div>
			</div>
			<AppButton class="submit-buttons" type="button" size="normal" theme="success" @click="createLoginSubmit"
				v-if="isCreating" :key="4">
				<AppIcon icon="plus-lg" />
				<span class="ms-1">Create</span>
			</AppButton>
			<AppButton class="submit-buttons" type="button" size="normal" theme="success" @click="editLoginSubmit"
				v-else-if="isEditing" :key="5">
				<AppIcon icon="pencil" />
				<span class="ms-1">Update</span>
			</AppButton>
			<DeleteConfirmation v-else-if="isDeleting" :key="7" @confirmDeleting="confirmDeletion"
				@cancelDeleting="cancelDeleting" />
		</transition-group>
	</div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useStore } from 'vuex'
import AppButtonCopy from '@/components/AppButtonCopy'
import AppButton from '@/components/AppButton'
import AppIcon from '@/components/AppIcon'
import FormInput from '@/components/FormInput'
import DeleteConfirmation from '@/components/DeleteConfirmation'
import LoginBodyActions from '@/components/LoginBodyActions'
import GeneratePassword from '@/components/GeneratePassword'

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
const loginInformation = computed(() => logins.value.find(login => login.id === activeLoginId.value))
const getLoginWebsiteAddress = computed(() => loginInformation.value?.website || "")
const getLoginUsername = computed(() => loginInformation.value?.username || "")
const getLoginPassword = computed(() => activeLoginPassword.value || "")
const togglablePassword = computed(() => {
	let password = getLoginPassword.value
	let passwordStars = ""
	if (!isPasswordVisible.value) {
		password.split("").forEach(() => { passwordStars += "*" })
		password = passwordStars
	}
	return password
})

const cancelDeleting = () => store.dispatch('setViewMode')
const createLoginSubmit = () => store.dispatch('createNewLogin', loginPlaceholder.value)
const editLoginSubmit = () => store.dispatch('updateLogin', loginPlaceholder.value)
const confirmDeletion = () => store.dispatch('deleteLogin')
const updateModeOnEscape = (event) => {
	if (!isViewing.value) {
		const isSearchElement = (event.target.id === "search")
		if (!isSearchElement) {
			const isEscapeClicked = (event.keyCode === 27)
			isEscapeClicked && store.dispatch('setViewMode')
		}
	}
}

watch(() => isEditing.value, (newValue) => {
	if (newValue) {
		loginPlaceholder.value = {
			website: getLoginWebsiteAddress.value,
			username: getLoginUsername.value,
			password: getLoginPassword.value,
		}
	}
})
watch(() => isCreating.value, (newValue) => {
	if (newValue) {
		loginPlaceholder.value = {
			website: "",
			username: "",
			password: "",
		}
	}
})

onMounted(() => {
	document.addEventListener('keydown', updateModeOnEscape)
})
onUnmounted(() => {
	document.removeEventListener('keydown', updateModeOnEscape)
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
			width: 80%
			.value
				width: 70%
				text-overflow: ellipsis
				font-size: 1.4rem
				color: var(--color-white)

	.website .head > i
		color: #2196f3
	.username .head > i
		color: #47cc47
	.password .head > i
		color: #bf772d

	.submit-buttons
		font-size: 1.1rem
		margin: 2rem var(--secondary-start-offset) 0
		padding-inline: var(--secondary-start-offset)
</style>

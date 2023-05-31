<template>
	<div class="login-header d-flex flex-row align-items-center justify-content-between position-relative">
		<div class="text-white">
			<h2 class="m-0">{{ getLoginsLength }} Logins</h2>
		</div>
		<div class="d-flex flex-row align-items-center gap-2">
			<AppButton id="newLogin" @click="createNewLogin" theme="outline-primary"
				size="normal" :disabled="isCreateButtonDisabled" :isActive="isCreating">
				<AppIcon icon="plus-lg" />
				<span class="ms-2">New Login (n)</span>
			</AppButton>
			<AppButton @click="openSettings" theme="outline-warning" size="normal">
				<AppIcon icon="gear-fill" />
				<span class="ms-2">settings</span>
			</AppButton>
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import AppButton from '@/components/AppButton'
import AppIcon from '@/components/AppIcon'

const store = useStore()
const router = useRouter()
let newLoginElement = null

const isCreating = computed(() => store.getters.getMode === 'c')
const isViewing = computed(() => store.getters.getMode === 'v')
const isCreateButtonDisabled = computed(() => (!isViewing.value && !isCreating.value))
const getLoginsLength = computed(() => store.getters.getLoginList?.length ?? 0)

const createNewLogin = () => (isCreating.value ? store.dispatch('setViewMode') : store.dispatch('setCreateMode'))
const openSettings = () => router.push({ name: 'settings' })

const focusnewLogin = (event) => {
	if ((event.target.localName !== "input") && (event.key === "n")) {
		event.preventDefault()
		newLoginElement.click()
	}
}
onMounted(() => {
	newLoginElement = document.getElementById("newLogin")
	document.addEventListener('keydown', focusnewLogin)
})
onUnmounted(() => document.removeEventListener('keydown', focusnewLogin))
</script>

<style scoped lang="sass">
.login-header
	grid-area: info
	border-bottom: 1px solid var(--main-border-color)
	background-color: var(--main-background-color)
	z-index: 1
	padding-inline: var(--secondary-start-offset)
</style>

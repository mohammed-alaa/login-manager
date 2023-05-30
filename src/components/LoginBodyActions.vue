<template>
	<div class="body-actions d-flex flex-row align-items-center justify-content-between gap-4">
		<transition name="swap">
			<template v-if="showWebsiteName">
				<div class="website d-flex flex-row d-flex flex-row align-items-center gap-2 overflow-hidden">
					<AppIcon icon="globe" class="text-white py-2 px-3" />
					<a class="website-href text-lowercase text-decoration-none py-2 px-4 text-truncate" target="_blank" noreferrer
					:href="getLoginWebsiteAddress" :key="10">
						<span v-text="getLoginWebsiteName" />
					</a>
				</div>
			</template>
			<template v-else>
				<div />
			</template>
		</transition>
		<div class="d-flex flex-row align-items-center justify-content-center gap-2">
			<AppButton id="editLogin" @click="editLogin" theme="outline-warning" :disabled="isEditButtonDisabled"
				:isActive="isEditing">
				<AppIcon icon="pencil-fill" />
				<span class="ms-2">Edit (e)</span>
			</AppButton>
			<AppButton id="deleteLogin" @click="deleteLogin" theme="outline-danger" :disabled="isDeleteButtonDisabled"
				:isActive="isDeleting">
				<AppIcon icon="trash-fill" />
				<span class="ms-2">Delete (d)</span>
			</AppButton>
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { getWebsiteName } from '@/utils/frontend'
import AppButton from '@/components/AppButton'
import AppIcon from '@/components/AppIcon'

const store = useStore()
let editLoginElement = null
let deleteLoginElement = null

const isViewing = computed(() => store.getters.getMode === 'v')
const isEditing = computed(() => store.getters.getMode === 'e')
const isDeleting = computed(() => store.getters.getMode === 'd')
const isActiveLoginInvalid = computed(() => store.getters.getActiveLogin === '-1')
const isEditButtonDisabled = computed(() => (!isActiveLoginInvalid.value && !isViewing.value && !isEditing.value))
const isDeleteButtonDisabled = computed(() => (!isActiveLoginInvalid.value && !isViewing.value && !isDeleting.value))
const activeLoginId = computed(() => store.getters.getActiveLogin)
const logins = computed(() => store.getters.getLoginList)
const loginInformation = computed(() => logins.value.find(login => login.id === activeLoginId.value))
const getLoginWebsiteAddress = computed(() => loginInformation.value?.website ?? "")
const getLoginWebsiteName = computed(() => getWebsiteName(getLoginWebsiteAddress.value))
const showWebsiteName = computed(() => (isViewing.value || isDeleting.value))

const editLogin = () => (isEditing.value ? store.dispatch('setViewMode') : store.dispatch('setEditMode'))
const deleteLogin = () => (isDeleting.value ? store.dispatch('setViewMode') : store.dispatch('setDeleteMode'))

const focusnewLogin = (event) => {
	if (event.target.localName === "input")
		return

	if (event.key === "e") {
		event.preventDefault()
		editLoginElement.click()
	} else if (event.key === "d") {
		event.preventDefault()
		deleteLoginElement.click()
	}
}
onMounted(() => {
	editLoginElement = document.getElementById("editLogin")
	deleteLoginElement = document.getElementById("deleteLogin")
	document.addEventListener('keydown', focusnewLogin)
})
onUnmounted(() => document.removeEventListener('keydown', focusnewLogin))
</script>

<style scoped lang="sass">
.body-actions
	.website
		font-size: 1.3rem
		font-weight: light
		letter-spacing: 0.05rem
		i, .website-href
			transition: all 250ms ease-in-out
		i
			border-radius: 50%
			border: 1px solid #69326f
			background-color: #3e1c42b3
		.website-href
			border: 1px solid #3e1c42f5
			border-radius: var(--border-radius)
			color: #dfc7f3

			&:hover
				border-color: transparent
				background-color: #3e1c42f5
				color: var(--color-white)
</style>

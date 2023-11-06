<template>
	<div class="body-actions flex items-center justify-between gap-4">
		<transition name="swap">
			<template v-if="showWebsiteName">
				<div class="website flex items-center gap-2 overflow-hidden">
					<AppIcon icon="globe" class="text-white py-2 px-3" />
					<a
						:key="10"
						class="website-href lowercase text-decoration-none py-2 px-4 truncate"
						target="_blank"
						noreferrer
						:href="getLoginWebsiteAddress"
					>
						<span v-text="getLoginWebsiteName" />
					</a>
				</div>
			</template>
			<template v-else>
				<div />
			</template>
		</transition>
		<div class="flex items-center justify-center gap-2">
			<AppButton
				id="editLogin"
				theme="outline-warning"
				:disabled="isEditButtonDisabled"
				:is-active="isEditing"
				@click="editLogin"
			>
				<AppIcon icon="pencil-fill" />
				<span class="ms-2">Edit (e)</span>
			</AppButton>
			<AppButton
				id="deleteLogin"
				theme="outline-danger"
				:disabled="isDeleteButtonDisabled"
				:is-active="isDeleting"
				@click="deleteLogin"
			>
				<AppIcon icon="trash-fill" />
				<span class="ms-2">Delete (d)</span>
			</AppButton>
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from "vue"
import { useStore } from "vuex"
import { getWebsiteName } from "@utils"
import AppButton from "@components/AppButton"
import AppIcon from "@components/AppIcon"

const store = useStore()
let editLoginElement = null
let deleteLoginElement = null

const isViewing = computed(() => store.getters.getMode === "v")
const isEditing = computed(() => store.getters.getMode === "e")
const isDeleting = computed(() => store.getters.getMode === "d")
const isActiveLoginInvalid = computed(
	() => store.getters.getActiveLogin === "-1"
)
const isEditButtonDisabled = computed(
	() => !isActiveLoginInvalid.value && !isViewing.value && !isEditing.value
)
const isDeleteButtonDisabled = computed(
	() => !isActiveLoginInvalid.value && !isViewing.value && !isDeleting.value
)
const activeLoginId = computed(() => store.getters.getActiveLogin)
const logins = computed(() => store.getters.getLoginList)
const loginInformation = computed(() =>
	logins.value.find((login) => login.id === activeLoginId.value)
)
const getLoginWebsiteAddress = computed(
	() => loginInformation.value?.website ?? ""
)
const getLoginWebsiteName = computed(() =>
	getWebsiteName(getLoginWebsiteAddress.value)
)
const showWebsiteName = computed(() => isViewing.value || isDeleting.value)

const editLogin = () =>
	isEditing.value
		? store.dispatch("setViewMode")
		: store.dispatch("setEditMode")
const deleteLogin = () =>
	isDeleting.value
		? store.dispatch("setViewMode")
		: store.dispatch("setDeleteMode")

const focusnewLogin = (event) => {
	if (event.target.localName === "input") return

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
	document.addEventListener("keydown", focusnewLogin)
})
onUnmounted(() => document.removeEventListener("keydown", focusnewLogin))
</script>

<style scoped lang="sass">
.body-actions
	.website
		font-size: 1.3rem
		font-weight: lighter
		letter-spacing: 0.05rem
		i, .website-href
			transition: all 250ms ease-in-out
		i
			border-radius: 50%
			border: 1px solid #60688b
			background-color: rgb(39 42 55 / 66%)
		.website-href
			border: 1px solid #60688bf5
			border-radius: var(--border-radius)
			color: #c2cdfc

			&:hover
				border-color: transparent
				background-color: rgb(39 42 55)
				color: var(--color-white)
</style>

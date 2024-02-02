<script setup lang="ts">
import { reactive, computed } from "vue"
import { useRouter } from "vue-router"
import store from "@store"
import AppIcon from "@components/AppIcon"
import AppButton from "@components/AppButton"
import DeleteConfirmation from "./DeleteConfirmation.vue"

const router = useRouter()

const deleteLogin = reactive({
	loading: false,
	error: false,
	open: false,
})

const activeLoginId = computed(() => store.getters.getActiveLoginId)

const closeLogin = () => store.resetActiveLoginId()
const attempDeleteLogin = () => (deleteLogin.open = true)
const editLogin = () =>
	router.push({ name: "edit", params: { id: activeLoginId.value } })
const confirmDeleteLogin = () => {
	if (!deleteLogin.open || deleteLogin.loading) {
		return
	}

	deleteLogin.loading = true
	deleteLogin.error = false

	store
		.deleteLogin()
		.then(() => (deleteLogin.open = false))
		.catch(() => (deleteLogin.error = true))
		.finally(() => (deleteLogin.loading = false))
}
</script>

<template>
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-2">
			<AppButton color="secondary" @click="editLogin">
				<AppIcon end-space icon="edit" />
				<span>Edit</span>
			</AppButton>
			<AppButton
				color="danger"
				:disabled="deleteLogin.open"
				:loading="deleteLogin.open"
				@click="attempDeleteLogin"
			>
				<AppIcon end-space icon="trash" />
				<span>Delete</span>
			</AppButton>
		</div>
		<div>
			<AppButton rounded="circle" variant="outlined" @click="closeLogin">
				<AppIcon icon="x" />
			</AppButton>
		</div>
	</div>
	<DeleteConfirmation
		v-model="deleteLogin.open"
		:error="deleteLogin.error"
		:disabled="deleteLogin.loading"
		@confirm="confirmDeleteLogin"
	/>
</template>

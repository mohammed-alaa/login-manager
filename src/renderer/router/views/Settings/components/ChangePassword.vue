<script setup lang="ts">
import { reactive, computed } from "vue"
import type { ChangePrimaryPasswordForm } from "@types"
import store from "@store"
import Modal from "@components/Modal"
import AppIcon from "@components/AppIcon"
import AppForm from "@components/AppForm"
import AppAlert from "@components/AppAlert"
import AppButton from "@components/AppButton"
import FormInput from "@components/FormInput"
import GeneratePassword from "@components/GeneratePassword"

const changePassword = reactive({
	loading: false,
	private: {
		generatedPassword: "",
		changed: false,
		showInstructionModal: false,
	},
	data: {
		currentPrimaryPassword: "43mBcn8gqkXndZk6",
		newPrimaryPassword: "",
		confirmNewPrimaryPassword: "",
	},
	errors: {
		general: "",
		currentPrimaryPassword: "",
		newPrimaryPassword: "",
		confirmNewPrimaryPassword: "",
	},
})

const closeModal = () => (changePassword.private.showInstructionModal = false)
const preChangePrimaryPassword = () => {
	changePassword.private.showInstructionModal = true
}

const changePrimaryPassword = () => {
	if (changePassword.loading) {
		return
	}

	closeModal()
	changePassword.loading = true	
	changePassword.private.changed = false
	changePassword.errors = {
		general: "",
		currentPrimaryPassword: "",
		newPrimaryPassword: "",
		confirmNewPrimaryPassword: "",
	}

	store.changePassword(changePassword.data)
		.then(() => (changePassword.private.changed = true))
		.catch((errors) => {
			if ('general' in errors) {
				changePassword.errors.general = errors.general
			} else {
				changePassword.errors = errors
			}
		})
		.finally(() => (changePassword.loading = false))
}
</script>

<template>
	<h3 class="text-white mb-2 underline underline-offset-4">Primary password</h3>
	<AppForm
		class="flex flex-wrap gap-4"
		@submit="preChangePrimaryPassword"
	>
		<div class="w-full">
			<template v-if="changePassword.errors.general?.length">
				<AppAlert type="danger" :alert-text="changePassword.errors.general" />
			</template>
			<template v-else-if="changePassword.private.changed">
				<AppAlert type="success" alert-text="Primary password has been changed successfully." />
			</template>
		</div>
		<div class="w-full">
			<FormInput
				id="current-primary-password"
				label="Current Primary Password"
				placeholder="Current Primary Password"
				:error="changePassword.errors.currentPrimaryPassword"
				v-model="changePassword.data.currentPrimaryPassword"
			/>
		</div>
		<div class="flex-1">
			<FormInput
				id="new-primary-password"
				label="New Primary Password"
				placeholder="New Primary Password"
				:error="changePassword.errors.newPrimaryPassword"
				v-model="changePassword.data.newPrimaryPassword"
			/>
		</div>
		<div class="flex-1">
			<FormInput
				id="confirm-new-primary-password"
				label="Confirm New Primary Password"
				placeholder="Confirm New Primary Password"
				:error="changePassword.errors.confirmNewPrimaryPassword"
				v-model="changePassword.data.confirmNewPrimaryPassword"
			/>
		</div>
		<div class="w-full">
			<GeneratePassword v-model="changePassword.private.generatedPassword" />
		</div>
		<div class="w-full">
			<AppButton
				type="submit"
				:loading="changePassword.loading"
				:disabled="changePassword.loading"
			>
				<AppIcon end-space icon="check" />
				<span>Change</span>
			</AppButton>
		</div>
	</AppForm>

	<Modal
		title="Change Primary Password"
		v-model="changePassword.private.showInstructionModal"
	>
		<div class="text-gray">
			<p>
				<span class="underline">The process involves the following:</span>
				<ul>
					<li>
						<span>Retrieve all logins and do the following for each login:</span>
						<ol>
							<li>Decrypting the password using the current (old) primary password.</li>
							<li>Encrypting the password using the new primary password.</li>
							<li>Update the login's password to the new encrypted password.</li>
						</ol>
					</li>
					<li>Update the primary password with the new entered one.</li>
				</ul>
			</p>
			<p class="mt-2">
				<span class="underline">Instructions:</span>
				<ul>
					<li>Ensure you have exported/backed up the current data.</li>
					<li>Changes are not saved if any error has occured at any point.</li>
				</ul>
			</p>
		</div>
		<template #actions>
			<div class="flex items-center justify-between gap-2">
				<AppButton
					block
					variant="outlined"
					color="warning"
					@click="changePrimaryPassword"
				>
					<AppIcon end-space icon="check" />
					<span>Change</span>
				</AppButton>
				<AppButton
					block
					color="secondary"
					@click="closeModal"
				>
					<AppIcon end-space icon="x" />
					<span>Cancel</span>
				</AppButton>
			</div>
		</template>
	</Modal>
</template>
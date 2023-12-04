<script setup lang="ts">
import { reactive } from "vue"
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

	store
		.changePassword(changePassword.data)
		.then(() => (changePassword.private.changed = true))
		.catch((errors) => {
			changePassword.errors.currentPrimaryPassword =
				errors?.currentPrimaryPassword ?? ""
			changePassword.errors.newPrimaryPassword =
				errors?.newPrimaryPassword ?? ""
			changePassword.errors.confirmNewPrimaryPassword =
				errors?.confirmNewPrimaryPassword ?? ""
			changePassword.errors.general =
				errors?.general ??
				"Error occured when trying to change primary password."
		})
		.finally(() => (changePassword.loading = false))
}
</script>

<template>
	<h3 class="text-white">Primary password</h3>
	<AppForm class="flex flex-wrap gap-4" @submit="preChangePrimaryPassword">
		<template v-if="changePassword.errors.general?.length">
			<div class="w-full">
				<AppAlert
					type="danger"
					:alert-text="changePassword.errors.general"
				/>
			</div>
		</template>
		<template v-else-if="changePassword.private.changed">
			<div class="w-full">
				<AppAlert
					type="success"
					alert-text="Primary password has been changed successfully."
				/>
			</div>
		</template>
		<div class="w-full">
			<FormInput
				id="current-primary-password"
				v-model="changePassword.data.currentPrimaryPassword"
				label="Current Primary Password"
				placeholder="Current Primary Password"
				:error="changePassword.errors.currentPrimaryPassword"
			/>
		</div>
		<div class="flex-1">
			<FormInput
				id="new-primary-password"
				v-model="changePassword.data.newPrimaryPassword"
				label="New Primary Password"
				placeholder="New Primary Password"
				:error="changePassword.errors.newPrimaryPassword"
			/>
		</div>
		<div class="flex-1">
			<FormInput
				id="confirm-new-primary-password"
				v-model="changePassword.data.confirmNewPrimaryPassword"
				label="Confirm New Primary Password"
				placeholder="Confirm New Primary Password"
				:error="changePassword.errors.confirmNewPrimaryPassword"
			/>
		</div>
		<div class="w-full">
			<GeneratePassword
				v-model="changePassword.private.generatedPassword"
			/>
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
		v-model="changePassword.private.showInstructionModal"
		title="Change Primary Password"
	>
		<div class="text-gray flex flex-col gap-2">
			<div>
				<span class="underline"
					>The process involves the following:</span
				>
				<ul>
					<li>
						<span
							>Retrieve all logins and do the following for each
							login:</span
						>
						<ol>
							<li>
								Decrypting the password using the current (old)
								primary password.
							</li>
							<li>
								Encrypting the password using the new primary
								password.
							</li>
							<li>
								Update the login's password to the new encrypted
								password.
							</li>
						</ol>
					</li>
					<li>
						Update the primary password with the new entered one.
					</li>
				</ul>
			</div>
			<div>
				<span class="underline">Instructions:</span>
				<ul>
					<li>
						Ensure you have exported/backed up the current data.
					</li>
					<li>
						Changes are not saved if any error has occured at any
						point.
					</li>
				</ul>
			</div>
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
				<AppButton block color="secondary" @click="closeModal">
					<AppIcon end-space icon="x" />
					<span>Cancel</span>
				</AppButton>
			</div>
		</template>
	</Modal>
</template>

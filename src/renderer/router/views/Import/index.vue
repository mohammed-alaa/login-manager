<script setup lang="ts">
import { reactive, computed, watch } from "vue"
import { useRouter } from "vue-router"
import type { ImportFileDataType, ImportFileErrorType } from "@types"
import store from "@store"
import AppIcon from "@components/AppIcon"
import AppAlert from "@components/AppAlert"
import AppButton from "@components/AppButton"
import FormInput from "@components/FormInput"
import FormInputFile from "@components/FormInputFile"
import FormInputRadio from "@components/FormInputRadio"
import TitleWithContent from "@layouts/TitleWithContent"

const router = useRouter()

const importFileOptions = [
	{
		value: "csv",
		id: "import-csv",
		label: "Import CSV",
	},
	{
		value: "json",
		id: "import-json",
		label: "Import JSON",
	},
]

const importFileJSONOptions = [
	{
		value: false,
		id: "import-json-any-format",
		label: "Any Format",
	},
	{
		value: true,
		id: "import-json-old-format",
		label: "Old Format (v1.2.0 and below)",
	},
]

const importData = reactive({
	loading: false,
	error: false,
	data: {
		type: "csv",
		delimiter: ",",
		isOldJSON: false,
		oldJSONPassword: "",
		file: null as File | null,
		columns: {
			website: "website",
			username: "username",
			password: "password",
		},
	} as ImportFileDataType,
	errors: {} as ImportFileErrorType,
})

const isLoading = computed(() => importData.loading)
const isSubmissionDisabled = computed(
	() => isLoading.value || !importData.data.file
)

const goHome = () => router.push({ name: "home" })
const onImportSubmit = () => {
	importData.errors = {}
	importData.loading = true

	store
		.importFile(importData.data)
		.then(() => goHome())
		.catch((error: ImportFileErrorType) => (importData.errors = error))
		.finally(() => (importData.loading = false))
}

watch(
	() => importData.data.type,
	() => {
		importData.errors = {}
		importData.data.file = null
		importData.data.isOldJSON = false
		importData.data.oldJSONPassword = ""
	}
)
</script>

<template>
	<TitleWithContent>
		<template #title> Import Files </template>
		<template #content>
			<form class="flex flex-col gap-4" @submit.prevent="onImportSubmit">
				<p class="text-white">
					Select the file type you want to import.
				</p>

				<template v-if="importData.errors.general">
					<AppAlert
						type="danger"
						:alert-text="importData.errors.general"
					/>
				</template>

				<template
					v-for="(option, index) in importFileOptions"
					:key="index"
				>
					<FormInputRadio
						:id="option.id"
						v-model="importData.data.type"
						color="secondary"
						:value="option.value"
						:label="option.label"
					/>
					<template v-if="importData.errors.type">
						<AppAlert
							type="danger"
							:alert-text="importData.errors.type"
						/>
					</template>
				</template>

				<template v-if="importData.data.type">
					<FormInputFile
						v-model="importData.data.file"
						:accept="`.${importData.data.type}`"
					/>
					<template v-if="importData.errors.file">
						<AppAlert
							type="danger"
							:alert-text="importData.errors.file"
						/>
					</template>
				</template>

				<template v-if="importData.data.type === 'csv'">
					<FormInput
						id="import-csv-delimiter"
						v-model="importData.data.delimiter"
						label="Delimiter"
						placeholder="Delimiter"
						:error="importData.errors.delimiter"
					/>
				</template>
				<template v-else-if="importData.data.type === 'json'">
					<template
						v-for="(option, index) in importFileJSONOptions"
						:key="index"
					>
						<FormInputRadio
							:id="option.id"
							v-model="importData.data.isOldJSON"
							color="primary"
							:value="option.value"
							:label="option.label"
						/>
					</template>

					<template v-if="importData.data.isOldJSON">
						<FormInput
							id="import-json-password"
							v-model="importData.data.oldJSONPassword"
							:error="importData.errors.oldJSONPassword"
							label="Password"
							placeholder="Password"
						/>
					</template>
				</template>

				<template v-if="!importData.data.isOldJSON">
					<p class="text-white">
						<span class="font-bold">Columns names</span>
						<br />
						<span>
							<strong>Note</strong>: The columns names are case
							sensitive.
						</span>
					</p>

					<FormInput
						id="import-columns-website"
						v-model="importData.data.columns.website"
						label="Website"
						placeholder="Website"
						:error="importData.errors.columns?.website"
					/>

					<FormInput
						id="import-columns-username"
						v-model="importData.data.columns.username"
						label="Username"
						placeholder="Username"
						:error="importData.errors.columns?.username"
					/>

					<FormInput
						id="import-columns-password"
						v-model="importData.data.columns.password"
						label="Password"
						placeholder="Password"
						:error="importData.errors.columns?.password"
					/>
				</template>

				<AppButton
					type="submit"
					:loading="isLoading"
					:disabled="isSubmissionDisabled"
				>
					<AppIcon end-space icon="file-import" />
					<span>Import</span>
				</AppButton>
			</form>
		</template>
	</TitleWithContent>
</template>

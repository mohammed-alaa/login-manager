<script setup lang="ts">
import { useRouter } from "vue-router"
import AppIcon from "@components/AppIcon"
import AppButton from "@components/AppButton"

const router = useRouter()

const createNew = () => router.push({ name: "create" })
</script>

<template>
	<div
		class="login-body h-full flex items-center justify-center gap-1 text-gray"
	>
		<span>Select one or</span>
		<AppButton @click="createNew">
			<AppIcon end-space icon="square-rounded-plus-filled" />
			<span>Create New</span>
		</AppButton>
	</div>
</template>

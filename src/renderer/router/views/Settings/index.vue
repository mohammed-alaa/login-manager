<script setup lang="ts">
import { useRouter } from "vue-router"
import AppIcon from "@components/AppIcon"
import AppButton from "@components/AppButton"
import About from "./components/About"
import ChangePassword from "./components/ChangePassword"
import ApplicationSettings from "./components/ApplicationSettings"

const router = useRouter()

const goHome = () => router.push({ name: "home" })
</script>

<template>
	<section class="settings max-w-80 mx-auto">
		<div
			class="settings-header px-4 flex items-center gap-2 sticky top-0 z-10 bg-secondary border-x border-b border-main"
		>
			<AppButton variant="text" color="secondary" @click="goHome">
				<AppIcon icon="arrow-left" />
			</AppButton>
			<h2 class="text-white">Settings</h2>
		</div>
		<div
			class="settings-body h-full p-4 flex flex-col gap-4 bg-main border border-t-0 border-main"
		>
			<ApplicationSettings />
			<hr class="border-main" />
			<ChangePassword />
			<hr class="border-main" />
			<About />
		</div>
	</section>
</template>

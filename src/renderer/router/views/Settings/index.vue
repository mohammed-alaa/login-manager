<script setup lang="ts">
import { useRouter } from "vue-router"
import AppIcon from "@components/AppIcon"
import Tooltip from "@components/Tooltip"
import AppButton from "@components/AppButton"
import About from "./components/About.vue"
import ChangePassword from "./components/ChangePassword.vue"
import ApplicationSettings from "./components/ApplicationSettings.vue"

const router = useRouter()

const goHome = () => router.push({ name: "home" })
</script>

<template>
	<section class="settings max-w-80 mx-auto">
		<div
			class="settings-header px-4 flex items-center gap-2 sticky top-safe-area z-10 bg-secondary border-x border-b border-main"
		>
			<Tooltip id="go-back-title">
				<AppButton variant="text" color="secondary" @click="goHome">
					<AppIcon icon="arrow-left" />
				</AppButton>

				<template #content>
					<span>Go Back</span>
				</template>
			</Tooltip>
			<h2 class="text-white">Settings</h2>
		</div>
		<div
			class="settings-body h-full p-4 flex flex-col gap-4 bg-main border border-t-0 border-main overflow-y-auto"
		>
			<ApplicationSettings />
			<hr class="border-main" />
			<ChangePassword />
			<hr class="border-main" />
			<About />
		</div>
	</section>
</template>

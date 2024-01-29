<script setup>
import { useRouter } from "vue-router"
import Tooltip from "@components/Tooltip"
import AppIcon from "@components/AppIcon"
import AppButton from "@components/AppButton"

const router = useRouter()

const goHome = () => router.push({ name: "home" })
</script>

<template>
	<section class="settings max-w-80 mx-auto">
		<div
			class="settings-header px-4 flex items-center gap-2 sticky top-0 z-10 bg-secondary border-x border-b border-main"
		>
			<Tooltip id="go-back-title">
				<AppButton variant="text" color="secondary" @click="goHome">
					<AppIcon icon="arrow-left" />
				</AppButton>

				<template #content>
					<span>Go Back</span>
				</template>
			</Tooltip>
			<h2 class="text-white">
				<slot name="title" />
			</h2>
		</div>
		<div
			class="settings-body p-4 flex flex-col gap-4 bg-main border border-t-0 border-main overflow-y-auto"
		>
			<slot name="content" />
		</div>
	</section>
</template>

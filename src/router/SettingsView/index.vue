<template>
	<section class="settings overflow-auto">
		<div class="container text-white">
			<div class="settings-header d-flex flex-row align-items-center justify-content-between position-sticky top-0">
				<div class="title">
					<h1 class="text-white">Settings</h1>
				</div>
				<div class="actions">
					<AppButton @click="goToHomePage" theme="outline-warning" size="normal">
						<AppIcon icon="lock-fill" />
						<span>Home</span>
					</AppButton>
				</div>
			</div>
			<div class="settings-body">
				<h2 v-for="(_, index) in Array(20)" :key="index">Body</h2>
			</div>
		</div>
	</section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon'
import AppButton from '@/components/AppButton'

const router = useRouter()

const goToHomePage = () => router.push({ name: 'home' })
</script>

<style scoped lang="sass">
$settings-header: 5.5rem
.settings
	background-color: var(--secondary-background-color)

	.settings-header
		padding-inline: var(--secondary-start-offset)
		border-block-end: 1px solid var(--main-border-color)
		border-inline: 1px solid var(--main-border-color)
		background-color: var(--main-background-color)
		min-height: $settings-header
	.settings-body
		border-inline: 1px solid var(--main-border-color)
		padding: var(--secondary-start-offset)
		height: calc(100vh - $settings-header - var(--app-header-min-height))
</style>

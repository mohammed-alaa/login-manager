<template>
	<header class="app-header d-flex flex-row justify-content-between align-content-center">
		<div class="title text-white fw-bold text-center my-auto">
			<span>Login Manager</span>
		</div>
		<div class="d-flex flex-row gap-1 align-items-center me-1">
			<AppButton size="normal" theme="outline-light" @click="minApplication" noPadding noBorderRadius>
				<AppIcon icon="dash" />
			</AppButton>
			<AppButton size="normal" theme="outline-light" @click="maxApplication" noPadding noBorderRadius>
				<AppIcon icon="square" />
			</AppButton>
			<AppButton size="normal" theme="outline-danger" @click="closeApplication" noPadding noBorderRadius>
				<AppIcon icon="x" />
			</AppButton>
		</div>
	</header>
</template>

<script setup>
import { useStore } from 'vuex'
import AppButton from '@/components/AppButton'
import AppIcon from '@/components/AppIcon'

const store = useStore()
const minApplication = () => store.dispatch('minimizeApplication')
const maxApplication = () => store.dispatch('maximizeApplication')
const closeApplication = () => store.dispatch('exitApplication')
</script>

<style scoped lang="sass">
.app-header
    -webkit-app-region: drag !important
    border-bottom: 1px solid var(--main-border-color)
    background-color: var(--main-background-color)
    padding-left: var(--main-start-offset)
    height: var(--app-header-min-height)

    .title
        -webkit-app-region: drag !important
        user-select: none
        font-size: 1.5rem
        line-height: 1.5
</style>

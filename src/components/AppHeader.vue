<template>
    <header class="app-header">
        <div class="title">
            <span class="title-text">
                Login Manager
            </span>
        </div>
        <div class="actions">
            <AppButton type="button" size="sm" theme="outline-light" @click="minApplication" class="action-button"
                noPadding noBorderRadius>
                <AppIcon icon="dash" />
            </AppButton>
            <AppButton type="button" size="sm" theme="outline-light" @click="maxApplication" class="action-button"
                noPadding noBorderRadius>
                <AppIcon icon="square" />
            </AppButton>
            <AppButton type="button" size="sm" theme="outline-danger" @click="closeApplication" class="action-button"
                noPadding noBorderRadius>
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
    display: flex
    flex-direction: row
    justify-content: space-between
    align-items: center
    border-bottom: 1px solid var(--main-border-color)
    background-color: var(--main-background-color)
    padding-left: var(--main-start-offset)
    -webkit-app-region: drag !important
    min-height: var(--app-header-min-height)

    .title, .title .title-text
        -webkit-app-region: drag !important
        font-size: 1.1rem
        font-weight: bold
        line-height: 1.6rem
        text-align: center
        color: var(--color-white)

    .actions .action-button
        margin: auto .15rem !important
</style>
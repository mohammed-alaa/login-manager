<template>
    <main class="main">
        <AppHeader />
        <AppLoading />
        <router-view />
    </main>
</template>

<script setup>
import AppHeader from '@/components/AppHeader'
import AppLoading from '@/components/AppLoading'
</script>

<style lang="sass">
@import '~bootstrap'
@import "@/assets/styles/bootstrap-icons/bootstrap-icons"
@import '@/assets/styles/style'
</style>

<style scoped lang="sass">
.main
    background-color: var(--main-background-color) !important
    position: relative
    min-height: 100vh
    font-family: 'Gantari', sans-serif
</style>
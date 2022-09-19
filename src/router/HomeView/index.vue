<template>
    <div class="login-view">
        <LoginList />
        <LoginHeader />
        <LoginBody />
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useStore } from 'vuex'
import LoginList from '@/components/LoginList'
import LoginHeader from '@/components/LoginHeader'
import LoginBody from '@/components/LoginBody'

const store = useStore()
onMounted(() => store.dispatch('retrieveLogins'))
</script>

<style scoped lang="sass">
.login-view
	height: calc(100vh - var(--app-header-min-height))
</style>
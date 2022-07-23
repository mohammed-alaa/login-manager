<template>
    <div class="login-list">
        <transition-group name="swap" :key="4">
            <ol class="list-unstyled m-0 login-list-listbox" v-if="computedFilteredLogins.length" :key="0">
                <transition-group name="fade" :key="6">
                    <LoginItem v-for="(login) in filteredLogins()" :key="login.id" :is-active="isLoginActive(login.id)"
                        @click="activeLoginChange(login.id)" :login="login" />
                </transition-group>
            </ol>
            <div class="empty-logins-list" v-else :key="1">
                <div class="header">
                    No logins found
                </div>
                <div class="body">
                    There are no results matching your search.
                </div>
            </div>
        </transition-group>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { filterLogins } from '@/utils/frontend'
import LoginItem from '@/components/LoginItem'

const store = useStore()

const searchLogin = computed(() => store.getters.getSearchText)
const logins = computed(() => store.getters.getLoginList)
const activeLogin = computed(() => store.getters.getActiveLogin)
const computedFilteredLogins = computed(() => filterLogins(logins.value, searchLogin.value))

const isLoginActive = (loginId) => (activeLogin.value === loginId)
const filteredLogins = () => (computedFilteredLogins.value)
const activeLoginChange = (loginId) => store.dispatch('activeLoginChange', loginId)
</script>

<style lang="sass" scoped>
$login-list-top-offset: calc(var(--app-header-min-height) + var(--login-header-min-height) + 2px)
.login-list
    position: absolute
    top: #{$login-list-top-offset}
    left: 0
    width: calc(100vw * var(--search-flex-gain))
    height: calc(100vh - #{$login-list-top-offset})
    background-color: var(--main-background-color)
    border-right: 1px solid var(--main-border-color)
    overflow: hidden auto !important
    .empty-logins-list
        padding: 2rem
        height: inherit
        display: flex
        flex-direction: column
        justify-content: center
        .header
            color: var(--color-white)
        .body
            font-size: .9rem
            color: var(--color-gray)
</style>
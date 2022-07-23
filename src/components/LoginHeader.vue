<template>
    <div class="login-header">
        <SearchLogins />
        <div class="login-header-info">
            <div class="logins-number">
                <h2 class="m-0">{{ getLoginsLength }} Logins</h2>
            </div>
            <div class="actions">
                <AppButton type="button" id="newLogin" @click="createNewLogin" theme="outline-primary"
                    class="action-button" size="normal" :disabled="isCreateButtonDisabled" :isActive="isCreating">
                    <AppIcon icon="plus-lg" />
                    <span class="ms-2">New Login</span>
                </AppButton>
                <!-- <AppButton type="button" @click="openSettings" theme="outline-warning" class="action-button" size="normal">
                    <AppIcon icon="gear-fill" />
                </AppButton> -->
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
// import { useRouter } from 'vue-router'
import AppButton from '@/components/AppButton'
import AppIcon from '@/components/AppIcon'
import SearchLogins from '@/components/SearchLogins'

const store = useStore()
// const router = useRouter()
let newLoginElement = null

const isCreating = computed(() => store.getters.getMode === 'c')
const isViewing = computed(() => store.getters.getMode === 'v')
const isCreateButtonDisabled = computed(() => (!isViewing.value && !isCreating.value))
const getLoginsLength = computed(() => store.getters.getLoginList?.length || 0)

const createNewLogin = () => (isCreating.value ? store.dispatch('setViewMode') : store.dispatch('setCreateMode'))
// const openSettings = () => router.push({ name: 'settings' })

const focusnewLogin = (event) => {
    if ((event.target.localName !== "input") && (event.key === "n")) {
        event.preventDefault()
        newLoginElement.click()
    }
}
onMounted(() => {
    newLoginElement = document.getElementById("newLogin")
    document.addEventListener('keydown', focusnewLogin)
})
onUnmounted(() => document.removeEventListener('keydown', focusnewLogin))
</script>

<style scoped lang="sass">
.login-header
    border-bottom: 1px solid var(--main-border-color)
    background-color: #191919
    display: flex
    flex-direction: row
    align-items: center
    justify-content: space-between
    width: 100%
    z-index: 1
    position: relative
    min-height: var(--login-header-min-height)

    .login-header-info
        width: calc(100vw - 100vw * var(--search-flex-gain))
        display: flex
        flex-direction: row
        align-items: center
        justify-content: space-between
        padding-left: var(--secondary-start-offset)
        padding-right: var(--secondary-start-offset)

        .logins-number
            color: var(--color-white)
        .actions
            .action-button
                margin-inline: .5rem
</style>
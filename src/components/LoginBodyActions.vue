<template>
    <div class="body-actions">
        <transition name="swap">
            <a class="website" target="_blank" noreferrer :href="getLoginWebsiteAddress" v-if="isViewing || isDeleting"
                :key="10">
                <AppIcon icon="globe" />
                <span class="text" v-text="getLoginWebsiteName" />
                <AppIcon icon="box-arrow-up-right" />
            </a>
        </transition>
        <div class="actions">
            <AppButton id="editLogin" class="action-buttons" type="button" @click="editLogin" theme="outline-warning"
                size="normal" :disabled="isEditButtonDisabled" :isActive="isEditing">
                <AppIcon icon="pencil" />
                <span class="ms-2">Edit</span>
            </AppButton>
            <AppButton id="deleteLogin" class="action-buttons" type="button" @click="deleteLogin" theme="outline-danger"
                size="normal" :disabled="isDeleteButtonDisabled" :isActive="isDeleting">
                <AppIcon icon="trash" />
                <span class="ms-2">Delete</span>
            </AppButton>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { getWebsiteName } from '@/utils/frontend'
import AppButton from '@/components/AppButton'
import AppIcon from '@/components/AppIcon'

const store = useStore()
let editLoginElement = null
let deleteLoginElement = null

const isViewing = computed(() => store.getters.getMode === 'v')
const isEditing = computed(() => store.getters.getMode === 'e')
const isDeleting = computed(() => store.getters.getMode === 'd')
const isActiveLoginValid = computed(() => store.getters.getActiveLogin !== '-1')
const isEditButtonDisabled = computed(() => (!isActiveLoginValid.value && !isViewing.value && !isEditing.value))
const isDeleteButtonDisabled = computed(() => (!isActiveLoginValid.value && !isViewing.value && !isDeleting.value))
const activeLoginId = computed(() => store.getters.getActiveLogin)
const logins = computed(() => store.getters.getLoginList)
const loginInformation = computed(() => logins.value.find(login => login.id === activeLoginId.value))
const getLoginWebsiteAddress = computed(() => loginInformation.value?.website || "")
const getLoginWebsiteName = computed(() => getWebsiteName(getLoginWebsiteAddress.value))

const editLogin = () => (isEditing.value ? store.dispatch('setViewMode') : store.dispatch('setEditMode'))
const deleteLogin = () => (isDeleting.value ? store.dispatch('setViewMode') : store.dispatch('setDeleteMode'))

const focusnewLogin = (event) => {
    if (event.target.localName === "input")
        return

    if (event.key === "e") {
        event.preventDefault()
        editLoginElement.click()
    } else if (event.key === "d") {
        event.preventDefault()
        deleteLoginElement.click()
    }
}
onMounted(() => {
    editLoginElement = document.getElementById("editLogin")
    deleteLoginElement = document.getElementById("deleteLogin")
    document.addEventListener('keydown', focusnewLogin)
})
onUnmounted(() => document.removeEventListener('keydown', focusnewLogin))
</script>

<style scoped lang="sass">
$padding: .5rem 1rem
.body-actions
    display: flex
    flex-direction: row
    align-items: center
    justify-content: space-between
    margin: 2rem var(--secondary-start-offset) 0
    transition: all .4s ease-in-out
    .actions
        display: flex
        justify-content: flex-end
        flex: 1
        transition: all .4s ease-in-out
        .action-buttons
            margin-right: var(--main-start-offset)
            margin-left: var(--main-start-offset)
            transition: all .4s ease-in-out
    .website
        font-size: 1.3rem
        text-transform: uppercase
        border: 1px solid #1c78c1
        text-decoration: none
        overflow: hidden
        display: flex
        flex-direction: row
        align-items: center
        font-weight: 500
        letter-spacing: 0.1rem
        border-radius: .4rem
        transition: all .4s ease-in-out
        i
            display: inline-block
            background-color: #1c78c1
            color: var(--color-white)
            padding: $padding
            transition: all .4s ease-in-out
            &:last-child
                opacity: 0
                visibility: hidden
        .text
            padding: $padding
            background-color: var(--secondary-background-color)
            color: #2494ec
            transition: all .4s ease-in-out
        &:hover
            border-radius: var(--border-radius)
            box-shadow: 0 0 4rem #2494ec99
            i
                &:first-child
                    padding-left: 2rem
                &:last-child
                    opacity: 1
                    visibility: visible
                    padding-right: 2rem
                    background-color: #1c78c1
                    color: var(--color-white)
            .text
                padding-inline: 0
                background-color: #1c78c1
                color: var(--color-white)
</style>
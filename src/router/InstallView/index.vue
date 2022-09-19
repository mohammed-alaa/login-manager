<template>
    <div class="validate-phrase">
        <div class="validate-phrase-container text-white">
            <div class="container">
                <h1 class="text-center text-white mb-3">
                    <AppIcon icon="user-crown" />
                    <span class="ms-1">Enter Master Key</span>
                </h1>
                <transition-group name="swap">
                    <AppAlertVue v-if="isMasterPasswordSubmitted && isMasterPasswordError" type="danger"
                        alert-text="Keys don't match." />
                    <AppAlertVue v-if="isMasterPasswordSubmitted && !isMasterPasswordError" type="success"
                        alert-text="Master 🔑 has been saved!" />
                </transition-group>
                <form @submit.prevent="formSubmit">
                    <FormInput type="text" id="password" v-model="passPhrase">
                        <template #label>
                            <div class="text-white">
                                <AppIcon icon="user-crown" />
                                <span class="ms-1">Enter the key</span>
                            </div>
                        </template>
                    </FormInput>
                    <FormInput type="text" id="password" v-model="confirmedPassPhrase">
                        <template #label>
                            <div class="text-white">
                                <AppIcon icon="user-crown" />
                                <span class="ms-1">Confirm the key</span>
                            </div>
                        </template>
                    </FormInput>
                    <AppButton theme="primary" type="submit" @click.prevent="formSubmit" :loading="isLoading"
                        text="Save the 🔑" class="w-100" />
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import FormInput from '@/components/FormInput'
import AppButton from '@/components/AppButton'
import AppAlertVue from '@/components/AppAlert'
import AppIcon from '@/components/AppIcon'

const store = useStore()
const router = useRouter()
const isMasterPasswordSubmitted = ref(false)
const isMasterPasswordError = ref(false)
const passPhrase = ref('')
const confirmedPassPhrase = ref('')

const isLoading = computed(() => store.getters.getIsLoading)
const verifyPassword = computed(() => {
    return ((passPhrase.value.trim().length > 0) && (passPhrase.value === confirmedPassPhrase.value))
})

const formSubmit = async () => {
    isMasterPasswordSubmitted.value = true
    isMasterPasswordError.value = false
    if (verifyPassword.value) {
        await store.dispatch('createPassPhrase', passPhrase.value)
        isMasterPasswordError.value = false
        setTimeout(() => router.replace({ name: "PassPhrase" }), 1000)
    } else {
        isMasterPasswordError.value = true
    }
}
</script>

<style scoped lang="sass">
.validate-phrase
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    height: calc(100vh - var(--app-header-min-height))

    .validate-phrase-container
        background-color: var(--secondary-background-color)
        border: 1px solid var(--main-border-color)
        box-shadow: 0 0 .3rem var(--main-border-color)
        border-radius: 1rem
        padding: 4rem
</style>
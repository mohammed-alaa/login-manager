<template>
    <div class="validate-phrase">
        <div class="validate-phrase-container text-white">
            <div class="container">
                <form @submit.prevent="formSubmit">
                    <FormInput type="text" id="password" v-model="passPhrase">
                        <template #label>
                            <h1 class="text-center text-white mb-3">
                                <AppIcon icon="user-crown" />
                                <span class="ms-1">Master Key 🔑</span>
                            </h1>
                            <transition-group name="swap" mode="out-in">
                                <AppAlertVue v-if="isMasterPasswordSubmitted && !isMasterPasswordError" type="danger"
                                    alert-text="Oops! You got the wrong 🔑." />
                                <AppAlertVue v-if="isMasterPasswordSubmitted && isMasterPasswordError" type="success"
                                    alert-text="Yay! Welcome back, master. 😊" />
                            </transition-group>
                        </template>
                    </FormInput>
                    <AppButton theme="primary" type="submit" @click.prevent="formSubmit" :loading="isLoading"
                        text="Check the 🔑" class="w-100" />
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
const isLoading = computed(() => store.getters.getIsLoading)

const formSubmit = async () => {
    isMasterPasswordError.value = true
    const validPassPhrase = await store.dispatch('validatePassPhrase', passPhrase.value)
    isMasterPasswordSubmitted.value = true
    isMasterPasswordError.value = validPassPhrase
    validPassPhrase && setTimeout(() => router.replace({ name: "home" }), 1000)
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
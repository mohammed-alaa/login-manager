<template>
    <div class="generate-password">
        <FormInput type="text" id="generatedPassword" nolabel v-model="generatedPassword" size="normal" class="w-80"
            readonly nomargins @focus="autoSelectGeneratedPassword" />
        <AppButton type="button" size="normal" theme="outline-info" @click="generatePassword" class="mx-3">
            <AppIcon icon="shuffle" />
            <span class="ms-1">generate password</span>
        </AppButton>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import AppButton from '@/components/AppButton'
import AppIcon from '@/components/AppIcon'
import FormInput from '@/components/FormInput'

const generatedPassword = ref('')

const autoSelectGeneratedPassword = (event) => event.target.select()
const generatePassword = () => {
    const allLetters = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-_=+'
    const allLettersLength = allLetters.length
    generatedPassword.value = ''
    for (let i = 0; i < 16; i++) {
        generatedPassword.value += allLetters[Math.floor(Math.random() * allLettersLength)]
    }
}
</script>

<style scoped lang="sass">
.generate-password
    display: flex
    flex-direction: row
    align-items: center
    margin-top: 1rem
</style>
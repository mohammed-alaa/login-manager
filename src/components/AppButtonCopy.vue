<template>
    <AppButton v-if="!isCopied" type="button" @click="copyText" size="normal" theme="outline-info">
        <AppIcon icon="clipboard" />
        <span class="ms-2">Copy</span>
    </AppButton>
    <div v-else class="copied">
        <AppIcon icon="check-circle" />
        <span class="ms-2">Copied</span>
    </div>
</template>

<script setup>
import { defineProps, ref } from 'vue'
import AppButton from '@/components/AppButton'
import AppIcon from '@/components/AppIcon'

const isCopied = ref(false)
const props = defineProps({
    value: {
        type: String,
        required: false,
        default: "",
    },
})

const copyText = () => {
    if (props.value.trim().length) {
        navigator.clipboard.writeText(props.value)
        isCopied.value = true
        setTimeout(() => isCopied.value = false, 1000)
    }
}
</script>

<style scoped lang="sass">
.copied
    background-color: #4E2F52
    color: #dfc7ff
    text-transform: uppercase
    padding: .5rem 1rem
    border-radius: var(--border-radius)
</style>
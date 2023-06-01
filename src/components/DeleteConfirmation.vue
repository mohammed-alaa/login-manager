<template>
    <div class="delete-confirmation d-flex flex-column align-items-center">
        <p class="delete-text text-white">You are about to delete the following login, are you sure?</p>
        <div class="actions d-flex flex-row align-items-center justify-content-between gap-3">
            <AppButton size="normal" theme="danger" @click="confirmDeleting">
                <AppIcon icon="trash-fill" />
                <span class="ms-1">Delete</span>
            </AppButton>
            <AppButton size="normal" theme="success" @click="cancelDeleting">
                <AppIcon icon="x" />
                <span class="ms-1">Cancel</span>
            </AppButton>
        </div>
    </div>
</template>

<script setup>
import { defineEmits } from 'vue'
import AppButton from '@/components/AppButton'
import AppIcon from '@/components/AppIcon'
const emits = defineEmits(['confirmDeleting', 'cancelDeleting'])

const confirmDeleting = () => emits('confirmDeleting')
const cancelDeleting = () => emits('cancelDeleting')
</script>

<style scoped lang="sass">
.delete-confirmation
    background-color: #1e212b
    border: 1px solid #6610f2
    padding: 1rem var(--secondary-start-offset)
    box-shadow: 0 0 0 0.35rem #6610f2
    margin: 2rem var(--secondary-start-offset)
    border-radius: var(--border-radius)
    .delete-text
        font-size: 2rem
    .actions
        width: 65%
</style>

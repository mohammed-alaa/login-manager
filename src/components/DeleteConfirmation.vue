<template>
    <div class="delete-confirmation">
        <p class="delete-text">You are about to delete this login, are you sure?</p>
        <div class="actions">
            <AppButton type="button" size="normal" theme="danger" @click="confirmDeleting">
                <AppIcon icon="trash" />
                <span class="ms-1">Yes, delete</span>
            </AppButton>
            <AppButton type="button" size="normal" theme="success" @click="cancelDeleting">
                <AppIcon icon="x" />
                <span class="ms-1">No, cancel</span>
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
    display: flex
    flex-direction: column
    align-items: center
    background-color: #271313
    border: 1px solid #271313
    padding: 1rem var(--secondary-start-offset)
    box-shadow: 0 0 0px 0.35rem #481919
    margin: 2rem var(--secondary-start-offset)
    border-radius: var(--border-radius)
    .delete-text
        color: var(--color-white)
        font-size: 2rem
    .actions
        display: flex
        flex-direction: row
        align-items: center
        justify-content: space-around
        width: 65%
</style>
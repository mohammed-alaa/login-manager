<template>
    <li :class="`login-item ${isActive ? 'active' : ''}`" @click.prevent="$emit('click')">
        <div class="website">
            <AppIcon icon="globe" />
            <span class="ms-1" v-text="getWebsiteAddressName" />
        </div>
        <div class="username">
            <AppIcon icon="person" />
            <span class="ms-1" v-text="getUsername" />
        </div>
    </li>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import { getWebsiteName } from '@/utils/frontend'
import AppIcon from '@/components/AppIcon'

defineEmits(['click'])
const props = defineProps({
    login: {
        type: [Object, null],
        required: false,
        default: null,
    },
    isActive: {
        type: Boolean,
        required: false,
        default: false,
    },
})

const getWebsiteAddressName = computed(() => getWebsiteName(props.login.website))
const getUsername = computed(() => (props.login.username))
</script>

<style scoped lang="sass">
$item-hover-background-color: #3e1c42
$item-active-background-color: #55285a
$item-active-border-color: #eee
$item-active-color: #f9f9f9

.login-item
    padding: 1rem 1.2rem
    cursor: pointer
    position: relative
    background-color: var(--main-background-color)
    border-block: 1px solid var(--main-border-color)
    transition: all .3s ease-in-out
    &::before
        content: ''
        position: absolute
        top: 0
        left: 0
        bottom: 0
        width: .5rem
        background-color: transparent
        transition: all .3s ease-in-out
    &.active, &:hover
        background-color: #{$item-active-background-color}
        border-block-color: #{$item-active-border-color}
        .website, .username
            color: #{$item-active-color}
            font-size: 1.03rem
    &.active::before
        background-color: #{$item-active-border-color}
    .website, .username
        color: var(--color-gray)
        overflow: hidden
        white-space: nowrap
        text-overflow: ellipsis
        transition: all .3s ease-in-out
</style>
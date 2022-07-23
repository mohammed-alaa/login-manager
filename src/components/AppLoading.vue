<template>
    <transition name="fade" mode="out-in">
        <div class="loading" v-if="isLoading">
            <AppIcon icon="arrow-clockwise" />
            <span class="loading-text ms-2">Loading...</span>
        </div>
    </transition>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import AppIcon from '@/components/AppIcon'

const store = useStore()
const isLoading = computed(() => store.getters.getIsLoading)
</script>

<style scoped lang="sass">
.loading
    position: absolute
    inset: 0
    background-color: rgba(0, 0, 0, 0.8)
    -webkit-app-region: drag
    display: flex
    align-items: center
    justify-content: center
    z-index: 3

    .loading-text
        color: #fff
        font-size: 2rem
        font-weight: bold
        letter-spacing: 0.3rem
</style>
<template>
    <div class="search">
        <FormInput v-model="searchLogin" type="text" id="search" nolabel placeholder="Search logins" nomargins
            size="normal" @keydown.esc="searchLogin = ''" />
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import FormInput from '@/components/FormInput'

const store = useStore()

const searchLogin = ref('')
let searchElement = null

const focusSearch = (event) => {
    const isValidSlash = ((event.target.localName !== "input") && (event.key === "/"))
    if (isValidSlash) {
        event.preventDefault()
        searchElement.focus()
    }
}
watch(searchLogin, (newValue) => store.dispatch('setSearchText', newValue))
onMounted(() => {
    searchElement = document.getElementById("search")
    document.addEventListener('keydown', focusSearch)
})
onUnmounted(() => document.removeEventListener('keydown', focusSearch))
</script>

<style scoped lang="sass">
.search
    width: calc(100vw * var(--search-flex-gain))
    padding: 1rem 1rem
    padding-left: var(--main-start-offset)
    padding-right: var(--main-start-offset)
    border-right: 1px solid var(--main-border-color)
</style>
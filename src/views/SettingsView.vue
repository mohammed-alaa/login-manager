<template>
    <div class="container text-white">
        <section class="settings">
            <div class="settings-header">
                <div class="title">
                    <h1>Settings</h1>
                </div>
                <div class="actions">
                    Back
                </div>
            </div>
            <div class="settings-body">
                <h2 v-for="(_, index) in Array(18)" :key="index">Body</h2>
            </div>
        </section>
    </div>
</template>

<script setup>
</script>

<style scoped lang="sass">
$settings-header: 5.5rem
.settings
    background-color: var(--secondary-background-color)
    overflow: hidden

.settings-header
    display: flex
    flex-direction: row
    align-items: center
    justify-content: space-between
    padding: 0 var(--secondary-start-offset)
    color: var(--color-white)
    border-bottom: 1px solid var(--main-border-color)
    border-right: 1px solid var(--main-border-color)
    border-left: 1px solid var(--main-border-color)
    background-color: var(--secondary-background-color)
    position: sticky
    top: 0
    min-height: $settings-header
.settings-body
    padding: var(--secondary-start-offset)
    overflow: hidden auto
    height: calc(100vh - $settings-header - var(--app-header-min-height))
</style>
<script setup>
</script>

<template>
	<div class="setting-item py-3 px-4">
		<slot />
	</div>
</template>

<style scoped lang="sass">
.setting-item
	background-color: var(--secondary-background-color)
	border-radius: 1rem
	box-shadow: 0 0 .5rem rgb(75 75 75 / 50%)
	border: 1px solid var(--main-border-color)
</style>

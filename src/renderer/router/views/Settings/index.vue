<script setup lang="ts">
import About from "./components/About.vue"
import TitleWithContent from "@layouts/TitleWithContent"
import ChangePassword from "./components/ChangePassword.vue"
import ApplicationSettings from "./components/ApplicationSettings.vue"
</script>

<template>
	<TitleWithContent>
		<template #title> Settings </template>
		<template #content>
			<ApplicationSettings />
			<hr class="border-main" />
			<ChangePassword />
			<hr class="border-main" />
			<About />
		</template>
	</TitleWithContent>
</template>

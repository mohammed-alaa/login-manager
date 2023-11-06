<script setup>
// import { useStore } from "vuex"
import AppIcon from "@components/AppIcon"
import AppTitleButton from "@components/AppTitleButton"

// const store = useStore()
const minApplication = () => store.dispatch("minimizeApplication")
const maxApplication = () => store.dispatch("maximizeApplication")
const closeApplication = () => store.dispatch("exitApplication")
</script>

<template>
	<header class="app-header flex justify-between content-center">
		<div class="title text-white font-bold text-center my-auto">
			<span>Login Manager</span>
		</div>
		<div class="flex gap-1 items-center me-1">
			<AppTitleButton @click="minApplication">
				<!-- <IconMinimize /> -->
				<AppIcon icon="minimize" />
			</AppTitleButton>
			<AppTitleButton @click="maxApplication">
				<!-- <IconSquare /> -->
				<AppIcon icon="square" />
			</AppTitleButton>
			<AppTitleButton theme="outline-danger" @click="closeApplication">
				<!-- <IconX /> -->
				<AppIcon icon="x" />
			</AppTitleButton>
		</div>
	</header>
</template>

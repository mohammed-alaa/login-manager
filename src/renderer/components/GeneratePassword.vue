<template>
	<div class="d-flex flex-row align-items-center gap-2 pt-4">
		<FormInput
			id="generatedPassword"
			v-model="generatedPassword"
			type="text"
			nolabel
			readonly
			nomargins
			@focus="autoSelectGeneratedPassword"
		/>
		<AppButton
			type="button"
			size="normal"
			theme="outline-info"
			class="mx-3"
			@click="generatePassword"
		>
			<AppIcon icon="shuffle" />
			<span class="ms-1">generate password</span>
		</AppButton>
	</div>
</template>

<script setup>
import { ref } from "vue"
import AppButton from "@components/AppButton"
import AppIcon from "@components/AppIcon"
import FormInput from "@components/FormInput"

const generatedPassword = ref("")

const autoSelectGeneratedPassword = (event) => event.target.select()
const generatePassword = () => {
	const allLetters =
		"abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-_=+"
	const allLettersLength = allLetters.length
	generatedPassword.value = ""
	for (let i = 0; i < 16; i++) {
		generatedPassword.value +=
			allLetters[Math.floor(Math.random() * allLettersLength)]
	}
}
</script>

<style scoped lang="sass"></style>

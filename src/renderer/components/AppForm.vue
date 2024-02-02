<script setup>
import { ref } from "vue"

const emits = defineEmits(["submit"])

const isSubmitted = ref(false)

const formSubmit = () => {
	isSubmitted.value = true
	emits("submit")
}
</script>

<template>
	<form :class="{ submitted: isSubmitted }" @submit.prevent="formSubmit">
		<slot />
	</form>
</template>

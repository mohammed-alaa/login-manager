<script setup lang="ts">
import { computed } from "vue"

interface ButtonProps {
	type?: "button" | "submit"
	text?: string
	loading?: boolean
	size?: "sm" | "md" | "lg"
	variant?: "filled" | "outlined"
	color?: "primary" | "danger" | "secondary" | "warning" | string
	active?: boolean
	rounded?: false | "sm" | "md" | "lg" | "circle"
	border?: boolean
	disabled?: boolean
	block?: boolean
}

const props = withDefaults(defineProps<ButtonProps>(), {
	type: "button",
	text: "",
	loading: false,
	size: "md",
	color: "primary",
	variant: "filled",
	active: false,
	rounded: "md",
	disabled: false,
	block: false,
})

const emits = defineEmits(["click"])

const isButtonDisabled = computed(() => props.disabled || props.loading)

const classesComputed = computed(() => {
	const classes = [
		`btn-${props.size} btn-${props.color} btn-${props.variant}`,
	]

	props.active && classes.push("active")
	props.block && classes.push("w-full")
	props.disabled &&
		classes.push("opacity-70 cursor-not-allowed pointer-events-auto")
	classes.push(
		props.size === "sm"
			? "text-sm px-1.5 pt-0.5 pb-1"
			: props.size === "lg"
			? "text-lg px-3 py-1.5"
			: "text-md px-2 py-1"
	)
	classes.push(
		props.rounded === "circle"
			? "rounded-circle"
			: props.rounded === "lg"
			? "rounded-lg"
			: props.rounded === "sm"
			? "rounded-sm"
			: "rounded-md"
	)

	return classes
})

const buttonClicked = (e: MouseEvent) => {
	if (isButtonDisabled.value || props.type === "submit") {
		return
	}

	e.preventDefault()
	emits("click")
}
</script>

<template>
	<button
		class="btn capitalize transition transition-all ease-in-out border-2 font-medium relative overflow-hidden"
		:class="classesComputed"
		:type="type"
		:disabled="isButtonDisabled"
		:aria-disabled="isButtonDisabled"
		:tabindex="isButtonDisabled ? -1 : 0"
		@click="buttonClicked"
	>
		<slot>
			<span class="text-white" v-text="text" />
		</slot>
		<template v-if="loading">
			<div
				class="rounded-lg h-1 bg-current opacity-25 absolute -bottom-[1px] animate-progress"
			/>
		</template>
	</button>
</template>

<script setup lang="ts">
import { computed } from "vue"
import AppIcon from "@components/AppIcon"

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
const roundedComputed = computed(() => ({
	"rounded-sm": props.rounded === "sm",
	"rounded-md": props.rounded === "md",
	"rounded-lg": props.rounded === "lg",
	"rounded-circle": props.rounded === "circle",
}))

const sizeComputed = computed(() => ({
	"text-sm px-2 py-1": props.size === "sm",
	"text-md px-2 py-1": props.size === "md",
	"text-lg px-[0.8rem] py-[0.375rem]": props.size === "lg",
}))

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
		class="btn capitalize transition ease-in-out border-2"
		:class="[
			`btn-${size} btn-${color} btn-${variant}`,
			{
				...sizeComputed,
				...roundedComputed,
				active: active,
				'w-full': block,
				'opacity-70 cursor-not-allowed pointer-events-auto':
					isButtonDisabled,
			},
		]"
		:type="type"
		:disabled="isButtonDisabled"
		:aria-disabled="isButtonDisabled"
		:tabindex="isButtonDisabled ? -1 : 0"
		@click="buttonClicked"
	>
		<slot>
			<span class="text-white" v-text="text" />
		</slot>
		<transition name="fade">
			<template v-if="loading">
				<AppIcon
					start-space
					animated
					icon="refresh"
					class="animate-spin"
				/>
			</template>
		</transition>
	</button>
</template>

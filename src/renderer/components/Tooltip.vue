<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import { Tooltip } from "flowbite"
import type { Placement } from "@popperjs/core"

type TooltipProps = {
	id: string
	placement?: Placement
	trigger?: "click" | "hover"
}

const tooltip = ref<Tooltip | null>(null)
const targetElement = ref<HTMLElement | null>(null)
const triggerElement = ref<HTMLElement | null>(null)

const props = withDefaults(defineProps<TooltipProps>(), {
	placement: "bottom",
	trigger: "hover",
})

onMounted(() => {
	tooltip.value = new Tooltip(
		targetElement.value,
		triggerElement.value,
		{
			placement: props.placement,
			triggerType: props.trigger,
		},
		{
			id: props.id,
			override: true,
		}
	)

	tooltip.value?.init()
	tooltip.value?.hide()
})

onUnmounted(() => {
	tooltip.value?.destroyAndRemoveInstance()
	tooltip.value = null
})
</script>

<template>
	<div>
		<div ref="triggerElement">
			<slot />
		</div>

		<div
			ref="targetElement"
			class="bg-main text-gray text-sm border border-main rounded-md p-2"
		>
			<slot name="content" />
		</div>
	</div>
</template>

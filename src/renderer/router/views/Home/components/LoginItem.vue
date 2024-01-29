<script setup lang="ts">
import { computed } from "vue"
import { getWebsiteName } from "@utils"
import type { LoginItem } from "@types"
import AppIcon from "@components/AppIcon"

defineEmits(["click"])

type LoginItemProps = {
	login: LoginItem | null
	isActive: boolean
}

const props = withDefaults(defineProps<LoginItemProps>(), {
	isActive: false,
})

const getWebsiteAddressName = computed(
	() => getWebsiteName(props.login?.website) || "<no website>"
)
const getUsername = computed(() => props.login?.username || "<no username>")
</script>

<template>
	<div
		class="min-h-login-list-item px-4 py-2 rounded-lg transition ease-in-out border"
		:class="`${
			isActive
				? 'cursor-default active text-white border-focus bg-focus'
				: 'cursor-pointer text-gray border-main bg-main'
		}`"
		@click.prevent="$emit('click')"
		@keydown.enter="$emit('click')"
	>
		<div class="website lowercase truncate">
			<AppIcon
				end-space
				:icon="`${isActive ? 'mail-opened-filled' : 'mail'}`"
			/>
			<span v-text="getWebsiteAddressName" />
		</div>
		<div class="username truncate">
			<AppIcon end-space :icon="`${isActive ? 'user-filled' : 'user'}`" />
			<span v-text="getUsername" />
		</div>
	</div>
</template>

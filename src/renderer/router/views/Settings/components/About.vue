<script setup>
import { computed } from "vue"
import store from "@store"
import AppIcon from "@components/AppIcon"
import AppButton from "@components/AppButton"

const getAppInformation = computed(() => store.getters.getAppInformation)
</script>

<template>
	<div>
		<h3 class="text-white mb-2">About</h3>
		<div class="text-gray flex flex-col gap-1">
			<div>
				<p>
					{{ getAppInformation.appName }} v{{
						getAppInformation.version
					}}
				</p>
				<p>
					{{ getAppInformation.description }}
				</p>
			</div>
			<div class="flex flex-wrap items-center gap-1">
				<span>Found an issue?</span>
				<a
					noreferrer
					target="_blank"
					class="underline"
					:href="getAppInformation.bugs.url"
				>
					Report here
				</a>
				<span>or</span>
				<a
					noreferrer
					target="_blank"
					:href="`mailto:${getAppInformation.bugs.email}`"
				>
					<AppButton size="sm" rounded="circle">
						<AppIcon icon="mail" />
					</AppButton>
				</a>
			</div>
			<div>
				<a
					noreferrer
					target="_blank"
					title="Homepage"
					:href="getAppInformation.homepage"
				>
					<AppIcon end-space size="lg" icon="home" />
				</a>
				<a
					noreferrer
					target="_blank"
					title="Github Repository"
					:href="getAppInformation.repository"
				>
					<AppIcon
						end-space
						size="lg"
						icon="brand-github"
					/>
				</a>
			</div>
		</div>
	</div>
</template>
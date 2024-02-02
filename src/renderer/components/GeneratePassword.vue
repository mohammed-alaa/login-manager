<script setup lang="ts">
import { reactive, computed } from "vue"
import AppIcon from "@components/AppIcon"
import AppButton from "@components/AppButton"
import FormInput from "@components/FormInput"
import FormInputCheckBox from "@components/FormInputCheckBox"

const emits = defineEmits(["update:modelValue"])

const props = defineProps({
	modelValue: {
		type: String,
		default: "",
	},
})

const constants = {
	numbers: "0123456789",
	characters: "!@#$%^&*()-_=+",
	smallLetters: "abcdefghijklmnopqrstuvwxyz",
	capitalLetters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	minLength: 4,
}

const generatedPassword = reactive({
	isExpanded: false,
	error: "",
	options: {
		password: "",
		length: 16,
		choices: ["numbers", "characters", "smallLetters", "capitalLetters"],
		content: [
			{
				title: `Numbers [${constants.numbers}]`,
				value: "numbers",
			},
			{
				title: `Characters [${constants.characters}]`,
				value: "characters",
			},
			{
				title: `Small Letters [${constants.smallLetters}]`,
				value: "smallLetters",
			},
			{
				title: `Captial Letters [${constants.capitalLetters}]`,
				value: "capitalLetters",
			},
		],
	},
})

const canDecreaseLength = computed(
	() => generatedPassword.options.length > constants.minLength
)
const modelValue = computed({
	get: () => props.modelValue,
	set: (value) => emits("update:modelValue", value),
})

const increaseLength = () => generatedPassword.options.length++
const toggleGeneratePassword = () =>
	(generatedPassword.isExpanded = !generatedPassword.isExpanded)
const autoSelectGeneratedPassword = (event) => event.target.select()
const decreaseLength = () => {
	if (!canDecreaseLength.value) return

	generatedPassword.options.length--
}
const generatePassword = () => {
	let allLetters = ""
	generatedPassword.options.password = ""
	generatedPassword.error = ""

	if (!generatedPassword.options.choices.length) {
		generatedPassword.error = "You have to choose at least one option."
		return
	}

	if (generatedPassword.options.length < constants.minLength) {
		generatedPassword.error = `Minimum password length is ${constants.minLength}.`
		return
	}

	generatedPassword.options.choices.forEach((choice) => {
		choice = constants[choice]
		allLetters += choice
		generatedPassword.options.password +=
			choice[Math.floor(Math.random() * choice.length)]
	})

	const allLettersLength = allLetters.length

	for (
		let i = generatedPassword.options.password.length;
		i < generatedPassword.options.length;
		i++
	) {
		generatedPassword.options.password +=
			allLetters[Math.floor(Math.random() * allLettersLength)]
	}

	// Slice & shuffle
	generatedPassword.options.password = generatedPassword.options.password
		.slice(0, generatedPassword.options.length)
		.split("")
		.sort(() => 0.5 - Math.random())
		.join("")

	modelValue.value = generatedPassword.options.password
}
</script>

<template>
	<div class="flex flex-col gap-4">
		<div>
			<AppButton
				color="secondary"
				variant="outlined"
				@click="toggleGeneratePassword"
			>
				<AppIcon
					end-space
					:icon="`${
						generatedPassword.isExpanded
							? 'chevron-down'
							: 'chevron-right'
					}`"
				/>
				<span>Generate password</span>
			</AppButton>
		</div>
		<template v-if="generatedPassword.isExpanded">
			<div class="flex flex-col gap-2">
				<template
					v-for="option in generatedPassword.options.content"
					:key="option.value"
				>
					<FormInputCheckBox
						:id="option.value"
						v-model="generatedPassword.options.choices"
						multiple
						:value="option.value"
						:label="option.title"
					/>
				</template>
			</div>
			<div class="flex items-center gap-2">
				<AppButton
					color="secondary"
					variant="outlined"
					:disabled="!canDecreaseLength"
					@click="decreaseLength"
				>
					<AppIcon icon="minus" />
				</AppButton>
				<FormInput
					v-model.number="generatedPassword.options.length"
					type="number"
					:min="constants.minLength"
				/>
				<AppButton
					variant="outlined"
					color="secondary"
					@click="increaseLength"
				>
					<AppIcon icon="plus" />
				</AppButton>
			</div>
			<div class="flex items-start gap-2">
				<FormInput
					id="generatedPassword"
					v-model="modelValue"
					readonly
					placeholder="Generate Password"
					:error="generatedPassword.error"
					@focus="autoSelectGeneratedPassword"
				/>
				<AppButton color="secondary" @click="generatePassword">
					<AppIcon end-space icon="refresh" />
					<span>Generate</span>
				</AppButton>
			</div>
		</template>
	</div>
</template>

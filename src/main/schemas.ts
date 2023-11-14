import { z } from "zod"

export const updateSettingSchema = z.object({
	name: z.string({
		required_error: "Setting name is required",
	}),
	value: z.any().optional(),
})

export const installFormSchema = z
	.object({
		passPhrase: z
			.string({ required_error: "Passphrase is required." })
			.trim()
			.min(8, "Passphrase must be at least 8 characters."),
		confirmedPassPhrase: z.string({
			required_error: "Confirm the passphrase.",
		}),
	})
	.refine((data) => data.passPhrase === data.confirmedPassPhrase, {
		message: "Passphrases don't match",
		path: ["confirmedPassPhrase"],
	})

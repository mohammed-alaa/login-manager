import { z, type ZodType } from "zod"
import type { Settings, ChangePrimaryPasswordForm } from "@types"

type updateSettingSchemaType = {
	[key in keyof Settings]?: ZodType
}

type changePrimaryPasswordSchemaType = {
	[key in keyof ChangePrimaryPasswordForm]: ZodType
}

export const updateSettingSchema = z.object<updateSettingSchemaType>({
	startOnLogin: z.optional(z.boolean()),
	startMinimized: z.optional(z.boolean()),
})

export const installFormSchema = z
	.object({
		primaryPassword: z
			.string({ required_error: "Primary password is required." })
			.trim()
			.min(8, "Primary password must be at least 8 characters."),
		confirmedPrimaryPassword: z.string({
			required_error: "Confirm the primary password.",
		}),
	})
	.refine((data) => data.primaryPassword === data.confirmedPrimaryPassword, {
		message: "Primary passwords don't match",
		path: ["confirmedPrimaryPassword"],
	})

export const changePrimaryPasswordSchema = z
	.object<changePrimaryPasswordSchemaType>({
		currentPrimaryPassword: z
			.string({ required_error: "Current primary password is required." })
			.trim()
			.min(8, "Primary password must be at least 8 characters."),
		newPrimaryPassword: z
			.string({ required_error: "New primary password is required." })
			.trim()
			.min(8, "Primary password must be at least 8 characters."),
		confirmNewPrimaryPassword: z.string({
			required_error: "Confirm the new primary password.",
		}),
	})
	.refine(
		(data) => data.newPrimaryPassword === data.confirmNewPrimaryPassword,
		{
			message: "New primary passwords don't match",
			path: ["confirmNewPrimaryPassword"],
		}
	)

export const loginFormSchema = z.object({
	primaryPassword: z
		.string({ required_error: "Password is required." })
		.trim()
		.min(8, "Password must be at least 8 characters."),
})

export const importFileSchema = z.object({
	type: z.enum(["json", "csv"], {
		required_error: "Type is required.",
	}),
	delimiter: z.optional(
		z.string({ required_error: "Delimiter is required." })
	),
	isOldJSON: z.optional(z.boolean()),
	oldJSONPassword: z.optional(
		z.string({ required_error: "Password is required." })
	),
	columns: z.object({
		website: z.string({ required_error: "Website column is required." }),
		username: z.string({ required_error: "Username column is required." }),
		password: z.string({ required_error: "Password column is required." }),
	}),
})

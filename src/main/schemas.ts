import { z } from "zod"

export const updateSettingSchema = z.object({
	name: z.string({
		required_error: "Setting name is required",
	}),
	value: z.any().optional(),
})

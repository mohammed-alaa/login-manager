export const getWebsiteName = (fullWebsite = "") => {
	const regex = new RegExp(
		"(?:http(?:s)?\\:\\/\\/(?:www\\.)?)?([\\w\\d\\.\\-\\_]+)",
		"g"
	)
	const matches = regex.exec(fullWebsite)
	return matches?.length > 1 ? matches[1] : ""
}

export const resetFormErrors = <T>(errors: T): T => {
	for (const key in errors) {
		;(errors as any)[key] = ""
	}

	return errors
}

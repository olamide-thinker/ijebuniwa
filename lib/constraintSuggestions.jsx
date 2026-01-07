// File: src/components/inputConstraints.tsx

/**
 * Constraint functions to validate and format input values.
 */

// Ensures text input contains only letters and capitalizes each word.
export function textOnly_Regex(value) {
	const data = value
		.replace(/\b\w/g, (match) => match.toUpperCase())
		.replace(/\d/g, '')
		.replace(/[>=/*"@!#^&+<%(+|)$]/g, '')
	return data
}

// Formats phone numbers by ensuring only digits and a '+' at the start, then applies formatting.
export function phoneNumber_Regex(value) {
	let data = value.replace(/[^\d+]/g, '')
	if (data.length > 0 && data[0] !== '+') {
		data = '+' + data
	}
	const formattedData = data.replace(/(\+\d{1,3})(\d{3})(\d{3})(\d{4})/, '$1 $2 $3 $4')

	return formattedData
}

// Ensures email input contains only valid email characters.
export function email_Regex(value) {
	const data = value.replace(/[^\w@.]/g, '')
	return data
}

// Ensures the input contains only numeric characters and applies basic formatting.
export function number_Regex(value) {
	const data = value.replace(/[^\d.]/g, '')
	return +data
}

// Mapping of input types to suggested constraints.
export const constraintSuggestions = {
	text_only: textOnly_Regex,
	phone: phoneNumber_Regex,
	email: email_Regex,
	number: number_Regex,
	// Add more as needed...
}

import { format } from 'date-fns' // This is optional if you want better date formatting
import { Query } from 'firebase/firestore'

export function formatMoney(value, symbol = '₦') {
	const money = new Intl.NumberFormat('en-US').format(value)
	return symbol + ' ' + money
}

export function formatDate({ timestamp, customFormat = 'dd-MM-yy hh:mm a' }) {
	if (!timestamp) return 'N/A' // Handle missing timestamp
	const date = timestamp.toDate() // Convert Firebase Timestamp to JS Date
	return format(date, customFormat) // Using date-fns to format the date
}

export function currencyInputHandler(e, setInputValue, onChange) {
	// Get raw input value
	let rawValue = e.target.value

	// Remove all non-numeric characters except for the decimal point (optional for currencies with decimals)
	rawValue = rawValue.replace(/[^\d]/g, '')

	// Parse as an integer
	const numericValue = parseInt(rawValue, 10)

	// Format the number as currency (US format, no decimals)
	const formattedValue = numericValue
		? new Intl.NumberFormat('en-US', {
				maximumFractionDigits: 0,
			}).format(numericValue)
		: ''

	// Update input with the formatted value
	setInputValue(formattedValue)

	// Call onChange with the numeric value
	onChange(numericValue || 0)
}

// Helper function to apply filters
export function applyFilters(q, filters) {
	Object.entries(filters).forEach(([key, value]) => {
		if (value !== '' && value !== undefined && value !== null) {
			if (key === 'minPrice') {
				q = query(q, where('price', '>=', Number(value)))
			} else if (key === 'maxPrice') {
				q = query(q, where('price', '<=', Number(value)))
			} else {
				q = query(q, where(key, '==', value))
			}
		}
	})
	return q
}

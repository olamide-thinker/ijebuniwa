'use client'

import { currencyInputHandler } from '@/lib/helpers'
import { Input } from '@nextui-org/react'
import { useState } from 'react'

export default function CurrencyInput({ value, onChange }) {
	const [inputValue, setInputValue] = useState(value)

	console.log('---oooooo ', value, onchange)
	const handleInputChange = (e) => {
		currencyInputHandler(e, setInputValue, onChange)
	}

	return (
		<Input
			id="selling_price"
			// defaultValue={`NGN ${inputValue}`}
			type="text" // Using 'text' because we will be formatting it as currency
			value={`NGN ${inputValue}`} // Display formatted value
			onChange={handleInputChange} // Call the handler when input changes
			placeholder="Enter selling price"
		/>
	)
}

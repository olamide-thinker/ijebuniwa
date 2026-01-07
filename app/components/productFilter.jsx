// components/Filter.tsx
import React from 'react'

export const Filter = ({ onFilterChange }) => {
	const handleCategoryChange = (e) => {
		onFilterChange({ category: e.target.value })
	}

	return (
		<div className="flex gap-4">
			<label htmlFor="category">Category:</label>
			<select id="category" onChange={handleCategoryChange}>
				<option value="">All</option>
				<option value="electronics">Electronics</option>
				<option value="clothing">Clothing</option>
				{/* Add more categories as needed */}
			</select>
		</div>
	)
}

export default Filter

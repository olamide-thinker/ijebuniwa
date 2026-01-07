'use client'

import { useState } from 'react'
import { Chip, Input, Select, Button } from '@nextui-org/react' // Import NextUI components

// Define available dynamic fields
const availableFields = [
	{ label: 'Size', value: 'size' },
	{ label: 'Weight', value: 'weight' },
	{ label: 'Dimensions', value: 'dimensions' },
	{ label: 'Color', value: 'color' },
	{ label: 'Material', value: 'material' },
	{ label: 'Quantity', value: 'quantity' },
	{ label: 'Volume', value: 'volume' },
	{ label: 'Variant Name', value: 'variantName' },
	{ label: 'Style', value: 'style' },
	{ label: 'Custom Attribute 1', value: 'customAttribute1' },
	{ label: 'Custom Attribute 2', value: 'customAttribute2' },
	{ label: 'Stock', value: 'stock' },
	{ label: 'Availability', value: 'availability' },
	{ label: 'Discount', value: 'discount' },
	{ label: 'Shipping Weight', value: 'shippingWeight' },
	{ label: 'Warranty', value: 'warranty' },
	{ label: 'Return Policy', value: 'returnPolicy' },
	{ label: 'Expiration Date', value: 'expirationDate' },
]

export default function Variants() {
	// State to hold selected fields and their values
	const [selectedFields, setSelectedFields] = useState([])
	const [price, setPrice] = (useState < number) | ('' > '')
	const [sku, setSku] = useState < string > ''
	const [identifiers, setIdentifiers] = useState([])

	// Handle adding a field
	const handleAddField = (field) => {
		if (!selectedFields.some((f) => f.fieldName === field)) {
			setSelectedFields([...selectedFields, { fieldName: field, value: '' }])
		}
	}

	// Handle removing a field
	const handleRemoveField = (field) => {
		setSelectedFields(selectedFields.filter((f) => f.fieldName !== field))
	}

	// Handle updating field values
	const handleFieldChange = (fieldName, value) => {
		setSelectedFields(selectedFields.map((f) => (f.fieldName === fieldName ? { ...f, value } : f)))
	}

	// Handle adding identifier
	const handleAddIdentifier = (identifier) => {
		setIdentifiers([...identifiers, identifier])
	}

	return (
		<section className="flex-1 flex flex-col gap-3 bg-white rounded-xl p-4 border">
			<h1 className="font-semibold">Variant Details</h1>

			{/* Price Input */}
			<div className="flex flex-col gap-1">
				<label className="text-gray-500 text-xs">Price</label>
				<Input
					type="number"
					placeholder="Enter Price"
					value={price}
					onChange={(e) => setPrice(e.target.valueAsNumber)}
					className="border px-4 py-2 rounded-lg w-full"
					required
				/>
			</div>

			{/* SKU Input */}
			<div className="flex flex-col gap-1">
				<label className="text-gray-500 text-xs">SKU</label>
				<Input
					type="text"
					placeholder="Enter SKU"
					value={sku}
					onChange={(e) => setSku(e.target.value)}
					className="border px-4 py-2 rounded-lg w-full"
					required
				/>
			</div>

			{/* Identifier Input */}
			<div className="flex flex-col gap-1">
				<label className="text-gray-500 text-xs">Identifiers</label>
				<Input
					type="text"
					placeholder="Enter Identifier"
					onChange={(e) => handleAddIdentifier(e.target.value)}
					className="border px-4 py-2 rounded-lg w-full"
				/>
				{/* Display Identifiers */}
				<div className="flex gap-2 mt-2">
					{identifiers.map((identifier, idx) => (
						<Chip key={idx} onClose={() => handleRemoveField(identifier)}>
							{identifier}
						</Chip>
					))}
				</div>
			</div>

			{/* Dynamic Fields Selector */}
			<div className="flex flex-col gap-1">
				<label className="text-gray-500 text-xs">Select Fields to Add</label>
				<Select placeholder="Select Fields" onChange={(e) => handleAddField(e.target.value)}>
					{availableFields.map((field) => (
						<option value={field.value} key={field.value}>
							{field.label}
						</option>
					))}
				</Select>
			</div>

			{/* Display Selected Fields */}
			<div className="flex gap-2 mt-2">
				{selectedFields.map((field, idx) => (
					<Chip
						key={idx}
						onClose={() => handleRemoveField(field.fieldName)}
						className="bg-blue-200"
					>
						{field.fieldName}
					</Chip>
				))}
			</div>

			{/* Render Inputs for Selected Fields */}
			{selectedFields.map((field, idx) => (
				<div className="flex flex-col gap-1 mt-4" key={idx}>
					<label className="text-gray-500 text-xs">
						{field.fieldName.charAt(0).toUpperCase() + field.fieldName.slice(1)}
					</label>
					<Input
						type="text"
						placeholder={`Enter ${field.fieldName}`}
						value={field.value}
						onChange={(e) => handleFieldChange(field.fieldName, e.target.value)}
						className="border px-4 py-2 rounded-lg w-full"
					/>
				</div>
			))}
		</section>
	)
}

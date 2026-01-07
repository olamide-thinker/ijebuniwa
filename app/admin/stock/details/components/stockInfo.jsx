'use client'

import { useState, useEffect } from 'react'
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Input,
	Checkbox,
	Switch,
} from '@nextui-org/react'
import { currencyInputHandler } from '@/lib/helpers'
import CurrencyInput from '@/app/components/ui/currencyInput'

export default function StockInfoFormModal({ isOpen = true, onClose, onCreate, initialData = {} }) {
	const [measurement, setMeasurement] = useState('')
	const [lowStock, setLowStock] = useState(0)
	const [sku, setSku] = useState('')
	const [sellingPrice, setSellingPrice] = useState('')
	const [onSale, setOnSale] = useState(false)
	const [salePrice, setSalePrice] = useState('')
	const [publishProduct, setPublishProduct] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const measurementOptions = ['kg', 'units', 'bottle', 'crates', 'box', 'pack', 'bags']

	// Load initial data into the state when the modal opens
	useEffect(() => {
		if (initialData) {
			setMeasurement(initialData?.measurement || '')
			setLowStock(initialData?.low_stock || 0)
			setSku(initialData?.product_sku || '')
			setSellingPrice(initialData?.price || '')
			setOnSale(initialData?.onSale || false)
			setSalePrice(initialData?.sale_price || '')
			setPublishProduct(initialData?.isPublished || false)
		}
	}, [initialData])

	const handleSubmit = async () => {
		setIsSubmitting(true)

		const stockDetails = {
			measurement,
			low_stock: +lowStock,
			product_sku: sku,
			price: +sellingPrice,
			sale_price: onSale ? +salePrice : null,
			onSale,
			isPublished: publishProduct,
		}

		try {
			console.log('------>>>>', stockDetails)
			if (onCreate) await onCreate(stockDetails)
			onClose()
		} catch (error) {
			console.error('Submission error:', error)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<Modal isOpen={isOpen} onClose={onClose} scrollBehavior="outside">
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader>
							<h2 className="text-lg font-medium">Stock Preferences</h2>
						</ModalHeader>
						<ModalBody>
							{/* SKU */}
							<div className="mb-4">
								<label className="block mb-1 text-sm font-medium" htmlFor="sku">
									Product SKU:
								</label>
								<Input
									type="text"
									id="sku"
									value={sku}
									onChange={(e) => setSku(e.target.value)}
									placeholder="Enter product SKU"
								/>
							</div>

							{/* Measurement */}
							<div className="mb-4">
								<label className="block mb-1 text-sm font-medium" htmlFor="measurement">
									Measurement Unit:
								</label>
								<Input
									id="measurement"
									list="measurement-options"
									value={measurement}
									onChange={(e) => setMeasurement(e.target.value)}
									placeholder="Enter or select a measurement"
								/>
								<datalist id="measurement-options">
									{measurementOptions.map((option) => (
										<option key={option} value={option} />
									))}
								</datalist>
							</div>

							{/* Low Stock */}
							<div className="mb-4">
								<label className="block mb-1 text-sm font-medium" htmlFor="low_stock">
									Low Stock Count:
								</label>
								<Input
									type="number"
									id="low_stock"
									value={lowStock}
									onChange={(e) => setLowStock(Number(e.target.value))}
									placeholder="Enter low stock count"
								/>
							</div>

							{/* Selling Price */}
							<div className="mb-4">
								<label className="block mb-1 text-sm font-medium" htmlFor="selling_price">
									Selling Price:
								</label>
								<CurrencyInput
									value={sellingPrice}
									// setNumericValue={setSellingPrice}
									onChange={(value) => setSellingPrice(value)} // This is your onChange handler
								/>

								{/* <Input
                  id="selling_price"
                  type="text" // Using 'text' because we will be formatting it as currency
                  value={`NGN ${sellingPrice}`} // Display formatted value
                  onChange={getSellingPriceValue}
                  placeholder="Enter selling price"
                /> */}
							</div>

							{/* On Sale Checkbox */}
							<div className="mb-4">
								<Checkbox isSelected={onSale} onChange={(e) => setOnSale(e.target.checked)}>
									On Sale?
								</Checkbox>
							</div>

							{/* Sale Price */}
							{onSale && (
								<div className="mb-4">
									<label className="block mb-1 text-sm font-medium" htmlFor="sale_price">
										Sale Price:
									</label>
									<Input
										id="sale_price"
										type="number"
										value={salePrice}
										onChange={(e) => setSalePrice(e.target.value)}
										placeholder="Enter sale price"
									/>
								</div>
							)}

							{/* Publish Product Toggle */}
							<div className="mb-4">
								<label className="block mb-1 text-sm font-medium">
									{publishProduct ? 'Publish Product' : 'Hide Product'}
								</label>
								<Switch
									isSelected={publishProduct}
									onChange={(e) => setPublishProduct(e.target.checked)}
									color="primary"
								/>
							</div>
						</ModalBody>
						<ModalFooter>
							<Button color="danger" variant="flat" onPress={onClose}>
								Close
							</Button>
							<Button onPress={handleSubmit} disabled={isSubmitting}>
								{isSubmitting ? 'Saving...' : 'Save'}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}

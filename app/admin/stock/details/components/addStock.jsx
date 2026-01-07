'use client'

import { formatMoney } from '@/lib/helpers'
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Input,
	Textarea,
	Checkbox,
} from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useStockStore } from '@/lib/firestore/stock/stockStore'
import toast from 'react-hot-toast'
// import { useStockStore } from "@/store/stockStore"; // Zustand store

export default function AddStockModal({ id, header, data, isOpen, onClose, initialData = {} }) {
	const updateStockHistory = useStockStore((state) => state.updateStockHistory) // Zustand function
	const [stockIn, setStockIn] = useState(initialData.stockIn || 1)
	const [rawUnitCost, setRawUnitCost] = useState(initialData.unitCost || 0)
	const [unitCost, setUnitCost] = useState(initialData.unitCost || 0)
	// const [measurement, setMeasurement] = useState(initialData.measurement || "");
	const [attachment, setAttachment] = useState(null)
	const [note, setNote] = useState(initialData.note || '')
	const [identifiers, setIdentifiers] = useState([])
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [currentUser, setCurrentUser] = useState(null)
	const [useGenericIdentifier, setUseGenericIdentifier] = useState(true)
	const [genericIdentifier, setGenericIdentifier] = useState('')

	const measurementOptions = ['kg', 'units', 'bottle', 'crates', 'box', 'pack', 'bags']

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setCurrentUser(user || null)
		})
		return () => unsubscribe()
	}, [])

	const handleStockChange = (value) => {
		const stockValue = parseInt(value, 10) || 0
		setStockIn(stockValue)
		setIdentifiers((prev) =>
			Array(Math.abs(stockValue) <= 0? 1: Math.abs(stockValue) )
				.fill('')
				.map((_, index) => prev[index] || ''),
		)
	}

	const handleGenericIdentifierChange = (value) => {
		setGenericIdentifier(value)
		if (useGenericIdentifier) {
			setIdentifiers(Array(stockIn).fill(value))
		}
	}

	const handleIndividualIdentifierChange = (index, value) => {
		setIdentifiers((prev) => {
			const updated = [...prev]
			updated[index] = value
			return updated
		})
	}

	const handleUnitCostChange = (value) => {
		const rawValue = value.replace(/₦ |,/g, '')
		if (!isNaN(Number(rawValue))) {
			setRawUnitCost(rawValue)
			setUnitCost('₦ ' + Number(rawValue).toLocaleString('en-US'))
		}
	}

	const handleSubmit = async () => {
		//validation
		if (!unitCost || unitCost < 0) {
			toast.error('Unit cost is required')
			return
		}
		if (+stockIn === 0) {
			toast.error('stock in must not be zero')
			return
		}

		setIsSubmitting(true)

		console.log("stock details: ", +stockIn<=-1?'negative':'positive')

		const stockDetails = {
			createdBy: currentUser?.displayName || 'Unknown',
			email: currentUser?.email || 'Unknown',
			stockOut: +stockIn<=-1 && +stockIn,
			stockIn: +stockIn>=0 && +stockIn,
			unitCost: +rawUnitCost,
			totalCost: stockIn * rawUnitCost,
			// measurement,
			// masterOverride: true,
			note,
			attachment,
			reason: 'Restock', // PLS always provide a reason for the stock update
			identifiers: identifiers.map((item) => item || 'Not Provided'),
		}

		updateStockHistory(id, stockDetails)
			.then((result) => {
				if (result.success) {
					toast.success('Stock successfully updated')
					console.log('Stock history updated:', result.newHistory)

					setIsSubmitting(false)
					onClose()
				} else {
					toast.error('Stock failed to updated')
					setIsSubmitting(false)
					console.error('Failed to update stock history:', result.error)
				}
			})
			.catch((error) => {
				toast.error('Stock not added successfully')
				console.error('Unexpected error:', error)
			})

		// try {
		//   await addStockHistory(id,stockDetails); // Call Zustand function
		//   toast.success("Stock added successfully");
		// } catch (error) {
		//   console.error("Error adding stock history:", error);
		// } finally {
		//   setIsSubmitting(false);
		// }
	}

	return (
		<Modal isOpen={isOpen} onClose={onClose} scrollBehavior="outside">
			<ModalContent>
				{(onClose) => (
					<div>
						{header ? (
							<ModalHeader className="flex flex-col gap-1">
								<h2 className="text-lg font-medium border-b">{header}</h2>
							</ModalHeader>
						) : (
							<ModalHeader className="flex flex-col gap-1">
								<h2 className="text-lg font-medium">Add New Stock</h2>
							</ModalHeader>
						)}
						<ModalBody>
							{/* Stock In */}
							<div className="mb-4">
								<label className="block mb-1 text-sm font-medium" htmlFor="stock-in">
									{+stockIn<=-1?"Manual Stock Out:":"Stock In:"}
								</label>
								<Input
									type="number"
									id="stock-in"
									value={stockIn}
									onChange={(e) => handleStockChange(e.target.value)}
									placeholder="Enter stock quantity"
								/>
							</div>

							{/* Measurement */}
							{/* <div className="mb-4">
                <label className="block mb-1 text-sm font-medium" htmlFor="measurement">
                  Measurement Unit:
                </label>
                <div className="relative">
                  <Input
                    type="text"
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
              </div> */}

							{/* Unit Cost */}
							<div className="mb-4">
								<label className="block mb-1 text-sm font-medium" htmlFor="unit-cost">
									Unit Cost (NGN):
								</label>
								<Input
									id="unit-cost"
									required
									value={unitCost}
									onChange={(e) => handleUnitCostChange(e.target.value)}
									placeholder="Enter unit cost"
								/>
							</div>

							{/* Identifier Mode */}
							<Checkbox
								defaultSelected
								checked={useGenericIdentifier}
								onChange={(e) => {
									const useGeneric = e.target.checked
									setUseGenericIdentifier(useGeneric)
									if (useGeneric) {
										setIdentifiers((prev) => prev.map(() => genericIdentifier))
									}
								}}
							>
								Use Generic Identifier
							</Checkbox>

							{/* Generic Identifier */}
							{useGenericIdentifier && (
								<div className="mb-4">
									<label htmlFor="generic-identifier">Generic Identifier:</label>
									<Input
										id="generic-identifier"
										type="text"
										value={genericIdentifier}
										onChange={(e) => handleGenericIdentifierChange(e.target.value)}
										placeholder="Enter a generic identifier"
									/>
								</div>
							)}

							{/* Individual Identifiers */}
							{!useGenericIdentifier &&
								Array(Math.abs(stockIn))
									.fill(null)
									.map((_, index) => (
										<div key={index} className="mb-2">
											<Input
												id={`identifier-${index}`}
												type="text"
												value={identifiers[index] || ''}
												onChange={(e) => handleIndividualIdentifierChange(index, e.target.value)}
												placeholder={`Enter identifier for item ${index + 1}`}
											/>
										</div>
									))}

							{/* Attachment */}
							<div className="mb-4">
								<label className="block mb-1 text-sm font-medium" htmlFor="attachment">
									Attachment/Document:
								</label>
								<Input
									type="file"
									id="attachment"
									onChange={(e) => setAttachment(e.target.files[0])}
								/>
							</div>

							{/* Note */}
							<div className="mb-4">
								<label className="block mb-1 text-sm font-medium" htmlFor="note">
									Note:
								</label>
								<Textarea
									id="note"
									value={note}
									onChange={(e) => setNote(e.target.value)}
									placeholder="Enter additional notes"
								/>
							</div>
						</ModalBody>
						<ModalFooter className="flex items-center justify-between">
							<div>
								<label>Total Cost: </label>
								<p className="font-semibold">{formatMoney(stockIn * rawUnitCost)}</p>
							</div>
							<div className="space-x-3">
								<Button color="danger" variant="flat" onPress={onClose}>
									Close
								</Button>

								<Button onPress={handleSubmit} disabled={isSubmitting}>
								{+stockIn<=-1?"Updating Stock...": isSubmitting ? 'Adding stock...' : 'Update Stock'}
								</Button>
							</div>
						</ModalFooter>
					</div>
				)}
			</ModalContent>
		</Modal>
	)
}

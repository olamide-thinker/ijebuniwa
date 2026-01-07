'use client'

import { useState, useEffect } from 'react'
import {
	addCustomerInsight,
	updateCustomerInsight,
	deleteCustomerInsight,
} from '@/lib/firestore/customerInsight/write'
// import { Button, Chip, Input } from "@nextui-org/react";
import { getCustomerInsights } from '@/lib/firestore/customerInsight/read'
import { formatDate } from '@/lib/helpers'
import Editor from '@/app/components/editorJs/editorjs'
import { Trash2, FilePenLine, ChevronDown, Plus } from 'lucide-react'
import { Accordion, AccordionItem } from '@nextui-org/react'
import {
	Button,
	Chip,
	Input,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
} from '@nextui-org/react'
import ModalComp from '@/app/components/ui/modal'

export default function CustomerInsightCard({ uid }) {
	const [insights, setInsights] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	// Fetch customer insights (array of insights)
	useEffect(() => {
		async function fetchData() {
			try {
				const data = await getCustomerInsights(uid)
				setInsights(data || [])
			} catch (err) {
				setError(err.message)
			} finally {
				setIsLoading(false)
			}
		}
		fetchData()
	}, [uid])

	const createCustomerInsight = async (data) => {
		try {
			setIsSubmitting(true)
			await addCustomerInsight(uid, data)
			const newData = await getCustomerInsights(uid)
			setInsights(newData || [])
		} catch (err) {
			console.error('failed: ', err)
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleUpdateInsight = async (data, insightId) => {
		try {
			setIsSubmitting(true)
			// console.log('ooooooooooooo...',uid, insightId, data)
			await updateCustomerInsight(uid, insightId, data)
			const newData = await getCustomerInsights(uid)
			setInsights(newData || [])
		} catch (err) {
			console.error('failed: ', err)
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleDeleteInsight = async (insightId) => {
		try {
			deleteCustomerInsight(uid, insightId)
			const newData = await getCustomerInsights(uid)
			setInsights(newData || [])
		} catch (err) {
			console.error('failed: ', err)
		}
	}

	if (isLoading) return <p>Loading...</p>
	if (error) return <p>Error: {error}</p>

	return (
		<div className="p-3 space-y-4 bg-white rounded-lg">
			<div className="flex justify-between w-full">
				<p>Preferences and Reports</p>

				<InsightForm
					insight={{ title: '', description: '' }}
					onCreate={createCustomerInsight}
					btnName={
						<>
							<Plus size={13} /> Add preference
						</>
					}
					// onUpdate={handleUpdate}
					// onDelete={handleDeleteInsight}
					isSubmitting={isSubmitting}
				/>

				{/* <Button size="sm" onPress={()=>createCustomerInsight(inputData)}>New report</Button> */}
			</div>
			<div className="h-[70vh] overflow-y-scroll">
				{insights.length === 0 ? (
					<p>No insights available.</p>
				) : (
					<Accordion>
						{insights.map((insight) => {
							// console.log('---------->',insights)
							return (
								<AccordionItem
									key={insight.id}
									aria-label={insight?.data?.title}
									subtitle={
										<div className="flex flex-wrap gap-x-4 py-2">
											<p size="sm" className="text-[11px]">
												Created: {formatDate({ timestamp: insight?.timeCreated })}
											</p>
											<p className="text-[11px]">
												Edited: {formatDate({ timestamp: insight?.timeEdited })}
											</p>
											<p className="text-[11px]">Edited by: ""</p>
										</div>
									}
									title={
										<div className="flex w-full justify-between ">
											<h3 className="font-semibold">{insight?.data?.title}</h3>

											<div className="space-x-1 flex">
												<InsightForm
													insight={{
														title: insight?.data?.title,
														description: insight && insight?.data?.description,
													}}
													// onCreate={createCustomerInsight}
													btnName={
														<>
															<FilePenLine size={13} />
														</>
													}
													updatedInsight={insight.id}
													onUpdate={handleUpdateInsight}
													iconOnly={true}
													isSubmitting={isSubmitting}
												/>

												<ModalComp
													triggerStyle={{
														size: 'sm',
														isIconOnly: true,
														color: 'danger',
														variant: 'flat',
													}}
													triggerTitle={<Trash2 size={13} />}
													title={`Are you sure about this?`}
													content={
														<p>
															you are about the delete <strong>"${insight?.data?.title}"</strong>,
															this action deletes this record permanently
														</p>
													}
													onPress={() => handleDeleteInsight(insight.id)}
													actionString={'Yes, Delete!'}
												/>
												{/* <Button onPress={()=>handleDeleteInsight(insight.id)} size="sm" isIconOnly color="danger" variant="flat" ><Trash2 size={13} /></Button> */}
											</div>
										</div>
									}
								>
									<Editor
										className={'border-none bg-secondary/50 shadow-none'}
										data={insight && insight?.data?.description} // Pass the initial description data
										readOnly={true}
									/>
								</AccordionItem>
							)
						})}
					</Accordion>
				)}
			</div>
		</div>
	)
}

// --- InsightForm Component for individual insight ---
function InsightForm({
	insight,
	onUpdate,
	onCreate,
	isSubmitting,
	btnName,
	updatedInsight,
	iconOnly = false,
}) {
	const { isOpen, onOpen, onOpenChange } = useDisclosure()

	const [title, setTitle] = useState(insight.title || '')
	const [description, setDescription] = useState(insight.description || null)

	// Handle form submission for updating the insight
	const handleSubmit = () => {
		const data = { title, description: description }
		onCreate && onCreate(data)
		onUpdate && onUpdate(data, updatedInsight)
	}

	return (
		<>
			<Button size="sm" isIconOnly={iconOnly} color="warning" onPress={onOpen} variant="flat">
				{btnName}
			</Button>

			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								{' '}
								<div className="mb-1">
									<label className="block mb-1 text-sm font-medium" htmlFor={`title-${insight.id}`}>
										Title:
									</label>
									<Input
										type="text"
										id={`title-${insight.id}`}
										defaultValue={insight?.title}
										onChange={(e) => setTitle(e.target.value)}
										// className=" border"
										placeholder="Enter title"
									/>
								</div>
							</ModalHeader>
							<ModalBody>
								<div className="mb-1">
									<label
										className="block mb-1 text-sm font-medium"
										htmlFor={`description-${insight.id}`}
									>
										Description:
									</label>

									<Editor
										data={insight?.description || description} // Pass the initial description
										onChange={(content) => setDescription(content)}
									/>
								</div>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="flat" onPress={onClose}>
									Close
								</Button>

								{onCreate && (
									<Button onPress={handleSubmit} disabled={isSubmitting}>
										{isSubmitting ? 'creating...' : 'Create'}
									</Button>
								)}

								{onUpdate && (
									<Button onPress={handleSubmit} disabled={isSubmitting}>
										{isSubmitting ? 'Updating...' : 'Update'}
									</Button>
								)}
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	)
}

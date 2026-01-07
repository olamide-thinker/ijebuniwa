'use client'

import { useOrder } from '@/lib/firestore/orders/read'
import { Button, CircularProgress } from '@nextui-org/react'
import { useParams } from 'next/navigation'
import ChangeOrderStatus from './components/ChangeStatus'
import { Download, Edit, Save, Trash2Icon } from 'lucide-react'
import ReceiptPage from './components/receiptPage'
import { useEffect, useState } from 'react'
import { updateOrderIdentifier } from '@/lib/firestore/orders/write'
import { formatMoney } from '@/lib/helpers'
import toast from 'react-hot-toast'
import BackBtn from '@/lib/backBtn'

export default function Page() {
	const { orderId } = useParams()
	const { data: order, error, isLoading } = useOrder({ id: orderId })
	// console.log('order :::', order)
	const [open, setOpen] = useState(false)
	// const [totalAmount, setTotalAmount] = useState(0)

	if (isLoading) {
		return (
			<div className="flex justify-center py-48">
				<CircularProgress />
			</div>
		)
	}

	if (error) {
		return <>{error}</>
	}
	const lineItems = order?.checkout?.line_items

	const totalAmount =
		Array.isArray(lineItems) && lineItems.length > 0
			? lineItems.reduce((prev, curr) => {
					return prev + (curr?.unit_price ?? 0) * (curr?.quantity ?? 0)
				}, 0)
			: 0

	// setTotalAmount(total)

	const user = JSON.parse(order?.checkout?.metadata?.address ?? '')
	// console.log('User ::::',user, '---->', order?.checkout?.metadata?.address)
	// console.log('Order :', '---->', order)

	const customerDetails = [
		{ key: 'Full name', value: user?.fullName },
		{ key: 'Mobile', value: user?.mobile },
		{ key: 'Email', value: user?.email },
		{ key: 'Address i', value: user?.userLine1 },
		{ key: 'Address ii', value: user?.userLine2 },
		{ key: 'Pincode', value: user?.pincode },
		{ key: 'City', value: user?.city },
		{ key: 'State', value: user?.state },
		{ key: 'Note', value: user?.note },
	]

	console.log('userr:  ', orderId)

	return (
		<main className="flex flex-col gap-4 p-5">
			{open && (
				<div
					onClick={() => setOpen(false)}
					className="fixed top-0 left-0 z-50 flex justify-center w-screen h-screen overflow-y-auto bg-black/60"
				>
					<ReceiptPage customer={customerDetails} order={order} />
				</div>
			)}

			<div className="flex items-center justify-between">
				<BackBtn pageName={'Orders'} />
				<h1 className="text-2xl font-semibold">Order Details</h1>
				<ChangeOrderStatus order={{ order: order, email: user.email }} />
			</div>
			<div className="flex flex-col gap-2 p-4 bg-white border rounded-lg">
				<div className="flex flex-col gap-2">
					<div className="flex justify-between">
						<div className="flex gap-3">
							<h3 className="py-1 text-sm uppercase rounded-lg ">{order?.id}</h3>
							<h3 className="px-2 py-1 text-xs text-blue-500 uppercase bg-blue-100 rounded-lg">
								{order?.paymentMode}
							</h3>
							<h3 className="px-2 py-1 text-xs text-green-500 uppercase bg-green-100 rounded-lg">
								{order?.status ?? 'pending'}
							</h3>
							<h3 className="font-semibold">: {formatMoney(totalAmount)}</h3>
						</div>
						<Button onPress={() => setOpen(true)} size="md" variant="light" className="h-6 ">
							View Receipt
						</Button>
					</div>

					<h4 className="text-xs text-gray-600">{order?.timestampCreate?.toDate()?.toString()}</h4>
				</div>
				<div className="flex flex-col gap-1">
					{!order?.checkout?.line_items
						? ' Nothing to display '
						: order?.checkout?.line_items?.map((product) => {
								return (
									<div
										key={product?.metadata?.productId}
										className="flex items-center justify-between gap-2 p-2 rounded bg-zinc-50"
									>
										<div className="flex items-center gap-2">
											<img
												className="w-10 h-10 rounded-lg"
												src={product?.image}
												alt="Product Image"
											/>
											<div>
												<h1 className="">{product?.name}</h1>
												<h1 className="text-xs text-gray-500">
													{formatMoney(product?.unit_price)} <span>X</span>{' '}
													<span>{product?.quantity?.toString()}</span>
												</h1>
											</div>
										</div>

										<Identifier product={product} orderID={orderId} />
									</div>
								)
							})}
				</div>
			</div>

			<h1 className="text-xl font-semibold">Customer Details</h1>
			<div className="flex flex-col gap-2 p-4 bg-white border rounded-lg">
				<table>
					<tbody>
						{customerDetails
							.filter((s) => s.value !== undefined)
							.map((d, i) => {
								return (
									<tr key={i}>
										<td className=" w-[80px] text-gray-500 text-xs">{d.key} : </td>
										<td>{d.value}</td>
									</tr>
								)
							})}
					</tbody>
				</table>
			</div>
		</main>
	)
}

function Identifier({ product, orderID }) {
	// product = product?.product

	const [editItemIdentifier, setItemIdentifier] = useState(false)
	const [identifierValue, setIdentifierValue] = useState('')
	const [loading, setLoading] = useState(false) // Loading state

	const updateIdentifier = async (identifier, itemId) => {
		setLoading(true) // Start loading
		try {
			await updateOrderIdentifier({ id: orderID, itemId, identifier })
			toast.success('Identifier updated successfully') // Success message
		} catch (err) {
			toast.error('Failed to update identifier. Please try again.') // Error message
			console.error('Error updating identifier:', err)
		} finally {
			setLoading(false) // End loading
		}
	}

	// console.log('first>>>>>>>>>: ', product)

	return (
		<>
			{!editItemIdentifier ? (
				<div>
					<Button
						variant="flat"
						title="Enter serial numbers, path numbers, etc."
						size="md"
						className="h-6"
						onPress={() => setItemIdentifier(true)}
						disabled={loading}
					>
						{loading ? (
							'Saving...'
						) : (
							<>
								<Edit size={12} /> {product?.identifierData?.identifier || 'Unit identifiers'}
							</>
						)}
					</Button>
				</div>
			) : (
				<div className="flex flex-col gap-1">
					<input
						type="text"
						placeholder="Enter serial numbers, path numbers, etc."
						id="product-identifier"
						name="product-identifier"
						defaultValue={product?.identifierData?.identifier ?? ''}
						onChange={(e) => {
							setIdentifierValue(e.target.value)
						}}
						className="w-full px-4 py-2 text-xs border rounded-lg outline-none"
						required
					/>
					<div className="flex">
						<Button
							size="md"
							className="h-6"
							onPress={() => {
								updateIdentifier(
									identifierValue,
									product?.price_data?.product_data?.metadata?.productId,
								)
								!loading && setItemIdentifier(false)
							}}
							disabled={loading}
						>
							<Save size={12} />
						</Button>
						<Button
							color="danger"
							variant="flat"
							size="md"
							className="h-6"
							onPress={() => {
								setIdentifierValue('')
								setItemIdentifier(false)
							}}
							disabled={loading} // Disable while loading
						>
							<Trash2Icon size={12} />
						</Button>
					</div>
				</div>
			)}
		</>
	)
}

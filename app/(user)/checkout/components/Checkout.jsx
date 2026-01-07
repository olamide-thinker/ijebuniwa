'use client'

import LoginModal from '@/app/(auth)/login/loginModal'
import { useAuth } from '@/contexts/AuthContext'
import { createCheckoutAndGetURL, createCheckoutCODAndGetId } from '@/lib/firestore/checkout/write'
import { formatMoney } from '@/lib/helpers'
import { Button, Checkbox, Input, Textarea } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function Checkout({ productList }) {
	const [isLoading, setIsLoading] = useState(false)
	const [paymentMode, setPaymentMode] = useState('prepaid')
	const [address, setAddress] = useState(null)
	const [totalPrice, setTotalPrice] = useState(0)
	const [subtotal, setSubtotal] = useState(0)
	const [vat, setVat] = useState(0)
	const [isOpen, setIsOpen] = useState(false)
	const [showCheckoutChoice, setShowCheckoutChoice] = useState(false)
	const [isFormComplete, setIsFormComplete] = useState(false)
	const router = useRouter()
	const { user } = useAuth()

	const handleAddress = (key, value) => {
		setAddress({ ...(address ?? {}), [key]: value })
	}

	// Calculate subtotal, VAT (7.5%), and total whenever productList changes
	useEffect(() => {
		const calculatedSubtotal = productList?.reduce((prev, curr) => {
			const price = curr?.product?.onSale ? curr?.product?.salePrice : (curr?.product?.price ?? 0)
			return prev + price * (curr?.quantity ?? 1)
		}, 0)
		
		const calculatedVat = calculatedSubtotal * 0.075 // 7.5% VAT
		const calculatedTotal = calculatedSubtotal + calculatedVat
		
		setSubtotal(calculatedSubtotal)
		setVat(calculatedVat)
		setTotalPrice(calculatedTotal)
	}, [productList])

	// Check if form is complete
	useEffect(() => {
		const formComplete = 
			address?.fullName &&
			address?.mobile &&
			address?.email &&
			address?.fullAddress &&
			address?.city &&
			address?.state
		
		setIsFormComplete(!!formComplete)
	}, [address])

	const handlePlaceOrder = async () => {
		setIsLoading(true)

		try {
			// Validation checks
			if (totalPrice <= 0) throw new Error('Price should be greater than 0')
			if (!address?.email || !address?.fullName || !address?.mobile || !address?.fullAddress) {
				throw new Error('Please Fill All Address Details')
			}
			if (!productList || productList?.length === 0) throw new Error('Product List Is Empty')

			// Process order based on payment mode
			if (paymentMode === 'prepaid') {
				await createCheckoutAndGetURL({
					user,
					uid: user?.uid || null, // Allow null for guests
					products: productList,
					address: address,
					isGuest: !user?.uid, // Flag for guest checkout
				})
			} else {
				const checkoutId = await createCheckoutCODAndGetId({
					user,
					uid: user?.uid,
					products: productList,
					address: address,
				})
				router.push(`/checkout-cod?checkout_id=${checkoutId}`)
				toast.success('Successfully Placed!')
			}
		} catch (error) {
			toast.error(error?.message)
		}
		setIsLoading(false)
	}

	return (
		<section className="flex flex-col gap-5 md:flex-row bg-gray-50 p-6 rounded-xl">
			{/* Shipping Address Section */}
			<section className={`flex flex-col flex-1 gap-5 p-6 border rounded-xl bg-white transition-shadow duration-300 ${
				isFormComplete ? 'shadow-none' : 'shadow-lg shadow-gray-300/50'
			}`}>
				<h1 className="text-2xl font-semibold border-b pb-3">Shipping Address</h1>
				<div className="flex flex-col gap-4">
					<Input
						type="text"
						id="full-name"
						name="full-name"
						placeholder="Full Name *"
						value={address?.fullName ?? ''}
						onChange={(e) => handleAddress('fullName', e.target.value)}
						className="w-full rounded-md focus:outline-none"
					/>
					<Input
						type="tel"
						id="mobile"
						name="mobile"
						placeholder="Mobile Number *"
						value={address?.mobile ?? ''}
						onChange={(e) => handleAddress('mobile', e.target.value)}
						className="w-full rounded-md focus:outline-none"
					/>
					<div className="flex flex-col gap-1">
						<Input
							type="email"
							id="email"
							name="email"
							placeholder="Email *"
							value={address?.email ?? ''}
							onChange={(e) => handleAddress('email', e.target.value)}
							className="w-full rounded-md focus:outline-none"
						/>
						<p className="text-xs text-gray-500 px-2">An account will be created with this email for order tracking</p>
					</div>
					<Textarea
						id="full-address"
						name="full-address"
						label="Full Delivery Address"
						placeholder="* Enter your complete address (Street, Area, Landmark)"
						value={address?.fullAddress ?? ''}
						onChange={(e) => handleAddress('fullAddress', e.target.value)}
						minRows={3}
					/>
					<Input
						type="text"
						id="city"
						name="city"
						placeholder="City *"
						value={address?.city ?? ''}
						onChange={(e) => handleAddress('city', e.target.value)}
						className="w-full rounded-md focus:outline-none"
					/>
					<Input
						type="text"
						id="state"
						name="state"
						placeholder="State *"
						value={address?.state ?? ''}
						onChange={(e) => handleAddress('state', e.target.value)}
						className="w-full rounded-md focus:outline-none"
					/>
					<Textarea
						label="Note"
						id="note"
						name="delivery-notes"
						placeholder="Instruction for delivery"
						value={address?.orderNote ?? ''}
						onChange={(e) => handleAddress('orderNote', e.target.value)}
					/>
				</div>
			</section>

			{/* Product List Section */}
			<div className="flex flex-col flex-1 gap-5">
				<section className={`flex flex-col gap-4 p-6 border rounded-xl bg-white transition-shadow duration-300 ${
					isFormComplete ? 'shadow-lg shadow-gray-200' : 'shadow-none'
				}`}>
					<h1 className="text-2xl font-semibold border-b pb-3">Order Summary</h1>
					<div className="flex flex-col gap-2">
						{productList?.map((item, i) => (
							<div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-secondary">
								<img
									className="object-cover w-20 h-20 rounded-lg"
									src={item?.product?.featureImageURL}
									alt=""
								/>
								<div className="flex flex-col flex-1">
									<h1 className="text-sm text-[16px] py-2">{item?.product?.title}</h1>
									<div className="flex items-center justify-between w-full py-2">
										<h3 className=" font-semibold text-[14px]">
											{formatMoney(
												item?.product?.onSale ? item?.product?.salePrice : item?.product?.price,
											)}{' '}
											<span className="text-black">X</span>{' '}
											<span className="text-gray-600">{item?.quantity}</span>
										</h3>
										<h3 className="text-md">
											{formatMoney(
												item?.product?.onSale
													? item?.product?.salePrice * item?.quantity
													: item?.product?.price * item?.quantity,
											)}
										</h3>
									</div>
								</div>
							</div>
						))}
					</div>
					<div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg">
						<div className="flex justify-between text-sm">
							<span className="text-gray-600">Subtotal</span>
							<span className="font-medium">{formatMoney(subtotal)}</span>
						</div>
						<div className="flex justify-between text-sm">
							<span className="text-gray-600">VAT (7.5%)</span>
							<span className="font-medium">{formatMoney(vat)}</span>
						</div>
						<div className="h-px bg-gray-300 my-1"></div>
						<div className="flex justify-between font-semibold text-base">
							<span>Total</span>
							<span className="text-lg">{formatMoney(totalPrice)}</span>
						</div>
					</div>
				</section>

				{/* Payment Mode Section */}
				<section className="flex flex-col gap-4 p-6 border rounded-xl bg-white shadow-sm">
					<div className="flex flex-col items-center justify-between md:flex-row border-b pb-3">
						<h2 className="text-xl">Payment Mode</h2>
						<div className="flex items-center gap-3">
							<Checkbox
								isSelected={paymentMode === 'prepaid'}
								onValueChange={() => setPaymentMode('prepaid')}
							>
								Prepaid
							</Checkbox>
							{/* <Checkbox
								isSelected={paymentMode === 'cod'}
								onValueChange={() => setPaymentMode('cod')}
							>
								Cash On Delivery
							</Checkbox> */}
						</div>
					</div>
					<div className="flex items-center gap-1">
						<h4 className="text-xs text-gray-600">
							I agree with the <span className="text-blue-700">terms & conditions</span>
						</h4>
					</div>
					<Button
						isLoading={isLoading}
						isDisabled={isLoading}
						onPress={handlePlaceOrder}
						className="font-bold text-white bg-black"
					>
						Place Order
					</Button>
				</section>
			</div>
			<LoginModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
		</section>
	)
}

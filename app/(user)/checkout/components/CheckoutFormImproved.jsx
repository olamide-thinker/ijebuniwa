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

	const handlePlaceOrder = async () => {
		setIsLoading(true)

		try {
			// Validation checks
			if (totalPrice <= 0) throw new Error('Price should be greater than 0')
			if (!address?.email || !address?.fullName || !address?.mobile || !address?.fullAddress || !address?.city || !address?.state) {
				throw new Error('Please fill all required fields marked with *')
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
					uid: user?.uid || null,
					products: productList,
					address: address,
					isGuest: !user?.uid,
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
		<section className="flex flex-col gap-3 md:flex-row">
			{/* Shipping Address Section */}
			<section className="flex flex-col flex-1 gap-5 p-5 border rounded-xl bg-white">
				<h1 className="text-2xl font-semibold">Shipping Information</h1>
				
				{/* Contact Information */}
				<div className="flex flex-col gap-4">
					<h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide border-b pb-2">Contact Details</h2>
					<Input
						type="text"
						id="full-name"
						name="full-name"
						label="Full Name"
						placeholder="* Enter your full name"
						value={address?.fullName ?? ''}
						onChange={(e) => handleAddress('fullName', e.target.value)}
						isRequired
						variant="bordered"
						size="lg"
					/>
					<Input
						type="tel"
						id="mobile"
						name="mobile"
						label="Phone Number"
						placeholder="* Enter your mobile number (e.g., +234 800 000 0000)"
						value={address?.mobile ?? ''}
						onChange={(e) => handleAddress('mobile', e.target.value)}
						isRequired
						variant="bordered"
						size="lg"
					/>
					<div className="flex flex-col gap-1.5">
						<Input
							type="email"
							id="email"
							name="email"
							label="Email Address"
							placeholder="* Enter your email address"
							value={address?.email ?? ''}
							onChange={(e) => handleAddress('email', e.target.value)}
							isRequired
							variant="bordered"
							size="lg"
						/>
						<p className="text-xs text-gray-600 px-1 flex items-start gap-1">
							<span className="text-blue-600">ℹ️</span>
							<span>We'll create an account for you using this email to help you track your order (if you don't have one already)</span>
						</p>
					</div>
				</div>

				{/* Delivery Address */}
				<div className="flex flex-col gap-4">
					<h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide border-b pb-2">Delivery Address</h2>
					<Textarea
						id="full-address"
						name="full-address"
						label="Full Delivery Address"
						placeholder="* Enter your complete address (Street number, Area, Landmarks)"
						description="Include street name, building number, and any landmarks"
						value={address?.fullAddress ?? ''}
						onChange={(e) => handleAddress('fullAddress', e.target.value)}
						minRows={3}
						isRequired
						variant="bordered"
					/>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Input
							type="text"
							id="city"
							name="city"
							label="City"
							placeholder="* e.g., Lagos"
							value={address?.city ?? ''}
							onChange={(e) => handleAddress('city', e.target.value)}
							isRequired
							variant="bordered"
							size="lg"
						/>
						<Input
							type="text"
							id="state"
							name="state"
							label="State"
							placeholder="* e.g., Lagos State"
							value={address?.state ?? ''}
							onChange={(e) => handleAddress('state', e.target.value)}
							isRequired
							variant="bordered"
							size="lg"
						/>
					</div>
				</div>

				{/* Additional Notes */}
				<div className="flex flex-col gap-4">
					<h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide border-b pb-2">Additional Information (Optional)</h2>
					<Textarea
						label="Delivery Instructions"
						id="note"
						name="delivery-notes"
						placeholder="Any special delivery instructions? (e.g., Gate code, leave at door, call on arrival)"
						value={address?.orderNote ?? ''}
						onChange={(e) => handleAddress('orderNote', e.target.value)}
						minRows={2}
						variant="bordered"
					/>
				</div>
			</section>

			{/* Product List Section */}
			<div className="flex flex-col flex-1 gap-3">
				<section className="flex flex-col gap-3 p-4 border rounded-xl bg-white">
					<h1 className="text-xl font-semibold">Order Summary</h1>
					<div className="flex flex-col gap-2">
						{productList?.map((item, i) => (
							<div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
								<img
									className="object-cover w-16 h-16 rounded-lg"
									src={item?.product?.featureImageURL}
									alt=""
								/>
								<div className="flex flex-col flex-1">
									<h1 className="text-sm text-[14px] font-medium line-clamp-2">{item?.product?.title}</h1>
									<div className="flex items-center justify-between w-full pt-1">
										<h3 className=" font-semibold text-[13px]">
											{formatMoney(
												item?.product?.onSale ? item?.product?.salePrice : item?.product?.price,
											)}{' '}
											<span className="text-black">×</span>{' '}
											<span className="text-gray-600">{item?.quantity}</span>
										</h3>
										<h3 className="text-sm font-semibold">
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
					{/* Order Summary Totals */}
					<div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg mt-2">
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
							<span className="text-lg text-[#FDC321]">{formatMoney(totalPrice)}</span>
						</div>
					</div>
				</section>

				{/* Payment Mode Section */}
				<section className="flex flex-col gap-3 p-4 border rounded-xl bg-white">
					<div className="flex flex-col items-center justify-between md:flex-row">
						<h2 className="text-xl font-semibold">Payment Method</h2>
						<div className="flex items-center gap-3">
							<Checkbox
								isSelected={paymentMode === 'prepaid'}
								onValueChange={() => setPaymentMode('prepaid')}
							>
								<span className="text-sm">Pay Now (Card/Bank)</span>
							</Checkbox>
						</div>
					</div>
					<div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 p-2 rounded">
						<span>✓</span>
						<span>I agree to the terms & conditions and privacy policy</span>
					</div>
					<Button
						isLoading={isLoading}
						isDisabled={isLoading}
						onPress={handlePlaceOrder}
						className="font-bold text-white bg-[#FDC321] text-lg py-6"
						size="lg"
					>
						{isLoading ? 'Processing...' : `Place Order · ${formatMoney(totalPrice)}`}
					</Button>
				</section>
			</div>
			<LoginModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
		</section>
	)
}

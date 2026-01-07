'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useProductStore } from '@/lib/firestore/products/read'
import { getProduct } from '@/lib/firestore/products/read_server'
import { useCartStore } from '@/lib/firestore/user/cartStore'
import { useUser } from '@/lib/firestore/user/read'
import { updateCarts } from '@/lib/firestore/user/write'
import { getGuestCart, removeFromGuestCart, updateGuestCartQuantity } from '@/lib/guestCart'
import { formatMoney } from '@/lib/helpers'
import { Button, CircularProgress } from '@nextui-org/react'
import { Download, DownloadIcon, Minus, Plus, Trash2Icon, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Page() {
	const { user } = useAuth()
	const { fetchProduct } = useProductStore()
	const [cartTotal, setCartTotal] = useState()
	const [productPrice, setProductPrice] = useState()
	const { data, isLoading } = useUser({ uid: user?.uid })
	const [isClient, setIsClient] = useState(false)
	const { cart, initializeCart, updateCart } = useCartStore()
	const [guestCart, setGuestCart] = useState([])

	useEffect(() => {
		setIsClient(true)
		// Load guest cart if not logged in
		if (!user?.uid) {
			setGuestCart(getGuestCart())
		}
	}, [user])

	// Calculate cart total
	useEffect(() => {
		const calculateTotal = async () => {
			const items = user?.uid ? data?.carts : guestCart
			if (!items || items.length === 0) {
				setCartTotal(0)
				return
			}

			let total = 0
			for (const item of items) {
				const product = await fetchProduct(item?.id)
				if (product) {
					const price = product.onSale ? product.salePrice : product.price
					total += price * (item?.quantity || 1)
				}
			}
			setCartTotal(total)
		}

		calculateTotal()
	}, [data?.carts, guestCart, user, fetchProduct])

	if (isClient)
		if (isLoading) {
			return (
				<div className="flex justify-center w-full p-10">
					<CircularProgress />
				</div>
			)
		}
	return (
		<main className="flex flex-col items-center justify-center gap-3 p-5">
			<h1 className="text-2xl font-semibold">Your Cart</h1>

			{/* Show empty state if no items in cart (user or guest) */}
			{((user?.uid && (!data?.carts || data?.carts?.length === 0)) || (!user?.uid && guestCart?.length === 0)) ? (
				<div className="flex flex-col items-center justify-center w-full h-full gap-5 py-20">
					<div className="flex justify-center">
						<Image
							height={500}
							width={500}
							className={'h-[200px]'}
							src={'/svgs/Empty-pana.svg'}
							alt="N/A"
						/>
					</div>
					<h1 className="font-semibold text-gray-600">Please Add Products To Cart</h1>
				</div>
			) : (
				<div className="p-2 w-full  md:max-w-[900px] flex flex-col gap-2 ">
				<p className="w-full text-center opacity-60">
					Here is a list of all the product you are interested in buying right now{' '}
				</p>
				{/* <div className="p-5 w-full md:max-w-[900px] gap-4 grid grid-cols-1 md:grid-cols-2"> */}
				{/* Display user cart or guest cart */}
				{(user?.uid ? data?.carts : guestCart)?.map((item, key) => {
					console.log(item)
					return (
						<ProductItem
							item={item}
							key={item?.id}
							// setProductPrice={handleCartTotal}
						/>
					)
				})}
			</div>
			)}
			{/* Cart Summary */}
			{((user?.uid && data?.carts?.length > 0) || (!user?.uid && guestCart?.length > 0)) && (
				<div className="w-full md:max-w-[900px]">
				<div className="w-full md:max-w-[900px] flex flex-col gap-3 p-4  rounded-xl bg-white">
					<h2 className="text-lg font-semibold">Order Summary</h2>
					<div className="flex flex-col gap-2">
						<div className="flex justify-between text-sm">
							<span className="text-gray-600">Subtotal</span>
							<span className="font-medium">{formatMoney(cartTotal || 0)}</span>
						</div>
						<div className="flex justify-between text-sm">
							<span className="text-gray-600">VAT (7.5%)</span>
							<span className="font-medium">{formatMoney((cartTotal || 0) * 0.075)}</span>
						</div>
						<div className="h-px bg-gray-200 my-1"></div>
						<div className="flex justify-between text-base font-semibold">
							<span>Total</span>
							<span className="text-lg">{formatMoney((cartTotal || 0) * 1.075)}</span>
						</div>
					</div>
				</div>
			
			<div>
				<Link href={`/checkout?type=cart`} className='flex-1 w-full border'>
					<Button className="bg-[#FDC321] w-full px-5 py-2 text-lg font-semibold rounded-lg group">
						<span>Proceed to Checkout</span>
					<span className="inline-block opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 ml-2">→</span>
						{/* <span>{formatMoney(cartTotal)}</span> */}
					</Button>
				</Link>
			</div>
			</div>
			)}
		</main>
	)
}

function ProductItem({ item, setProductPrice }) {
	const { user } = useAuth()
	const { data } = useUser({ uid: user?.uid })
	const { fetchProduct } = useProductStore()
	const [product, setProduct] = useState()

	const [isRemoving, setIsRemoving] = useState(false)
	const [isUpdating, setIsUpdating] = useState(false)

	useEffect(() => {
		async function getProduct() {
			const data = await fetchProduct(item?.id)
			setProduct(data)
		}
		getProduct()
	}, [])

	const handleRemove = async () => {
		if (!confirm('Are you sure?')) return
		setIsRemoving(true)
		try {
			// Guest user - remove from localStorage
			if (!user?.uid) {
				removeFromGuestCart(item?.id)
				// Force page reload to refresh cart display
				window.location.reload()
			} else {
				// Logged-in user - remove from Firebase
				const newList = data?.carts?.filter((d) => d?.id != item?.id)
				await updateCarts({ list: newList, uid: user?.uid })
			}
		} catch (error) {
			toast.error(error?.message)
		}
		setIsRemoving(false)
	}

	useEffect(() => {
		if (product?.price && item?.quantity) {
			setProductPrice({ id: item?.id, newTotal: product?.price * item?.quantity })
		}
	}, [setProductPrice])

	const handleUpdate = async (newQuantity) => {
		setIsUpdating(true)
		try {
			// Guest user - update localStorage
			if (!user?.uid) {
				updateGuestCartQuantity(item?.id, parseInt(newQuantity))
				// Force page reload to refresh cart display
				window.location.reload()
			} else {
				// Logged-in user - update Firebase
				const newList = data?.carts?.map((d) => {
					if (d?.id === item?.id) {
						return {
							...d,
							quantity: parseInt(newQuantity),
						}
					} else {
						return d
					}
				})
				await updateCarts({ list: newList, uid: user?.uid })
			}
		} catch (error) {
			toast.error(error?.message)
		}
		setIsUpdating(false)
	}

	return (
		<div className="flex gap-3 bg-[#F5F5F5] items-center  px-1 py-1 pr-1 rounded-lg border relative">
			<div className="min-w-36 max-w-36 h-36  p-1 ">
				{product?.featureImageURL && (
					<Image
						className="object-cover w-full border h-full rounded-lg"
						src={product?.featureImageURL || ''}
						alt="N/A"
						objectFit="cover"
						height={500}
						width={500}
					/>
				)}
			</div>
			<div className="flex flex-col w-full gap-1">
				<h1 className="text-sm  line-clamp-2 max-w-[70%] font-semibold">{product?.title}</h1>
				<h2 className="font-semibold text-md">
					{product?.onSale ? formatMoney(product?.salePrice) : formatMoney(product?.price)}{' '}
				</h2>
				<p className="text-xs text-gray-600 line-through">
					{product?.onSale && formatMoney(product?.price)}
				</p>
				{/* <h1 className="text-sm ">
          {formatMoney(product?.salePrice)}{" "}
          <span className="text-xs text-gray-500 line-through">
          {formatMoney(product?.price)}
          </span>
        </h1> */}
				<div className="flex items-center gap-4 pt-2 text-xs ">
					<Button
						onPress={() => {
							handleUpdate(item?.quantity - 1)
						}}
						isDisabled={isUpdating || item?.quantity <= 1}
						isIconOnly
						size="sm"
						className="w-4 h-6"
					>
						<Minus size={16} />
					</Button>
					<h2 className="text-xl">{item?.quantity}</h2>
					<Button
						onPress={() => {
							handleUpdate(item?.quantity + 1)
						}}
						isDisabled={isUpdating}
						isIconOnly
						size="sm"
						className="w-4 h-6"
					>
						<Plus size={16} />
					</Button>
				</div>
			</div>
			<div className="flex flex-col-reverse gap-3 items-end  right-4 absolute justify-between h-[80%]">
				<p className="pb-4 font-semibold p-2 bg-secondary border rounded-lg">{formatMoney(product?.price * item?.quantity)}</p>
				<Button
					onPress={handleRemove}
					isLoading={isRemoving}
					isDisabled={isRemoving}
					isIconOnly
					// color={'danger'}
					size={'sm'}
				>
					<Trash2Icon size={13} />
				</Button>
			</div>
		</div>
	)
}

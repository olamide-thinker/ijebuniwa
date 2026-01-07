'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useUser } from '@/lib/firestore/user/read'
import { updateCarts } from '@/lib/firestore/user/write'
import { addToGuestCart, removeFromGuestCart, isInGuestCart } from '@/lib/guestCart'
import { Button } from '@nextui-org/react'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { useRouter } from 'next/navigation'

export default function AddToCartButton({ productId, type, isDisabled }) {
	const { user } = useAuth()
	const { data } = useUser({ uid: user?.uid })
	const [isLoading, setIsLoading] = useState(false)
	const [guestCartItem, setGuestCartItem] = useState(null)
	const router = useRouter()

	// Check guest cart on mount and when productId changes
	useEffect(() => {
		if (!user?.uid) {
			const item = isInGuestCart(productId)
			setGuestCartItem(item)
		}
	}, [user, productId])

	// Check if item is in cart (user or guest)
	const isAdded = user?.uid
		? data?.carts?.find((item) => item?.id === productId)
		: guestCartItem

	const handlClick = async () => {
		setIsLoading(true)
		try {
			// Guest user - use localStorage cart
			if (!user?.uid) {
				if (isAdded) {
					removeFromGuestCart(productId)
					toast.success('Removed from cart')
				} else {
					addToGuestCart(productId, 1)
					toast.success('Added to cart!')
				}
				setIsLoading(false)
				return
			}

			// Logged-in user - use Firebase cart
			if (isAdded) {
				const newList = data?.carts?.filter((item) => item?.id != productId)
				await updateCarts({ list: newList, uid: user?.uid })
			} else {
				await updateCarts({
					list: [...(data?.carts ?? []), { id: productId, quantity: 1 }],
					uid: user?.uid,
				})
			}
		} catch (error) {
			toast.error(error?.message)
		}
		setIsLoading(false)
	}

	if (type === 'cute') {
		return (
			<Button
				size="lg"
				isLoading={isLoading}
				isDisabled={isDisabled || isLoading}
				onPress={handlClick}
				variant="bordered"
				className=""
			>
				{!isAdded && 'Add To Cart'}
				{isAdded && 'Click To Remove'}
			</Button>
		)
	}

	if (type === 'large') {
		return (
			<Button
				isLoading={isLoading}
				isDisabled={isDisabled || isLoading}
				onPress={handlClick}
				variant="faded"
				className=""
				color="primary"
				size="sm"
			>
				{!isAdded && <AddShoppingCartIcon className="text-xs" />}
				{isAdded && <ShoppingCartIcon className="text-xs" />}
				{!isAdded && 'Add To Cart'}
				{isAdded && 'Click To Remove'}
			</Button>
		)
	}

	return (
		<Button
			isLoading={isLoading}
			isDisabled={isDisabled || isLoading}
			onPress={handlClick}
			variant="flat"
			isIconOnly
			size="sm"
		>
			{!isAdded && <AddShoppingCartIcon className=" text-3xl" />}
			{isAdded && <ShoppingCartIcon className=" text-3xl" />}
		</Button>
	)
}

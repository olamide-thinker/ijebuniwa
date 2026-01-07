'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useUser } from '@/lib/firestore/user/read'
import { getGuestCart } from '@/lib/guestCart'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function HeaderClientButtons() {
	const { user } = useAuth()
	const { data } = useUser({ uid: user?.uid })
	const [guestCartCount, setGuestCartCount] = useState(0)

	// Track guest cart count
	useEffect(() => {
		if (!user?.uid) {
			const guestCart = getGuestCart()
			setGuestCartCount(guestCart?.length || 0)
		}
	}, [user])

	// Cart count: user cart or guest cart
	const cartCount = user?.uid ? (data?.carts?.length ?? 0) : guestCartCount
	const favCount = data?.favorites?.length ?? 0

	return (
		<div className="flex items-center gap-5">
			<Link
				title="Favourites"
				href={`/favorites`}
				className="text-gray-500 hover:text-[#c05621] dark:text-gray-300 relative transition-transform hover:scale-110"
			>
				<span className="material-symbols-outlined">favorite</span>
				{favCount > 0 && (
					<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#c05621] text-[10px] text-white font-bold shadow-sm">
						{favCount}
					</span>
				)}
			</Link>

			<Link
				title="Cart"
				href={`/cart`}
				className="text-gray-500 hover:text-[#c05621] dark:text-gray-300 relative transition-transform hover:scale-110"
			>
				<span className="material-symbols-outlined">shopping_bag</span>
				{cartCount > 0 && (
					<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#c05621] text-[10px] text-white font-bold shadow-sm">
						{cartCount}
					</span>
				)}
			</Link>
		</div>
	)
}

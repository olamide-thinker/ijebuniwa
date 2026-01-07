'use client'

import LoginModal from '@/app/(auth)/login/loginModal'
import { useAuth } from '@/contexts/AuthContext'
import { useUser } from '@/lib/firestore/user/read'
import { getGuestCart } from '@/lib/guestCart'
import { Button, CircularProgress } from '@nextui-org/react'
import { BadgeAlert, UserRoundX } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Layout({ children }) {
	const searchParams = useSearchParams()
	const type = searchParams.get('type')
	const productId = searchParams.get('productId')

	const { user } = useAuth()
	const { data, error, isLoading } = useUser({ uid: user?.uid })
	const [isOpen, setIsOpen] = useState(false)

	if (isLoading) {
		return (
			<div>
				<CircularProgress />
			</div>
		)
	}

	// if (error) {
	// 	toast.error(error)
	// }

	// Check if cart is empty (user cart OR guest cart)
	if (type === 'cart') {
		const hasUserCart = user?.uid && data?.carts && data?.carts?.length > 0
		const hasGuestCart = !user?.uid && getGuestCart()?.length > 0
		
		if (!hasUserCart && !hasGuestCart) {
			return (
				<div className="flex flex-col items-center justify-center min-h-screen gap-4">
					<h2 className="text-2xl font-semibold">Your Cart Is Empty</h2>
					<p className="text-gray-600">Add some products to continue</p>
				</div>
			)
		}
	}
	if (type === 'buynow' && !productId) {
		return (
			<div>
				<h2>Product Not Found!</h2>
			</div>
		)
	}

	return (
		<div>
			{!user && (
				<div className="flex px-4 ">
					<div className="p-2 bg-black text-white flex-col sm:flex-row text-sm flex gap-4 max-w-[800px] rounded-xl  self-center">
						<BadgeAlert />
						<div>
							<p className="font-semibold ">
								Hello! 👋 You can checkout as a guest or sign in for a better experience.
							</p>
							<Button className="bg-white/20" size="sm" variant="outline" onPress={() => setIsOpen(true)}>
								<p className="text-sm font-medium text-primary rounded-xl">Sign In / Register (Optional)</p>
							</Button>
						</div>

						<p className="text-xs ">
							✓ Guest checkout is quick • Sign in to save cart and track orders
						</p>
					</div>
				</div>
			)}
			{children}
			<LoginModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
		</div>
	)
}

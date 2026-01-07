'use client'
import { create } from 'zustand'

export const useCartStore = create((set) => ({
	cart: [], // Cart items will be stored here
	cartTotal: 0, // Total cart price

	// Add or update a cart item
	updateCart: (priceDifference) =>
		set((state) => {
			const exists = state.cart.find((item) => item.id === priceDifference.id)

			let updatedCart
			if (exists) {
				updatedCart = state.cart.map((item) =>
					item.id === priceDifference.id
						? { ...item, newTotal: priceDifference.newTotal } // Update the object
						: item,
				)
			} else {
				updatedCart = [...state.cart, priceDifference] // Add new object
			}

			const newCartTotal = updatedCart.reduce((acc, item) => acc + item.newTotal, 0)

			return { cart: updatedCart, cartTotal: newCartTotal }
		}),

	// Clear the cart (optional utility)
	clearCart: () =>
		set(() => ({
			cart: [],
			cartTotal: 0,
		})),
}))

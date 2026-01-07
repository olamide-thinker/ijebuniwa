/**
 * Guest Cart Management using localStorage
 * Allows users to add products to cart without authentication
 */

const GUEST_CART_KEY = 'guestCart'
const GUEST_INFO_KEY = 'guestCheckoutInfo'

/**
 * Get guest cart from localStorage
 * @returns {Array} Array of cart items { id, quantity }
 */
export const getGuestCart = () => {
	if (typeof window === 'undefined') return []
	try {
		const cart = localStorage.getItem(GUEST_CART_KEY)
		return cart ? JSON.parse(cart) : []
	} catch (error) {
		console.error('Error reading guest cart:', error)
		return []
	}
}

/**
 * Add item to guest cart
 * @param {string} productId - Product ID
 * @param {number} quantity - Quantity to add (default 1)
 */
export const addToGuestCart = (productId, quantity = 1) => {
	if (typeof window === 'undefined') return

	try {
		const cart = getGuestCart()
		const existingItem = cart.find((item) => item.id === productId)

		if (existingItem) {
			// Update quantity if item exists
			existingItem.quantity += quantity
		} else {
			// Add new item
			cart.push({ id: productId, quantity })
		}

		localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart))
		return cart
	} catch (error) {
		console.error('Error adding to guest cart:', error)
		throw error
	}
}

/**
 * Remove item from guest cart
 * @param {string} productId - Product ID to remove
 */
export const removeFromGuestCart = (productId) => {
	if (typeof window === 'undefined') return

	try {
		const cart = getGuestCart()
		const newCart = cart.filter((item) => item.id !== productId)
		localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newCart))
		return newCart
	} catch (error) {
		console.error('Error removing from guest cart:', error)
		throw error
	}
}

/**
 * Update item quantity in guest cart
 * @param {string} productId - Product ID
 * @param {number} quantity - New quantity
 */
export const updateGuestCartQuantity = (productId, quantity) => {
	if (typeof window === 'undefined') return

	try {
		const cart = getGuestCart()
		const item = cart.find((item) => item.id === productId)

		if (item) {
			item.quantity = quantity
			localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart))
		}
		return cart
	} catch (error) {
		console.error('Error updating guest cart:', error)
		throw error
	}
}

/**
 * Clear guest cart
 */
export const clearGuestCart = () => {
	if (typeof window === 'undefined') return

	try {
		localStorage.removeItem(GUEST_CART_KEY)
	} catch (error) {
		console.error('Error clearing guest cart:', error)
	}
}

/**
 * Get guest checkout info
 * @returns {Object} Guest checkout information
 */
export const getGuestCheckoutInfo = () => {
	if (typeof window === 'undefined') return null

	try {
		const info = localStorage.getItem(GUEST_INFO_KEY)
		return info ? JSON.parse(info) : null
	} catch (error) {
		console.error('Error reading guest info:', error)
		return null
	}
}

/**
 * Save guest checkout info
 * @param {Object} info - Guest info { name, email, phone, address }
 */
export const saveGuestCheckoutInfo = (info) => {
	if (typeof window === 'undefined') return

	try {
		localStorage.setItem(GUEST_INFO_KEY, JSON.stringify(info))
	} catch (error) {
		console.error('Error saving guest info:', error)
		throw error
	}
}

/**
 * Sync guest cart to user account on login
 * @param {string} uid - User ID
 * @param {Function} updateCarts - Function to update user carts in Firebase
 * @param {Array} userCarts - Existing user carts
 */
export const syncGuestCartToUser = async (uid, updateCarts, userCarts = []) => {
	if (typeof window === 'undefined') return

	try {
		const guestCart = getGuestCart()

		if (guestCart.length === 0) return

		// Merge guest cart with user carts
		const mergedCart = [...userCarts]

		guestCart.forEach((guestItem) => {
			const existing = mergedCart.find((item) => item.id === guestItem.id)
			if (existing) {
				// Add quantities together
				existing.quantity += guestItem.quantity
			} else {
				// Add new item
				mergedCart.push(guestItem)
			}
		})

		// Update user cart in Firebase
		await updateCarts({ list: mergedCart, uid })

		// Clear guest cart after sync
		clearGuestCart()

		return mergedCart
	} catch (error) {
		console.error('Error syncing guest cart:', error)
		throw error
	}
}

/**
 * Check if item is in guest cart
 * @param {string} productId - Product ID
 * @returns {Object|null} Cart item or null
 */
export const isInGuestCart = (productId) => {
	const cart = getGuestCart()
	return cart.find((item) => item.id === productId) || null
}

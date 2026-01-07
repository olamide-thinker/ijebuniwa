'use server'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore'
import { sendOrderUpdateEmail } from '@/lib/sendEmail'
import { useOrder } from '@/lib/firestore/orders/read'

export const updateOrderStatus = async ({ id, status, email }) => {
	console.log('Sending email toooooooo:', email)
	if (id && status) {
		// Update order status in Firestore
		await updateDoc(doc(db, `orders/${id}`), {
			status: status,
			timestampStatusUpdate: Timestamp.now(),
		})
	}

	// Log to ensure email is passed
	if (email && id && status) {
		// Send email notification
		await sendOrderUpdateEmail(email, status, id)
	}
}

export const updateOrderIdentifier = async ({ id, itemId, identifier }) => {
	if (id && itemId && identifier) {
		// Get the current order data from Firestore
		const orderRef = doc(db, `orders/${id}`)
		const orderDoc = await getDoc(orderRef)

		if (orderDoc.exists()) {
			const orderData = orderDoc.data()
			const lineItems = orderData.checkout.line_items || []

			// Find the index of the item in the array based on a condition, e.g., matching `itemId`
			const itemIndex = lineItems.findIndex(
				(item) => item?.price_data?.product_data?.metadata?.productId === itemId,
			)

			if (itemIndex > -1) {
				// Retrieve the current object for the item
				const currentItem = lineItems[itemIndex]

				// Merge the existing data with new data
				const updatedItem = {
					...currentItem, // Keep existing data intact
					identifierData: {
						identifier: identifier,
						timestampIdentifierUpdate: Timestamp.now(),
					}, // Add or update the timestamp
				}

				// Update the specific item in the array
				const updatedLineItems = [
					...lineItems.slice(0, itemIndex),
					updatedItem,
					...lineItems.slice(itemIndex + 1),
				]

				// Update the entire `checkout.line_items` array with the modified one
				await updateDoc(orderRef, {
					'checkout.line_items': updatedLineItems,
				})

				console.log('Order identifier updated successfully')
			} else {
				console.error('Item not found in the array')
			}
		} else {
			console.error('Order not found')
		}
	}
}

export const createCheckoutCODAndGetId = async ({ uid, products, address }) => {
	try {
		const checkoutId = `cod_${Date.now()}` // Generate unique ID
		const checkoutSession = {
			id: checkoutId,
			metadata: {
				uid: uid,
				address: address,
			},
			line_items: products.map((product) => ({
				price_data: {
					currency: 'usd',
					product_data: {
						name: product.name,
					},
					unit_amount: product.price,
				},
				quantity: product.quantity || 1,
			})),
			timestampCreate: admin.firestore.Timestamp.now(),
		}

		console.log('Creating checkout session:', checkoutSession)

		// Write to Firestore
		await adminDB.collection('checkout_sessions_cod').doc(checkoutId).set(checkoutSession)
		console.log('Checkout session created successfully with ID:', checkoutId)

		return checkoutId // Return the ID
	} catch (error) {
		console.error('Error creating checkout session:', error)
		throw error // Handle as appropriate
	}
}

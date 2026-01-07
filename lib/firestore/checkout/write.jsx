// 'use server'
import { doc, setDoc, collection, getDoc, Timestamp, addDoc } from 'firebase/firestore'
import axios from 'axios'
import { db } from '@/lib/firebase'
import { closePaymentModal, useFlutterwave } from 'flutterwave-react-v3'
import toast from 'react-hot-toast'
import baseUrl from '@/lib/baseUrl'
import { usePaystackPayment } from 'react-paystack'
import { useStockStore } from '../stock/stockStore'
// import { admin, adminDB } from "@/lib/firebase_admin";

async function updateStocksForProducts(products, user) {
	const { updateStockHistory } = useStockStore.getState() // Access Zustand state

	for (const order of products) {
		const productId = order.id

		// Prepare stock details for the update
		const stockDetails = {
			createdBy: user?.displayName || 'Unknown',
			email: user?.email || 'Unknown',
			stockOut: order?.quantity,
			unitCost: order?.product?.onSale ? order?.product?.salePrice : order?.product?.price * 100,
			totalCost:
				order?.quantity *
				(order?.product?.onSale ? order?.product?.salePrice : order?.product?.price),
			reason: 'COD Sales',
		}

		try {
			// Call the zustand function to update stock history
			await updateStockHistory(productId, stockDetails)
			console.log('Successfully updated stockOut for:', productId)
		} catch (err) {
			console.error('Error posting stockOut for:', productId, err)
		}
	}
}

function generateLineItems(products, baseUrl) {
	let totalAmount = 0 // Initialize total amount

	const line_items = products.map((item) => {
		// Ensure valid product data is handled
		const unitPrice =
			item?.product?.onSale && item?.product?.salePrice
				? item?.product?.salePrice
				: (item?.product?.price ?? 0)

		// Accumulate total amount
		totalAmount += unitPrice * (item?.quantity ?? 1)

		return {
			name: item?.product?.title ?? '',
			description: item?.product?.shortDescription ?? '',
			image: item?.product?.featureImageURL ?? `${baseUrl}/logo.png`,
			unit_price: unitPrice,
			metadata: {
				productId: item?.id,
			},
			quantity: item?.quantity ?? 1,
		}
	})

	// Add VAT (7.5%) to subtotal
	const subtotal = totalAmount
	const vat = subtotal * 0.075
	const totalWithVat = subtotal + vat

	return { line_items, totalAmount: totalWithVat, subtotal, vat }
}

export const createCheckoutAndGetURL = async ({ user, uid, products, address }) => {
	let gateWay = 'paystack'
	// let gateWay = 'flutterwave'

	// Check if address and necessary properties are available
	if (!address?.email || !address?.fullName || !address?.mobile) {
		console.error('Missing address details')
		throw new Error('Address details are incomplete.')
	}

	// Generate a unique checkout ID
	const generateCheckoutId = async (uid) => {
		const now = new Date()
		const year = now.getFullYear()
		const month = String(now.getMonth() + 1).padStart(2, '0')
		const day = String(now.getDate()).padStart(2, '0')
		const hours = String(now.getHours()).padStart(2, '0')
		const minutes = String(now.getMinutes()).padStart(2, '0')
		const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase()
		
		// For guest checkout, use 'GUEST' prefix instead of checking user collection
		if (!uid) {
			const checkoutId = `GUEST-${year}${month}${day}${hours}${minutes}-${randomCode}`
			return checkoutId
		}
		
		const checkoutId = `${year}${month}${day}${hours}${minutes}-${randomCode}`
		const ref = doc(collection(db, `users/${uid}/checkout_sessions`), checkoutId)
		const docSnapshot = await getDoc(ref)
		if (docSnapshot.exists()) {
			return await generateCheckoutId(uid) // Retry if ID exists
		}
		return checkoutId
	}
	const checkoutId = await generateCheckoutId(uid)

	async function createCheckoutSession(ref, params) {
		const { checkoutId, line_items, address, uid, response, baseUrl } = params

		const data = {
			id: checkoutId,
			payment_method_types: ['card'],
			mode: 'payment',
			line_items,
			metadata: {
				checkoutId,
				uid,
				address: JSON.stringify(address),
			},
			success_url: `${baseUrl}/checkout-success?checkout_id=${checkoutId}&uid=${uid}`, // Success URL
			cancel_url: `${baseUrl}/checkout-failed?checkout_id=${checkoutId}&uid=${uid}`, // Cancel URL
			createdAt: Timestamp.now(),
			payment_response: response, // Save payment details
		}

		try {
			await setDoc(ref, data)
			console.log('Checkout session created successfully.')
		} catch (error) {
			console.error('Error creating checkout session:', error)
			throw error
		}
	}

	// Calculate total amount and prepare line items
	// let totalAmount = 0;

	const { line_items, totalAmount } = generateLineItems(products, baseUrl)

	console.log('Creating prepaid Checkout Session:', {
		checkoutId,
		line_items,
		uid,
		address,
	})

	/* ------------------------------- flutterwave ------------------------------------------- */
	if (gateWay === 'flutterwave') {
		const config = {
			tx_ref: checkoutId,
			public_key: 'FLWPUBK_TEST-868be40bfa574a0e87f577c8bbd950f4-X',
			// public_key: process.env.FLUTTERWAVE_PUBLIC_KEY,
			amount: totalAmount,
			currency: 'NGN',
			payment_options: 'card',
			redirect_url: `${baseUrl}/checkout-success?checkout_id=${checkoutId}?${uid}`,
			customer: {
				email: address?.email,
				phone_number: address?.mobile,
				name: address?.fullName,
			},
			customizations: {
				title: 'Checkout Payment',
				description: 'Payment for items in your cart',
				logo: `${baseUrl}/logo.png`,
			},
		}

		// Initialize the flutterwave payment
		const initializeFlutterwave = useFlutterwave(config)

		initializeFlutterwave({
			callback: (response) => {
				console.log(response)
				closePaymentModal() // this will close the modal programmatically
			},
			onClose: () => {},
		})

		console.log('------>')
		// const fwConfig = {
		// 	...config,
		// 	text: 'Pay with Flutterwave!',
		// 	callback: (response) => {
		// 		console.log(response)
		// 		closePaymentModal() // this will close the modal programmatically
		// 	},
		// 	onClose: () => {},
		// }

		// try {
		// 	const response = await fetch('/api/flutterwave-proxy', {
		// 		method: 'POST',
		// 		headers: {
		// 			'Content-Type': 'application/json',
		// 		},
		// 		body: JSON.stringify({ payload: initializeFlutterwave}),
		// 	})

		// 	if (!response.ok) {
		// 		const error = await response.json()
		// 		throw new Error(error.message || 'Failed to initialize payment.')
		// 	}

		// 	const data = await response.json()

		// 	if (data.status === 'success') {
		// 		const paymentUrl = data.data.link

		// 		// Save session and navigate to payment URL
		// 		const ref = doc(db, `users/${uid}/checkout_sessions/${checkoutId}`)
		// 		await setDoc(ref, {
		// 			id: checkoutId,
		// 			payment_method_types: ['card'],
		// 			mode: 'payment',
		// 			line_items,
		// 			metadata: {
		// 				checkoutId,
		// 				uid,
		// 				address: JSON.stringify(address),
		// 			},
		// 			success_url: config.redirect_url,
		// 			cancel_url: `${baseUrl}/checkout-failed?checkout_id=${checkoutId}`,
		// 			createdAt: Timestamp.now(),
		// 			payment_url: paymentUrl,
		// 		})

		// 		return paymentUrl
		// 		// window.location.href = paymentUrl;
		// 	} else {
		// 		toast.error('Payment initialization failed.')
		// 	}
		// } catch (error) {
		// 	console.error('Error during payment initialization:', error)
		// 	toast.error('Failed to initialize payment. Please try again.')
		// }
	}

	/* ------------------------------- paystack ------------------------------------------- */
	if (gateWay === 'paystack') {
		const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY

		if (!publicKey) {
			console.error('Paystack Public Key is missing!')
		}

		// Prepare Paystack payload
		const paystackConfig = {
			publicKey: publicKey, // Fallback to hardcoded key if missing
			email: address?.email,
			amount: totalAmount * 100, // Convert to kobo
			currency: 'NGN',
			callback_url: `${baseUrl}/checkout-success?checkout_id=${checkoutId}&uid=${uid}`, // Corrected URL format
			reference: checkoutId, // Unique reference
			metadata: {
				custom_fields: [
					{
						display_name: 'Customer Name',
						variable_name: 'customer_name',
						value: address?.fullName,
					},
					{
						display_name: 'Mobile Number',
						variable_name: 'mobile_number',
						value: address?.mobile,
					},
				],
			},
		}

		console.log('Paystack Config:', paystackConfig)

		// Initialize the Paystack payment
		const initializePaystack = usePaystackPayment(paystackConfig)

		// Trigger Paystack payment on action
		initializePaystack({
			onSuccess: async (response) => {
				console.log('Paystack payment successful!', response)

				// Save session in Firestore
				const ref = doc(db, `users/${uid}/checkout_sessions/${checkoutId}`)

				const params = { checkoutId, line_items, address, uid, response, baseUrl }

				createCheckoutSession(ref, params)

				// await setDoc(ref, {
				//   id: checkoutId,
				//   payment_method_types: ["card"],
				//   mode: "payment",
				//   line_items,
				//   metadata: {
				//     checkoutId,
				//     uid,
				//     address: JSON.stringify(address),
				//   },
				//   success_url: `${baseUrl}/checkout-success?checkout_id=${checkoutId}&uid=${uid}`, // Corrected URL format
				//   cancel_url: `${baseUrl}/checkout-failed?checkout_id=${checkoutId}&uid=${uid}`, // Corrected URL format
				//   createdAt: Timestamp.now(),
				//   payment_response: response, // Save payment details
				// });

				const addPayment = async (id, paymentData) => {
					try {
						const docRef = doc(collection(db, 'payments'), id)
						await setDoc(docRef, paymentData)

						console.log('Document written with ID: ', id)
						return id
					} catch (error) {
						console.error('Error adding document: ', error)
						throw error
					}
				}

				// Example usage:
				const handlePayment = async () => {
					const id = checkoutId

					const paymentData = {
						id: checkoutId,
						status: response.status,
						message: response.message,
						amount: totalAmount,
						currency: 'NGN',
						reference: response.reference,
						customer: address?.email,
						metadata: {
							checkoutId,
							uid,
							address: JSON.stringify(address),
						},
						createdAt: Timestamp.now(),
					}

					try {
						const paymentId = await addPayment(id, paymentData)
						console.log('Payment added with ID: ', paymentId)
					} catch (error) {
						console.error('Failed to add payment: ', error)
					}
				}

				handlePayment()

				// Update stock for each product
				updateStocksForProducts(products, user)

				toast.success('Payment successful!')

				console.log(
					'Redirecting to success page with URL:',
					`${baseUrl}/checkout-success?checkout_id=${checkoutId}&uid=${uid}`,
				)

				// Redirect user after payment success
				window.location.href = `${baseUrl}/checkout-success?checkout_id=${checkoutId}&uid=${uid}`
				// return `${baseUrl}/checkout-success?checkout_id=${checkoutId}&uid=${uid}`;
			},
			onClose: () => {
				toast.error('Payment process canceled.')
			},
		})
	}
}

export const createCheckoutCODAndGetId = async ({ user, uid, products, address }) => {
	try {
		const checkoutId = doc(collection(db, `ids`)).id // Generate unique ID
		const ref = doc(db, `users/${uid}/checkout_sessions_cod/${checkoutId}`)

		// let line_items = [];

		// // Build line items for checkout
		// products.forEach((item) => {
		//   line_items.push({
		//     price_data: {
		//       currency: "ngn",
		//       product_data: {
		//         name: item?.product?.title ?? "",
		//         description: item?.product?.shortDescription ?? "",
		//         images: [
		//           item?.product?.featureImageURL ??
		//             `${baseUrl}/logo.png`,
		//         ],
		//         metadata: {
		//           productId:item?.id,
		//         },
		//       },
		//       unit_amount: item?.product?.salePrice !== 0
		//           ? item?.product?.salePrice
		//           : item?.product?.price * 100,
		//     },
		//     quantity: item?.quantity ?? 1,
		//   });
		// });

		const { line_items, totalAmount } = generateLineItems(products, baseUrl)

		// Update stock for each product
		updateStocksForProducts(products, user)

		// // Update stock for each product
		// const { updateStockHistory } = useStockStore.getState(); // Access zustand state

		// for (const order of products) {
		//   const productId = order.id;
		//   const stockDetails = {
		//     createdBy: user?.displayName || "Unknown",
		//     email: user?.email || "Unknown",
		//     stockOut: order?.quantity,
		//     unitCost:
		//       order?.product?.salePrice !== 0
		//         ? order?.product?.salePrice
		//         : order?.product?.price * 100,
		//     totalCost:
		//       order?.quantity * order?.product?.salePrice !== 0
		//         ? order?.product?.salePrice
		//         : order?.product?.price,
		//     reason: "COD Sales",
		//   };

		//   try {
		//     await updateStockHistory(productId, stockDetails); // Call the zustand function
		//     console.log("Successfully updated stockOut for:", productId);
		//   } catch (err) {
		//     console.error("Error posting stockOut for:", productId, err);
		//   }
		// }

		// Save checkout session
		await setDoc(ref, {
			id: checkoutId,
			line_items: line_items,
			metadata: {
				checkoutId: checkoutId,
				uid: uid,
				address: JSON.stringify(address),
			},
			createdAt: Timestamp.now(),
		})

		return checkoutId // Return checkout ID
	} catch (error) {
		console.error('Error creating COD checkout session:', error)
		throw error // Re-throw error to handle it higher up
	}
}

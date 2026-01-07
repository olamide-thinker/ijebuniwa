// 'use client'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'
import { admin, adminDB } from '@/lib/firebase_admin'
import Link from 'next/link'
import { Button } from '@nextui-org/react'

const fetchCheckout = async (checkoutId) => {
	// console.log("Fetching checkout for ID:", checkoutId);

	try {
		// Query using collectionGroup for subcollections, targeting metadata.checkoutId
		const list = await adminDB
			.collectionGroup('checkout_sessions_cod')
			.where('id', '==', checkoutId.trim()) // Target correct field
			.get()

		console.log('Query result:', list)
		if (list.empty) {
			// console.error("No document found for the given checkout ID");
			throw new Error('No document found')
		}

		// console.log("Document found:", list.docs[0].data());
		return list.docs[0].data()
	} catch (error) {
		// console.error("Error fetching checkout session by collectionGroup:", error);
		throw error
	}
}

const processOrder = async ({ checkout }) => {
	const order = await adminDB.doc(`orders/${checkout?.id}`).get()
	if (order.exists) {
		return false
	}

	const uid = checkout?.metadata?.uid
	await adminDB.doc(`orders/${checkout?.id}`).set({
		checkout: checkout,
		payment: {
			amount: checkout?.line_items?.reduce((prev, curr) => {
				// Handle undefined curr or missing fields
				return prev + (curr?.price_data?.unit_amount ?? 0) * (curr?.quantity ?? 1)
			}, 0),
		},
		uid: uid,
		id: checkout?.id,
		paymentMode: 'cod',
		timestampCreate: admin.firestore.Timestamp.now(),
	})
	console.log('first::::::   ', checkout?.line_items)

	const productList = checkout?.line_items?.map((item) => ({
		productId: item?.price_data?.product_data?.metadata?.productId,
		quantity: item?.quantity ?? 1, // Ensure quantity fallback
	}))

	const user = await adminDB.doc(`users/${uid}`).get()
	const productIdsList = productList?.map((item) => item?.productId)

	// Update cart by removing the purchased products
	const newCartList = (user?.data()?.carts ?? []).filter(
		(cartItem) => !productIdsList.includes(cartItem?.id),
	)

	await adminDB.doc(`users/${uid}`).set({ carts: newCartList }, { merge: true })

	const batch = adminDB.batch()

	productList?.forEach((item) => {
		// Ensure product exists before updating orders field
		const productRef = adminDB.doc(`products/${item?.productId}`)
		batch.update(productRef, {
			orders: admin.firestore.FieldValue.increment(item?.quantity),
		})
	})

	await batch.commit()
	return true
}

export default async function Page({ searchParams }) {
	const { checkout_id } = searchParams
	// console.log('Checkout ID from URL:', checkout_id); // Log the checkout ID

	// Validate checkout_id
	if (!checkout_id) {
		console.error('Checkout ID is missing!')
		return (
			<main>
				<Header />
				<section className="flex flex-col items-center justify-center min-h-screen gap-3">
					<h1 className="text-2xl font-semibold text-red-600">
						Invalid Checkout ID. Please try again.
					</h1>
				</section>
				<Footer />
			</main>
		)
	}

	try {
		const checkout = await fetchCheckout(checkout_id)
		console.log('Checkout object fetched:', checkout) // Log the checkout object

		const result = await processOrder({ checkout })
		console.log('Order processed successfully:', result) // Log result of processOrder

		return (
			<main>
				<Header />
				<section className="flex flex-col items-center justify-center min-h-screen gap-8">
					<div className="flex justify-center w-full">
						{/* <img src="/svgs/Mobile payments-rafiki.svg" className="h-48" alt="" /> */}
						{/* <DotLottieReact
      src="https://lottie.host/fbf0f148-9c5c-42f9-834f-851e5f702023/0DgahIU9rn.lottie"
      loop
      autoplay
    /> */}
					</div>
					<h1 className="text-2xl font-semibold text-green">Your Order Is Successfully Placed</h1>
					<div className="flex items-center gap-4 text-sm">
						<Link href={'/account'}>
							{/* <button className="px-5 py-2 font-bold bg-white border rounded-lg">
                Go To Orders Page
              </button> */}
							<Button className="flex-1 bg-[#FDC321] px-4 py-2 rounded-lg text-sm font-bold w-full">
								Go To Orders Page
							</Button>
						</Link>
					</div>
				</section>
				<Footer />
			</main>
		)
	} catch (error) {
		console.error('Checkout processing error:', error)
		return (
			<main>
				<Header />
				<section className="flex flex-col items-center justify-center min-h-screen gap-3">
					<h1 className="text-2xl font-semibold text-red-600">
						Error processing your order. Please try again.
					</h1>
				</section>
				<Footer />
			</main>
		)
	}
}

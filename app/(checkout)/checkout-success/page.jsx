import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'
import { admin, adminDB } from '@/lib/firebase_admin'
import Link from 'next/link'
import SuccessMessage from './components/SuccessMessage'
import { Button } from '@nextui-org/react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
// import { useSearchParams } from "next/navigation";

// const fetchCheckout = async (uid, checkoutId) => {

//   try {
//     const ref = adminDB
//       .collection(`users/${uid}/checkout_sessions`)
//       .where("id", "==", checkoutId);

//     const list = await ref.get();
//     if (list.empty) {
//       throw new Error("Invalid Checkout ID");
//     }
//     return list.docs[0].data();
//   } catch (error) {
//     console.error("Error fetching checkout:", error);
//     throw error;  // Rethrow the error to be handled elsewhere
//   }
// };

// const fetchPayment = async (checkoutId) => {
//   if (!checkoutId) throw new Error('Checkout ID is required');

//   try {
//     // Query the Firestore payments collection
//     const paymentsRef = collection(db, 'payments');
//     const paymentsQuery = query(
//       paymentsRef,
//       where('id', '==', checkoutId),
//       where('status', '==', 'success')
//     );

//     const querySnapshot = await getDocs(paymentsQuery);

//     if (querySnapshot.empty) {
//       throw new Error(`No successful payments found for Checkout ID "${checkoutId}"`);
//     }

//     // Assuming the first document is the required one
//     const paymentData = querySnapshot.docs[0].data();

//     if (!paymentData) {
//       throw new Error(`No data returned for Payment linked to Checkout ID "${checkoutId}"`);
//     }

//     console.log('Fetched Payment Data:', paymentData); // Debugging
//     return paymentData;
//   } catch (error) {
//     console.error('Error fetching payments:', error);
//     throw error; // Rethrow the error to be handled elsewhere
//   }
// };

const fetchCheckout = async (uid, checkoutId) => {
	try {
		const ref = adminDB.collection(`users/${uid}/checkout_sessions`).where('id', '==', checkoutId)

		const list = await ref.get()
		if (list.empty) {
			throw new Error('Invalid Checkout ID')
		}
		return list.docs[0].data()
	} catch (error) {
		console.error('Error fetching checkout:', error)
		throw error
	}
}

const fetchPayment = async (checkoutId) => {
	if (!checkoutId) throw new Error('Checkout ID is required')

	try {
		const paymentsRef = adminDB.collection('payments')
		const paymentsQuery = paymentsRef.where('id', '==', checkoutId).where('status', '==', 'success')

		const querySnapshot = await paymentsQuery.get()

		if (querySnapshot.empty) {
			throw new Error(`No successful payments found for Checkout ID "${checkoutId}"`)
		}

		return querySnapshot.docs[0].data()
	} catch (error) {
		console.error('Error fetching payments:', error)
		throw error
	}
}

const processOrder = async ({ payment, checkout }) => {
	const orderRef = adminDB.doc(`orders/${payment?.id}`)
	const existingOrder = await orderRef.get()

	if (existingOrder.exists) {
		console.log(`Order with ID "${payment?.id}" already exists`)
		return false
	}

	const uid = payment?.metadata?.uid

	await orderRef.set({
		checkout,
		payment,
		uid,
		id: payment?.id,
		paymentMode: 'prepaid',
		timestampCreate: admin.firestore.Timestamp.now(), // Use admin.firestore.Timestamp
	})

	const productList = checkout?.line_items?.map((item) => ({
		productId: item.metadata?.productId,
		// productId: item?.price_data?.product_data?.metadata?.productId,
		quantity: item?.quantity,
	}))

	const userRef = adminDB.doc(`users/${uid}`)
	const userDoc = await userRef.get()

	const productIdsList = productList?.map((item) => item?.productId)

	const newCartList = (userDoc?.data()?.carts ?? []).filter(
		(cartItem) => !productIdsList.includes(cartItem?.id),
	)

	await userRef.set({ carts: newCartList }, { merge: true })

	const batch = adminDB.batch()

	productList?.forEach((item) => {
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
	const { uid } = searchParams
	const ids = checkout_id.split('?')

	console.log('---+++++>>>')

	const checkout = await fetchCheckout(uid, checkout_id)
	const payment = await fetchPayment(checkout_id)

	const result = await processOrder({ checkout, payment })
	console.log(result)
	return (
		<main>
			<Header />
			<SuccessMessage />
			<section className="flex flex-col items-center justify-center min-h-screen gap-3">
				{/* <div className="flex justify-center w-full">
          <img src="/svgs/Mobile payments-rafiki.svg" className="h-48" alt="" />
        </div> */}
				<h1 className="text-2xl font-semibold text-green">Your Order Is Successfully Placed</h1>
				<div className="flex items-center gap-4 text-sm">
					<Link href={'/account'}>
						<Button className="flex-1 bg-[#FDC321] px-4 py-2 rounded-lg text-sm font-bold w-full">
							Go To Orders Page
						</Button>
					</Link>
				</div>
			</section>
			<Footer />
		</main>
	)
}

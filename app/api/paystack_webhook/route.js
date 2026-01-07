// import { createHmac } from "crypto";
// import { adminDB } from "@/lib/firebase_admin"; // Adjust path to Firebase admin setup
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const secret = 'sk_test_0e8a8b5f81abe8f901c8f5fbfd2040b07890566f'; // Your Paystack secret key
//     // const secret = process.env.PAYSTACK_SECRET_KEY; // Your Paystack secret key
//     const signature = req.headers.get("x-paystack-signature"); // Paystack sends this header
//     const payload = await req.text(); // Read raw body for signature verification

//     // Verify the signature
//     const hash = createHmac("sha512", secret).update(payload).digest("hex");
//     if (hash !== signature) {
//       console.error("Webhook signature mismatch");
//       return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
//     }

//     // Parse the JSON payload
//     const event = JSON.parse(payload);

//     // Handle the event
//     if (event.event === "charge.success") {
//       const {
//         data: {
//           reference,
//           status,
//           amount,
//           customer: { email },
//           metadata,
//         },
//       } = event;

//       // Save transaction details to Firestore
//       await adminDB.collection("payments").doc(reference).set({
//         reference, // Transaction reference
//         status, // Payment status (should be "success")
//         amount, // Amount paid (in kobo)
//         email, // Customer email
//         metadata, // Any metadata sent with the payment
//         createdAt: admin.firestore.Timestamp.now(), // Firestore timestamp
//       });

//       console.log("Payment saved successfully:", reference);
//       return NextResponse.json({ status: "success" });
//     }

//     // If no relevant event, return 400
//     return NextResponse.json({ message: "Unhandled event type" }, { status: 400 });
//   } catch (error) {
//     console.error("Error handling Paystack webhook:", error.message);
//     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//   }
// }

import axios from 'axios'
import { NextResponse } from 'next/server'

export async function POST(req) {
	try {
		const { reference } = await req.json() // Parse reference from the request body
		const paystackSecret = process.env.PAYSTACK_SECRET_KEY
		console.log('the hook works ')
		// Verify transaction with Paystack API
		const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
			headers: {
				Authorization: `Bearer sk_test_0e8a8b5f81abe8f901c8f5fbfd2040b07890566f`,
				// Authorization: `Bearer ${paystackSecret}`,
			},
		})

		const data = response.data

		if (data.status && data.data.status === 'success') {
			await adminDB.collection('payments').doc(data.data.reference).set({
				status: data.data.status,
				amount: data.data.amount,
				reference: data.data.reference,
				customer: data.data.customer.email,
				metadata: data.data.metadata,
				createdAt: admin.firestore.Timestamp.now(),
			})

			return NextResponse.json({ message: 'Transaction verified', data: data.data })
		} else {
			return NextResponse.json({ message: 'Transaction failed', data: data.data }, { status: 400 })
		}
	} catch (error) {
		console.error('Error verifying Paystack transaction:', error.message)
		return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
	}
}

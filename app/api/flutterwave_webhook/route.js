// import { admin, adminDB } from "@/lib/firebase_admin";
// import { createHmac } from 'crypto';

// // Secret key provided by Flutterwave (you should securely store this in your environment variables)
// const SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;

// // Function to verify the webhook signature
// const verifyWebhook = (req) => {
//   const signature = req.headers['x-flutterwave-signature']; // Header sent by Flutterwave
//   const payload = JSON.stringify(req.body);                  // The raw JSON body of the webhook request

//   // Generate the expected signature using HMAC with the secret key
//   const hash = createHmac('sha256', SECRET_KEY)  // Use SHA256 for hashing
//     .update(payload)                            // Update with the payload data
//     .digest('hex');                             // Generate the hash as hexadecimal string

//   // Compare the computed hash with the signature sent by Flutterwave
//   if (signature !== hash) {
//     throw new Error('Invalid webhook signature');
//   }

//   // If signatures match, the request is valid
//   return true;
// };

// export default async function handler(req, res) {
//   // Only handle POST requests
//   if (req.method === "POST") {
//     try {

//       console.log('webhook fired..............')

//       // Verify the webhook signature
//       verifyWebhook(req);

//       // Parse the incoming request body
//       const paymentResponse = req.body; // Use the body as the paymentResponse

//       // Ensure the necessary fields are present in the response
//       const { transaction_id, tx_ref, status, amount, metadata } = paymentResponse;

//       if (!transaction_id || !tx_ref || !status) {
//         return res.status(400).json({ message: "Invalid payment data" });
//       }

//       // Save payment details to Firestore in 'payments' collection
//       await adminDB.collection("payments").doc(transaction_id).set({
//         checkoutId: tx_ref, // Use tx_ref to link to checkout session
//         status, // Payment status (successful, failed, etc.)
//         amount,
//         transaction_id, // Unique transaction ID from Flutterwave
//         payment_method: paymentResponse.payment_method || "card", // Get the payment method used
//         metadata, // Any additional metadata you may need
//         createdAt: admin.firestore.Timestamp.now(), // Timestamp when the payment was made
//       });

//       // Respond back to Flutterwave to acknowledge receipt of the webhook
//       res.status(200).json({ status: "success" });

//     } catch (error) {
//       console.error("Error handling Flutterwave webhook:", error.message);
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   } else {
//     // Handle invalid request methods
//     res.status(405).json({ message: "Method Not Allowed" });
//   }
// }

import { admin, adminDB } from '@/lib/firebase_admin'

export async function POST(req) {
	try {
		// Parse the incoming request body
		const paymentResponse = await req.json()

		console.log('hook called: ', paymentResponse)

		// Ensure the necessary fields are present in the response
		const { transaction_id, tx_ref, status, amount, metadata } = paymentResponse

		if (!transaction_id || !tx_ref || !status) {
			return new Response(JSON.stringify({ message: 'Invalid payment data' }), { status: 400 })
		}

		// Save payment details to Firestore in 'payments' collection
		await adminDB
			.collection('payments')
			.doc(transaction_id)
			.set({
				checkoutId: tx_ref, // Use tx_ref to link to checkout session
				status, // Payment status (successful, failed, etc.)
				amount,
				transaction_id, // Unique transaction ID from Flutterwave
				payment_method: paymentResponse.payment_method || 'card', // Get the payment method used
				metadata, // Any additional metadata you may need
				createdAt: admin.firestore.Timestamp.now(), // Timestamp when the payment was made
			})

		// Respond back to Flutterwave to acknowledge receipt of the webhook
		return new Response(JSON.stringify({ status: 'success' }), { status: 200 })
	} catch (error) {
		console.error('Error handling Flutterwave webhook:', error.message)
		return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 })
	}
}

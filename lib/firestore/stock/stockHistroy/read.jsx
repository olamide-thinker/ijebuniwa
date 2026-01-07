import {
	doc,
	collection,
	addDoc,
	getDocs,
	updateDoc,
	deleteDoc,
	serverTimestamp,
	query,
	orderBy,
} from 'firebase/firestore'
import { db } from '@/lib/firebase' // Ensure your Firebase config is set up properly

// Fetch all insights from the user's "insights" subcollection
export async function getStockHistory(id) {
	// console.log('id-> ',id)

	try {
		// const ref = collection(doc(db, "stock", uid), "history"); // Reference to 'insights' subcollection
		// Reference to the 'history' sub-collection
		const historyRef = collection(doc(db, 'stock', id), 'history')

		// Create a query to sort by date in descending order
		const historyQuery = query(historyRef, orderBy('date', 'desc'))

		// Fetch all documents in the 'history' sub-collection
		const historySnapshot = await getDocs(historyQuery)

		// Map the data to an array
		const historyData = historySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}))

		// console.log("History Data:", historyData);

		return historyData // Return array of insights
	} catch (error) {
		console.error('Error fetching insights: ', error)
		throw error
	}
}

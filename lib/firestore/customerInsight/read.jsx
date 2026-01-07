import {
	doc,
	collection,
	addDoc,
	getDocs,
	updateDoc,
	deleteDoc,
	serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase' // Ensure your Firebase config is set up properly

// Fetch all insights from the user's "insights" subcollection
export async function getCustomerInsights(uid) {
	try {
		const insightRef = collection(doc(db, 'users', uid), 'insights') // Reference to 'insights' subcollection
		const snapshot = await getDocs(insightRef)

		const insights = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}))

		return insights // Return array of insights
	} catch (error) {
		console.error('Error fetching insights: ', error)
		throw error
	}
}

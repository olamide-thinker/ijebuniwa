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

// Add a new insight to the user's "insights" subcollection
export async function addCustomerInsight(uid, data) {
	try {
		const insightRef = collection(doc(db, 'users', uid), 'insights') // Create reference to 'insights' subcollection

		// Add new document with timeCreated, timeEdited, and data fields
		const newInsight = await addDoc(insightRef, {
			timeCreated: serverTimestamp(),
			timeEdited: serverTimestamp(),
			data, // Spread the data (title, description) passed as argument
		})

		console.log('Document written with ID: ', newInsight.id)
		return newInsight.id // Return document ID
	} catch (error) {
		console.error('Error adding document: ', error)
		throw error
	}
}

// Update an existing insight in the user's "insights" subcollection
export async function updateCustomerInsight(uid, insightId, data) {
	try {
		const insightRef = doc(db, `users/${uid}/insights/${insightId}`) // Reference to specific insight document

		await updateDoc(insightRef, {
			data, // Spread the updated data (title, description)
			timeEdited: serverTimestamp(), // Update the edited time
		})

		console.log('Document updated with ID: ', insightId)
		return insightId // Return updated document ID
	} catch (error) {
		console.error('Error updating document: ', error)
		throw error
	}
}

// Delete an existing insight in the user's "insights" subcollection
export async function deleteCustomerInsight(uid, insightId) {
	try {
		const insightRef = doc(db, `users/${uid}/insights/${insightId}`) // Reference to specific insight document

		await deleteDoc(insightRef)

		console.log('Document deleted with ID: ', insightId)
		return insightId // Return deleted document ID
	} catch (error) {
		console.error('Error deleting document: ', error)
		throw error
	}
}

import { collection, doc, getDocs, query, orderBy, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function createStockHistory(uid, stockHistory) {
	try {
		// Reference the 'history' sub-collection for the specific stock document
		const historyRef = collection(doc(db, 'stock', uid), 'history')

		// Get all existing history entries, ordered by date
		const historySnapshot = await getDocs(query(historyRef, orderBy('date', 'desc')))

		let latestStock = 0

		// Determine the latest stock from the most recent history entry
		if (!historySnapshot.empty) {
			const latestEntry = historySnapshot.docs[0].data()
			latestStock =
				(latestEntry.stock || 0) + (stockHistory.stockIn || 0) - (stockHistory.stockOut || 0)
		} else {
			// If no history exists, initialize with the stockIn value
			latestStock = (stockHistory.stockIn || 0) - (stockHistory.stockOut || 0)
		}

		// Add the new stock history entry
		const docRef = await addDoc(historyRef, {
			...stockHistory,
			stock: latestStock || 0, // Updated stock value
			date: Timestamp.now(), // Automatically set the current date/time
		})

		console.log('Stock history added with ID:', docRef.id)

		return { id: docRef.id, ...stockHistory, stock: latestStock, date: Timestamp.now() }
	} catch (error) {
		console.error('Error adding stock history:', error)
		throw error
	}
}

// // Update an existing insight in the user's "insights" subcollection
// export async function updateCustomerInsight(uid, insightId, data) {

//   try {
//     const insightRef = doc(db, `users/${uid}/insights/${insightId}`); // Reference to specific insight document

//     await updateDoc(insightRef, {
//       data, // Spread the updated data (title, description)
//       timeEdited: Timestamp.now(), // Update the edited time
//     });

//     console.log("Document updated with ID: ", insightId);
//     return insightId; // Return updated document ID
//   } catch (error) {
//     console.error("Error updating document: ", error);
//     throw error;
//   }
// }

// // Delete an existing insight in the user's "insights" subcollection
// export async function deleteCustomerInsight(uid, insightId) {
//   try {
//     const insightRef = doc(db, `users/${uid}/insights/${insightId}`); // Reference to specific insight document

//     await deleteDoc(insightRef);

//     console.log("Document deleted with ID: ", insightId);
//     return insightId; // Return deleted document ID
//   } catch (error) {
//     console.error("Error deleting document: ", error);
//     throw error;
//   }
// }

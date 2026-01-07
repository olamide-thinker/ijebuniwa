import { db, storage } from '@/lib/firebase'
import { collection, deleteDoc, doc, setDoc, Timestamp } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

// export const createNewProduct = async ({ data, featureImage, imageList }) => {

//   const newId = doc(collection(db, `ids`)).id;

//   await setDoc(doc(db, `products/${newId}`), {
//     ...data,
//     featureImageURL: featureImageURL,
//     imageList: imageURLList,
//     id: newId,
//     timestampCreate: Timestamp.now(),
//   });
// };

// export const updateStockPreference = async ({ data, stockId }) => {
//   if (!stockId) throw new Error("Stock ID is required for updating stock.");

//   await setDoc(doc(db, `stock/${stockId}`), {
//     ...data,
//     timestampUpdate: Timestamp.now(),
//   });
// };

// import { doc, setDoc, Timestamp } from "firebase/firestore";
// import { db } from "@/lib/firebase";

export const updateStockPreference = async ({ productId, data }) => {
	try {
		// Use the product ID to reference the stock document
		const stockRef = doc(db, `stock`, productId)

		await setDoc(stockRef, {
			...data,
			timestampUpdate: Timestamp.now(), // Add/update the timestamp
		})

		console.log('Stock preference updated successfully for product:', productId)
		return { success: true }
	} catch (error) {
		console.error('Error updating stock preference:', error)
		return { success: false, error }
	}
}

export const deleteProduct = async ({ id }) => {
	if (!id) {
		throw new Error('ID is required')
	}
	await deleteDoc(doc(db, `stock/${id}`))
}

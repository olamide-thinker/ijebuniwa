import { db } from '@/lib/firebase'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'

export const getCategory = async ({ id }) => {
	const data = await getDoc(doc(db, `categories/${id}`))
	if (data.exists()) {
		return data.data()
	} else {
		return null
	}
}

// export const getCategories = async () => {
//   const list = await getDocs(collection(db, "categories"));
//   return list.docs.map((snap) => snap.data());
// };

export const getCategories = async () => {
	const list = await getDocs(collection(db, 'categories'))
	return list.docs.map((snap) => {
		const data = snap.data()
		return {
			...data,
			id: snap.id,
			timestampCreate: data.timestampCreate?.toDate().toISOString(), // Convert Firestore.Timestamp to ISO string
		timestampUpdate: data.timestampUpdate?.toDate().toISOString(),
		}
	})
}

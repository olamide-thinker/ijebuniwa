import { db } from '@/lib/firebase'
import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore'
import { fetcher } from '@/lib/globalFetcherFunc' // Adjust the import path accordingly

export const getProduct = async ({ id }) => {
	const data = await getDoc(doc(db, `products/${id}`))

	console.log('data', data)

	if (data.exists()) {
		return data.data()
	} else {
		return null
	}
}

export const getFeaturedProducts = async () => {
	const list = await getDocs(query(collection(db, 'products'), where('isFeatured', '==', true)))
	return list.docs.map((snap) => snap.data())
}

// export const getProducts = async (pageSize = 10, lastVisible = null) => {
//   const path = "products"; // Define the path to the products collection
//   const { data } = await fetcher(path, pageSize, lastVisible, "timestampCreate", "desc"); // Order by timestampCreate descending
//   return data;
// };

export const getProducts = async () => {
	const list = await getDocs(query(collection(db, 'products'), orderBy('timestampCreate', 'desc')))
	return list.docs.map((snap) => snap.data())
}

export const getProductsByCategory = async ({ categoryId }) => {
	const list = await getDocs(
		query(
			collection(db, 'products'),
			orderBy('timestampCreate', 'desc'),
			where('categoryId', '==', categoryId),
		),
	)
	return list.docs.map((snap) => snap.data())
}

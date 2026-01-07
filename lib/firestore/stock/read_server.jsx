import { db } from '@/lib/firebase'
import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore'
import { fetcher } from '@/lib/globalFetcherFunc' // Adjust the import path accordingly

export const getStock = async ({ id }) => {
	const data = await getDoc(doc(db, `stock/${id}`))

	console.log('data', data.data())

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

export const getStockInfo = async () => {
	const list = await getDocs(query(collection(db, 'stock'), orderBy('timestampCreate', 'desc')))
	return list.docs.map((snap) => snap.data())
}

export const getStockByType = async ({ type }) => {
	let list

	if (type === stock_in) {
		list = await getDocs(
			query(
				collection(db, 'stock'),
				orderBy('timestampCreate', 'desc'),
				where('stock_in', '<=', 0),
			),
		)
	} else {
		list = await getDocs(
			query(
				collection(db, 'stock'),
				orderBy('timestampCreate', 'desc'),
				where('stock_out', '<=', 0),
			),
		)
	}
	return list.docs.map((snap) => snap.data())
}

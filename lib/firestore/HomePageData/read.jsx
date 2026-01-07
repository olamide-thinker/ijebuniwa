import { db } from '@/lib/firebase'
import { collection, doc, getDocs, getDoc, query, limit, startAfter } from 'firebase/firestore'

// Simplified example of combining multiple queries
export async function getHomePageData() {
	const productsRef = collection(db, `/products`)
	const collectionsRef = collection(db, `/collections`)
	const categoriesRef = collection(db, `/categories`)
	const brandsRef = collection(db, `/brands`)
	// const brandsRef = collection(db, `users/${userId}/brands`);

	// Use Promise.all to fetch all data in parallel
	const [productsSnap, collectionsSnap, categoriesSnap, brandsSnap] = await Promise.all([
		getDocs(productsRef),
		getDocs(collectionsRef),
		getDocs(categoriesRef),
		getDocs(brandsRef),
	])

	return {
		products: productsSnap.docs.map((doc) => doc.data()),
		collections: collectionsSnap.docs.map((doc) => doc.data()),
		categories: categoriesSnap.docs.map((doc) => doc.data()),
		brands: brandsSnap.docs.map((doc) => doc.data()),
	}
}

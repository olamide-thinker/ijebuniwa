'use client'

import { db } from '@/lib/firebase'
import {
	average,
	collection,
	count,
	getAggregateFromServer,
	getCountFromServer,
	getDocs,
} from 'firebase/firestore'
import useSWR from 'swr'

export const getProductsCount = async () => {
	const ref = collection(db, `products`)
	const data = await getCountFromServer(ref)
	return data.data().count
}

export function useProductCount() {
	const { data, error, isLoading } = useSWR('products_count', (key) => getProductsCount())
	if (error) {
		console.log(error?.message)
	}
	return { data, error, isLoading }
}

// Fetch products and calculate the max price
export const getMaxPriceFromProducts = async () => {
	const ref = collection(db, `products`)

	try {
		// Fetch all products
		const querySnapshot = await getDocs(ref)

		// Extract prices from the documents
		const prices = querySnapshot.docs
			.map((doc) => doc.data().price) // Assuming each product has a 'price' field
			.filter((price) => typeof price === 'number') // Filter out invalid prices

		// Calculate the maximum price
		const minPrice = Math.min(...prices)

		const maxPrice = Math.max(...prices)

		return [minPrice, maxPrice]
	} catch (error) {
		console.error('Error fetching products:', error)
		throw error
	}
}

export function useProductMaxPrice() {
	const { data, error, isLoading } = useSWR('products_maxPrice', getMaxPriceFromProducts)

	console.log('>>>>>>>>>...', data)
	if (error) {
		console.log(error?.message)
	}
	return { data, error, isLoading }
}

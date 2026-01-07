import { collection, getDocs, doc, setDoc } from 'firebase/firestore'
import { db, Timestamp } from '@/lib/firebase' // Ensure correct Firebase setup

const syncProductsAndStock = async () => {
	try {
		const productsCollectionRef = collection(db, 'products')
		const stockCollectionRef = collection(db, 'stock')

		// Fetch all documents from both collections
		const [productsSnapshot, stockSnapshot] = await Promise.all([
			getDocs(productsCollectionRef),
			getDocs(stockCollectionRef),
		])

		const products = {}
		const stock = {}

		// Populate the product and stock data
		productsSnapshot.forEach((doc) => {
			products[doc.id] = { id: doc.id, ...doc.data() }
		})

		stockSnapshot.forEach((doc) => {
			stock[doc.id] = { id: doc.id, ...doc.data() }
		})

		const operations = []

		// Handle missing products in stock collection
		for (const productId in products) {
			if (!stock[productId]) {
				console.log(`Adding missing stock entry for product ID: ${productId}`)
				const productData = products[productId]

				const newStockEntry = {
					product_name: productData.product_name || 'Unknown',
					available_stock: productData.stock || 0,
					price: productData.price || 0,
					sale_price: productData.sale_price || 0,
					onSale: productData.onSale || false,
					timestampUpdate: Timestamp.now(),
				}

				operations.push(setDoc(doc(stockCollectionRef, productId), newStockEntry, { merge: true }))
			}
		}

		// Handle missing products in products collection
		for (const stockId in stock) {
			if (!products[stockId]) {
				console.log(`Adding missing product entry for stock ID: ${stockId}`)
				const stockData = stock[stockId]

				const newProductEntry = {
					product_name: stockData.product_name || 'Unknown',
					stock: stockData.available_stock || 0,
					price: stockData.price || 0,
					sale_price: stockData.sale_price || 0,
					onSale: stockData.onSale || false,
					timestampUpdate: Timestamp.now(),
				}

				operations.push(
					setDoc(doc(productsCollectionRef, stockId), newProductEntry, { merge: true }),
				)
			}
		}

		// Execute all updates
		await Promise.all(operations)

		console.log('Synchronization complete. Missing entries have been added.')
	} catch (error) {
		console.error('Error during synchronization:', error)
	}
}

export default syncProductsAndStock

'use client'

import { create } from 'zustand'
import {
	doc,
	collection,
	addDoc,
	getDocs,
	getDoc,
	query,
	orderBy,
	Timestamp,
	limit,
	startAfter,
	setDoc,
	updateDoc,
	deleteDoc,
	where,
} from 'firebase/firestore'
import { db } from '@/lib/firebase' // Your Firebase setup
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'
import { useProductStore } from '../products/read'

export const useStockStore = create((set, get) => ({
	selectedStock: null,
	stockHistory: {}, // Key-value pair of stockId -> history array
	stock: [], // List of stocks
	lastSnapDoc: null, // Last document for pagination
	error: null,
	loading: false,
	hasMore: true,

	fetchStock: async () => {
		set({ loading: true, error: null })
		try {
			let stockQuery = collection(db, 'stock') // Reference to stock collection
			stockQuery = query(stockQuery, orderBy('timestampUpdate', 'desc'))

			// Fetch stock data from Firestore
			const snapshot = await getDocs(stockQuery)
			const stockData = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}))

			// Fetch products directly
			const { fetchProducts } = useProductStore.getState()
			const products = await fetchProducts() // Ensure products are loaded before checking stock
			console.log(await fetchProducts())

			if (!products || products.length === 0) {
				console.warn('No products found.')
				set({ loading: false })
				return
			}

			const ensureStockExists = get().ensureStockExists

			// Ensure every product has a corresponding stock entry
			await Promise.all(
				products.map(async (product) => {
					const productHasStock = stockData.some((stock) => stock.id === product.id)

					if (!productHasStock) {
						console.log(`Product ID ${product.id} is missing in stock. Adding...`)
						await ensureStockExists(product.id) // Create missing stock entry
					}
				}),
			)

			// Update Zustand state with the fetched stock data
			set((state) => ({
				stock: stockData, // Update state with the validated/updated stock data
				loading: false,
			}))
		} catch (error) {
			console.error('Error fetching stock:', error)
			set({ error: error.message, loading: false })
		}
	},

	// Fetch stock by ID
	fetchStockById: async (id, fetchProduct) => {
		set({ loading: true, error: null })

		try {
			const stockRef = doc(db, `/stock/${id}`)
			const stockDoc = await getDoc(stockRef)

			if (!stockDoc.exists()) {
				throw new Error(`Stock with ID ${id} not found`)
			}

			const stockData = { id: stockDoc.id, ...stockDoc.data() }

			// Update Zustand store with fetched stock data
			set({ selectedStock: stockData })
		} catch (error) {
			console.error('Error fetching stock by ID:', error)
			set({ error: error.message })
		} finally {
			set({ loading: false })
		}
	},

	//   // Sync stock prices with respective product prices
	// syncStockPricesWithProducts: async (fetchProduct) => {
	//   console.log(fetchProduct)
	//   set({ loading: true, error: null });
	//   try {
	//     // Fetch all stock entries
	//     const stockCollectionRef = collection(db, "stock");
	//     const stockSnapshot = await getDocs(stockCollectionRef);

	//     const updates = stockSnapshot.docs.map(async (stockDoc) => {
	//       const stockData = { id: stockDoc.id, ...stockDoc.data() };

	//       // Fetch corresponding product details
	//       const product = await fetchProduct(stockData.id);

	//       console.log("44444>>> ", product.price)

	//       if (product) {
	//         // Update stock price to match product price
	//         await get().updateStockPreference({
	//           productId: stockData.id,
	//           data: { price: product.price },
	//         });
	//         console.log(
	//           `Updated stock (${stockData.id}) price to product price (${product.price})`
	//         );
	//       }
	//     });

	//     // Wait for all updates to complete
	//     await Promise.all(updates);

	//     toast.success("All stock prices synchronized with product prices.");
	//   } catch (error) {
	//     console.error("Error syncing stock prices with products:", error);
	//     set({ error: error.message });
	//   } finally {
	//     set({ loading: false });
	//   }
	// },

	// Fetch stock history
	fetchStockHistory: async (id) => {
		set({ loading: true })
		try {
			const historyRef = collection(doc(db, 'stock', id), 'history')
			const historyQuery = query(historyRef, orderBy('date', 'desc'))
			const snapshot = await getDocs(historyQuery)
			const history = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

			set((state) => ({
				stockHistory: { ...state.stockHistory, [id]: history },
				loading: false,
			}))
		} catch (error) {
			console.error('Error fetching stock history:', error)
			set({ error: error.message, loading: false })
		}
	},

	ensureStockExists: async (productId) => {
		try {
			const stockRef = doc(db, 'stock', productId)
			const stockSnapshot = await getDoc(stockRef)

			// If the stock document does not exist
			if (!stockSnapshot.exists()) {
				const { fetchProduct } = useProductStore.getState() // Access product store
				const product = await fetchProduct(productId) // Fetch the product details

				// If the product exists, create a corresponding stock entry
				if (product) {
					await setDoc(stockRef, {
						product_name: product.title || 'Unknown Product',
						product_image: product.featureImageURL || '',
						available_stock: 0, // Default stock
						low_stock: 1, // Default low stock
						price: product.price || 0,
						sale_price: 0,
						product_id: productId,
						isPublished: true,
						timestampCreate: Timestamp.now(),
						timestampUpdate: Timestamp.now(),
					})

					console.log(`Added stock entry for product: ${productId}`)
				} else {
					console.error(`Product with ID ${productId} does not exist in products collection.`)
				}
			} else {
				console.log(`Stock entry already exists for product: ${productId}`)
			}
		} catch (error) {
			console.error(`Error in ensureStockExists for product ${productId}:`, error)
		}
	},

	updateProductPreference: async ({ productId, data }) => {
		try {
			const productRef = doc(db, 'products', productId)

			await setDoc(
				productRef,
				{
					...data,
					timestampUpdate: Timestamp.now(), // Add/update the timestamp
				},
				{ merge: true },
			)

			console.log('Product preference updated successfully for product:', productId)

			return { success: true }
		} catch (error) {
			console.error('Error updating product preference:', error)
			return { success: false, error }
		}
	},

	updateStockPreference: async ({ productId, data }) => {
		try {
			const stockRef = doc(db, 'stock', productId)
			const stockDoc = await getDoc(stockRef)

			// Preserve existing data if the document exists
			const existingData = stockDoc.exists() ? stockDoc.data() : {}

			// Merge the existing data with the new data
			const updatedData = {
				...existingData,
				...data,
				timestampUpdate: Timestamp.now(), // Update the timestamp
			}

			await setDoc(stockRef, updatedData, { merge: true }) // Use merge to avoid overwriting unrelated fields

			console.log('Stock preference updated successfully for product:', productId)
			return { success: true }
		} catch (error) {
			console.error('Error updating stock preference:', error)
			return { success: false, error }
		}
	},

	// // Update stock preference
	// updateStockPreference: async ({ productId, data }) => {
	//   try {
	//     const stockRef = doc(db, "stock", productId);

	//     if (!stockRef.exists()) {
	//       const { subscribeToStockUpdates } = useProductStore.getState(); // Access product store
	//       const unsubscribe = subscribeToStockUpdates();
	//       console.log(`Added stock entry for product: ${productId}`);
	//   // Clean up subscription on unmount
	//       return () => unsubscribe();
	//       } else {
	//         console.error(`Product with ID ${productId} does not exist in products collection.`);
	//       }

	//       await setDoc(stockRef, {
	//         ...data,
	//         timestampUpdate: Timestamp.now(), // Add/update the timestamp
	//       });
	//       console.log("Stock preference updated successfully for product:", productId);

	//     return { success: true };
	//   } catch (error) {
	//     console.error("Error updating stock preference:", error);
	//     return { success: false, error };
	//   }
	// },

	// Delete stock
	deleteProduct: async ({ id }) => {
		try {
			if (!id) {
				throw new Error('ID is required')
			}
			await deleteDoc(doc(db, `stock/${id}`))
			toast.success(`Product with ID ${id} deleted successfully.`)
		} catch (error) {
			console.error('Error deleting product:', error)
			toast.error(`Failed to delete product with ID ${id}.`)
		}
	},

	// Update stock history
	updateStockHistory: async (id, stockHistory) => {
		try {
			const stockRef = doc(db, 'stock', id)
			const stockDoc = await getDoc(stockRef)
			if (!stockDoc.exists()) {
				throw new Error('Stock not found')
			}
			const stockData = { id: stockDoc.id, ...stockDoc.data() }

			const historyRef = collection(stockRef, 'history')
			const historySnapshot = await getDocs(query(historyRef, orderBy('date', 'desc')))
			let latestStock = 0

			if (stockHistory.stockOut && stockHistory.stockOut > stockData.available_stock) {
				toast.error('Insufficient stock for Order!')
				throw new Error('Insufficient stock for stock out')
			}

			if (!historySnapshot.empty) {
				const latestEntry = historySnapshot.docs[0].data()
				latestStock =
					(latestEntry?.stock || 0) + (stockHistory?.stockIn || 0) - (Math.abs(stockHistory?.stockOut) || 0)
			} else {
				latestStock = (stockHistory?.stockIn || 0) - (Math.abs(stockHistory?.stockOut) || 0)
			}

			const newHistory = {
				...stockHistory,
				stock: latestStock,
				measurement: stockData?.measurement || '',
				date: Timestamp.now(),
			}
			await addDoc(historyRef, newHistory)

			await updateDoc(stockRef, {
				available_stock: latestStock,
				timestampUpdated: Timestamp.now(),
			})

			get().fetchStockHistory(id)
			get().fetchStockById(id)
			get().fetchStock()

			console.log('Stock history and main document updated successfully.')
			return { success: true, newHistory }
		} catch (error) {
			console.error('Error adding stock history:', error.message, error.stack)
			return { success: false, error: error.message }
		}
	},
}))

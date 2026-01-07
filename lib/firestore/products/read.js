'use client'

import { create } from 'zustand'
import { collection, onSnapshot, writeBatch } from 'firebase/firestore'
import { db, storage } from '@/lib/firebase'
import { fetcher } from '@/lib/globalFetcherFunc'
import { useStockStore } from '../stock/stockStore'
import {
	collection as firestoreCollection,
	deleteDoc,
	doc,
	setDoc,
	Timestamp,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

export const useProductStore = create((set, get) => ({
	products: [], // Store products
	product: {},
	lastSnapDocList: [], // Store pagination state
	pageLimit: 10, // Default page limit
	isLoading: false,
	error: null,

	setProductData: (data) => set({ productData: data || {} }),
	setFeatureImage: (image) => set({ featureImage: image }),
	setImageList: (images) => set({ imageList: images || [] }),

	resetProductData: () => set({ productData: null, featureImage: null, imageList: [] }),

	createProduct: async ({ productData, featureImage, imageList }) => {
		set({ isLoading: true })
		try {
			// Ensure required fields are present
			if (!productData?.title || !productData?.shortDescription) {
				throw new Error('Product title and short description are required.')
			}

			// Initialize image variables
			let featureImageURL = ''
			let imageURLList = []

			// Upload feature image if provided
			if (featureImage) {
				const featureImageRef = ref(storage, `products/${featureImage.name}`)
				await uploadBytes(featureImageRef, featureImage)
				featureImageURL = await getDownloadURL(featureImageRef)
			} else {
				// Use placeholder or empty string for feature image
				featureImageURL = 'no-image-available.png'
			}

			// Upload additional images if provided
			if (imageList?.length) {
				imageURLList = await Promise.all(
					imageList.map(async (image) => {
						const imageRef = ref(storage, `products/${image.name}`)
						await uploadBytes(imageRef, image)
						return await getDownloadURL(imageRef)
					}),
				)
			} else {
				// Use placeholder or empty array for additional images
				imageURLList = ['no-image-available.png']
			}

			// Generate a new ID for the product
			const newId = doc(collection(db, `products`)).id

			// Save the product to Firestore
			await setDoc(doc(db, `products/${newId}`), {
				...productData,
				featureImageURL,
				imageList: imageURLList,
				id: newId,
				timestampCreate: Timestamp.now(),
			})

			console.log(newId)

			// Access `ensureStockExists` from `useStockStore`
			const ensureStockExists = useStockStore.getState().ensureStockExists
			await ensureStockExists(newId) // Call stock store's function

			// Update the state with the new product
			set((state) => ({
				products: [
					...state.products,
					{
						...productData,
						id: newId,
						featureImageURL,
						imageList: imageURLList,
					},
				],
				isLoading: false,
			}))

			// // Update the state with the new product
			// set((state) => ({
			//   products: [
			//     ...state.products,
			//     {
			//       ...productData,
			//       id: newId,
			//       featureImageURL,
			//       imageList: imageURLList,
			//     },
			//   ],
			//   isLoading: false,
			// }));

			return true
		} catch (error) {
			console.error('Error in createProduct:', error)
			set({ error: error.message, isLoading: false })
			return false
		}
	},

	// Update an existing product
	updateProduct: async ({ productData, featureImage, imageList = [] }) => {
		set({ isLoading: true })
		try {
			console.log('rrrrrrrrr>>>> ', productData?.title)
			if (!productData?.id || !productData?.title) {
				throw new Error('Product ID and title are required.')
			}

			let featureImageURL = productData?.featureImageURL

			if (featureImage) {
				const featureImageRef = ref(storage, `products/${featureImage.name}`)
				await uploadBytes(featureImageRef, featureImage)
				featureImageURL = await getDownloadURL(featureImageRef)
			}

			const imageURLList =
				imageList?.length === 0
					? productData?.imageList || []
					: await Promise.all(
							imageList.map(async (image) => {
								const imageRef = ref(storage, `products/${image.name}`)
								await uploadBytes(imageRef, image)
								return await getDownloadURL(imageRef)
							}),
						)

			console.log('----> ', {
				productData,
				featureImageURL: featureImageURL,
				imageList: imageURLList,
				timestampUpdate: Timestamp.now(),
			})

			await setDoc(doc(db, `products/${productData.id}`), {
				...productData,
				featureImageURL: featureImageURL,
				imageList: imageURLList,
				timestampUpdate: Timestamp.now(),
			})

			// Sync product name and other relevant fields with the stock collection
			const stockRef = doc(db, `stock/${productData.id}`)
			await setDoc(
				stockRef,
				{
					product_name: productData.title,
					product_image: featureImageURL,
					timestampUpdate: Timestamp.now(),
				},
				{ merge: true }, // Merge fields without overwriting unrelated stock fields
			)

			set((state) => ({
				products: Array.isArray(state.products)
					? state.products.map((product) =>
							product.id === productData.id
								? { ...product, featureImageURL, imageList: imageURLList }
								: product,
						)
					: state.products, // If not an array, leave unchanged
				isLoading: false,
			}))

			return true
		} catch (error) {
			console.error('Error ', error)
			set({ error: error.message, isLoading: false })
			return false
		}
	},

	// // Delete a product
	// deleteProduct: async (id) => {
	//   set({ isLoading: true });
	//   try {
	//     if (!id) {
	//       throw new Error("Product ID is required.");
	//     }

	//     await deleteDoc(doc(db, `products/${id}`));

	//     set((state) => ({
	//       products: state.products.filter((product) => product.id !== id),
	//       isLoading: false,
	//     }));

	//     return true;
	//   } catch (error) {
	//     set({ error: error.message, isLoading: false });
	//     return false;
	//   }
	// },

	deleteProduct: async (id) => {
		// set({ isLoading: true });
		try {
			if (!id) {
				throw new Error('Product ID is required.')
			}

			// Delete the product from the 'products' collection
			await deleteDoc(doc(db, `products/${id}`))

			// Delete the corresponding stock entry
			await deleteDoc(doc(db, `stock/${id}`))

			// Update the local state for products and optionally for stock
			set((state) => ({
				products: state?.products?.filter((product) => product.id !== id),
				stock: state?.stock?.filter((stockItem) => stockItem.id !== id),
				isLoading: false,
			}))

			return true
		} catch (error) {
			console.error('Error deleting product and stock:', error)
			set({ error: error.message, isLoading: false })
			return false
		}
	},

	fetchProducts: async (pageSize = 10, lastSnapDoc = null, filters = {}) => {
		set({ isLoading: true, error: null })
		try {
			const { data: products, lastVisible } = await fetcher(
				'products',
				pageSize,
				lastSnapDoc,
				'timestampCreate',
				'desc',
				filters,
			)

			// set((state) => ({
			//   products: [...state.products, ...products], // Append new products
			//   lastSnapDoc: lastVisible, // Update lastSnapDoc for pagination
			//   pageLimit: pageSize,
			//   isLoading: false,
			// }));

			set((state) => {
				const existingIds = new Set(state.products.map((product) => product.id))
				const uniqueProducts = products.filter((product) => !existingIds.has(product.id))
				return {
					products: [...state.products, ...uniqueProducts], // Append only unique items
					lastSnapDoc: lastVisible,
					isLoading: false,
				}
			})
			console.log('>>>>>>>>mmmm>>>>>>>>', products)
			return products // Return the products for immediate use if needed
		} catch (err) {
			console.error('Error fetching products:', err)
			set({ error: err.message, isLoading: false })
		}
	},

	nextPage: async () => {
		const { lastSnapDoc, pageSize, filters, fetchProducts } = get()
		await fetchProducts(pageSize, lastSnapDoc, filters) // Fetch next page
	},

	prevPage: () => {
		set((state) => {
			const updatedLastSnapDocList = state.lastSnapDocList.slice(0, -1) // Remove the last doc
			return {
				lastSnapDocList: updatedLastSnapDocList,
				lastSnapDoc: updatedLastSnapDocList[updatedLastSnapDocList.length - 1] || null,
			}
		})
	},

	// Fetch single product by ID
	fetchProduct: async (productId) => {
		set({ loading: true })
		try {
			const data = await fetcher(`/products/${productId}`)

			set((state) => ({
				product: { ...state.products, [productId]: data },
				loading: false,
			}))
			console.log('|||||||> ', data)
			return data
		} catch (error) {
			set({ error, loading: false })
		}
	},

	// Fetch products by list of IDs
	fetchProductsByIds: async (idsList) => {
		set({ isLoading: true })
		try {
			const promises = idsList.map((id) => fetcher(`/products/${id}`))
			const data = await Promise.all(promises)

			set((state) => ({
				products: [...state.products, ...data],
				isLoading: false,
			}))

			return data
		} catch (error) {
			set({ error, loading: false })
		}
	},

	subscribeToStockUpdates: () => {
		const stockRef = collection(db, 'stock')

		// Set up Firestore listener for stock changes
		const unsubscribe = onSnapshot(stockRef, async (snapshot) => {
			const batch = writeBatch(db) // Use a batch to handle multiple updates efficiently

			snapshot.docChanges().forEach((change) => {
				if (change.type === 'modified' || change.type === 'added') {
					const stockData = { id: change.doc.id, ...change.doc.data() }

					// Use `get` to fetch the current state of products
					const products = get().products // Fetch products from store
					const currentProduct = products.find((product) => product.id === stockData.id)

					if (
						(currentProduct,
						currentProduct?.price !== stockData.price ||
							currentProduct?.stock !== stockData.available_stock ||
							currentProduct?.salePrice !== stockData.sale_price)
					) {
						console.log(
							`Updating product ID ${stockData.id}: 
             Price: ${currentProduct?.price} → ${stockData.price}, 
             Stock: ${currentProduct?.stock} → ${stockData.available_stock}, 
             Sale Price: ${currentProduct?.salePrice} → ${stockData.sale_price}`,
						)

						// Update product price in the local store
						set((state) => ({
							products: state.products.map((product) =>
								product.id === stockData.id
									? {
											...product,
											price: stockData?.price,
											stock: stockData?.available_stock,
											salePrice: stockData?.sale_price,
										}
									: product,
							),
						}))

						// Safely update the Firestore `products` collection
						const productDocRef = doc(db, `/products/${stockData.id}`)

						batch.set(
							productDocRef,
							{
								price: stockData?.price,
								stock: stockData?.available_stock,
								onSale: stockData?.onSale || false,
								salePrice: stockData?.sale_price,
								timestampUpdate: Timestamp.now(), // Optional: Update timestamp
							},
							{ merge: true }, // Prevents overwriting the entire document
						)
					}
				}
			})

			// Commit the batch after processing all changes
			try {
				await batch.commit()
				console.log('Batch update completed for stock changes.')
			} catch (error) {
				console.error('Error updating Firestore:', error)
			}
		})

		return unsubscribe // Return the unsubscribe function to stop listening when needed
	},

	// Clear the product store (for example, when logout or reset)
	clearProducts: () => set({ products: {}, error: null }),
}))

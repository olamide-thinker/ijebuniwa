'use client'

// import useSWR from "swr";
import { fetcher } from '@/lib/globalFetcherFunc' // Import fetcher

import { getProducts } from '../products/read_server'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { doc, getDoc, getDocs, setDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { updateStockPreference } from './write'
import { getStockHistory } from './stockHistroy/read'

// import { getProducts } from "@/lib/api"; // Assuming `getProducts` is correctly imported
// import fetcher from "@/lib/fetcher"; // Fetcher for SWR

// import useSWR from "swr";

// export async function fetchStocks(pageLimit, lastSnapDoc) {
//   const stockCollection = collection(db, "stock");
//   const stockQuery = query(stockCollection, orderBy("timestampUpdate", "desc"));

//   const querySnapshot = await getDocs(stockQuery);

//   const stocks = [];

//   for (const stockDoc of querySnapshot.docs) {
//     const stockData = stockDoc.data();
//     const productId = stockDoc.id;

//     // Ensure stock data exists for each product
//     if (!stockData.product_name || !stockData.product_image) {
//       // Fetch product details if stock data is incomplete
//       const productDoc = await getDoc(doc(db, "products", productId));
//       const productData = productDoc.exists() ? productDoc.data() : null;

//       if (productData) {
//         // Populate missing stock data based on product information
//         const defaultData = {
//           product_name: productData.product_name,
//           product_image: productData.image || "",
//           available_stock: 0,
//           low_stock: 0,
//           price: productData.price || 0,
//           sale_price: productData.sale_price || 0,
//           timestampCreate: Timestamp.now(),
//         };

//         // Save the default stock document
//         await setDoc(doc(db, "stock", productId), {
//           ...defaultData,
//           ...stockData, // Preserve existing fields if any
//         });

//         console.log(`Created stock data for product: ${productId}`);
//         stocks.push({ id: productId, ...defaultData });
//       } else {
//         console.warn(`No product found for ID: ${productId}`);
//       }
//     } else {
//       stocks.push({ id: productId, ...stockData });
//     }
//   }

//   return stocks;
// }

// export function useGetAllStock({ pageLimit, lastSnapDoc }) {
//   const { data, error, isValidating } = useSWR(
//     lastSnapDoc ? [`stock`, pageLimit, lastSnapDoc] : [`stock`, pageLimit],
//     ([path, pageLimit, lastSnapDoc]) => fetchStocks(pageLimit, lastSnapDoc)
//   );

//   return {
//     data,
//     error: error?.message,
//     isLoading: !data && !error,
//     isValidating,
//   };
// }

const updateStockCount = async (productId) => {
	try {
		const stockRef = doc(db, 'stock', productId)
		const stockDoc = await getDoc(stockRef) // Retrieve the stock document
		const history = await getStockHistory(productId) // Get stock history

		// Find the latest stock entry in history
		const latestStock = history.filter(
			(s) => s.date.toDate() >= Math.max(...history.map((d) => d.date.toDate())),
		)

		if (!stockDoc.exists()) {
			// Create a default stock document if none exists
			const defaultStockData = {
				available_stock: latestStock[0].stock,
				timestampCreate: Timestamp.now(),
			}
			await setDoc(stockRef, defaultStockData)
			console.log(`Created new stock document for product: ${productId}`)
			return defaultStockData
		} else {
			// Update existing stock document
			await setDoc(stockRef, {
				...stockDoc.data(),
				available_stock: latestStock[0].stock,
				timestampUpdate: Timestamp.now(),
			})
			// console.log(`Updated stock for product: ${productId}`);
			return stockDoc.data()
		}
	} catch (error) {
		console.error(`Failed to update stock count for product: ${productId}`, error)
		return null
	}
}

const ensureStockExists = async (productId, productName, productImage) => {
	try {
		const stockRef = doc(db, 'stock', productId)
		const stockDoc = await getDoc(stockRef)

		if (!stockDoc.exists()) {
			const defaultStockData = {
				product_name: productName || 'Unknown Product',
				product_image: productImage || '',
				available_stock: 0,
				low_stock: 1,
				price: 0,
				sale_price: 0,
				isPublished: true,
				timestampCreate: Timestamp.now(),
			}
			await setDoc(stockRef, defaultStockData)
			// console.log(`Created new stock document for product: ${productId}`);
			return defaultStockData
		}

		return stockDoc.data()
	} catch (error) {
		console.error(`Failed to ensure stock exists for product: ${productId}`, error)
		return null
	}
}

// const combinedData = products.map(async (product) => {
//   const stockItem = stockData?.data?.find((stock) => stock.id === product.id);

//   // Ensure stock exists if it doesn't
//   if (!stockItem) {
//     await ensureStockExists(product.id, product.title, product.featureImageURL);
//   }

//   // Update the stock count
//   await updateStockCount(product.id);

//   return {
//     ...product,
//     ...stockItem,
//   };
// });

export function useGetAllStock({ pageLimit, lastSnapDoc }) {
	const [products, setProducts] = useState([])
	// const [combinedData, setCombinedData] = useState()
	const {
		data: stockData,
		error,
		isValidating,
	} = useSWR(
		lastSnapDoc ? [`stock`, pageLimit, lastSnapDoc] : [`stock`, pageLimit],
		([path, pageLimit, lastSnapDoc]) => fetcher(path, pageLimit, lastSnapDoc),
	)

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const productList = await getProducts()
				setProducts(productList)
			} catch (err) {
				console.error('Failed to fetch products:', err)
			}
		}
		fetchProducts()
	}, [])

	const combinedData = products.map((product) => {
		const stockItem = stockData?.data?.find((stock) => stock.id === product.id)

		if (!stockItem) {
			ensureStockExists(product.id, product.title, product.featureImageURL)
		}

		// const selectedFields = {featureImageURL:product.featureImageURL, title:product.title}
		// updateStockCount(product.id);

		return {
			// ...selectedFields,
			...stockItem,
		}
	})
	// setCombinedData(d)

	console.log('-----MM> ', combinedData)

	return {
		data: combinedData,
		lastSnapDoc: stockData?.lastVisible,
		error: error?.message,
		isLoading: !stockData && !error,
		isValidating,
	}
}

// export function useGetAllStock({ pageLimit, lastSnapDoc }) {
//   const [products, setProducts] = useState([]);
//   const { data: stockData, error, isValidating } = useSWR(
//     lastSnapDoc ? [`stock`, pageLimit, lastSnapDoc] : [`stock`, pageLimit],
//     ([path, pageLimit, lastSnapDoc]) => fetcher(path, pageLimit, lastSnapDoc)
//   );

//   useEffect(() => {
//     // Fetch all products when the hook initializes
//     const fetchProducts = async () => {
//       try {
//         const productList = await getProducts();
//         setProducts(productList);
//       } catch (err) {
//         console.error("Failed to fetch products:", err);
//       }
//     };
//     fetchProducts();
//   }, []);

// //this will update th stock count/ available stock of the stock. it actually take the latest stock from the stock history list and use it as the new available stock, so its always on the watch to find any changes in the stock history
//   const updateStockCount = async (productId) => {
//     try {
//       const stockRef = doc(db, "stock", productId);
//       const history = await getStockHistory(productId);

// // now try to get the latest stock in the history and

//       if (!stockDoc.exists()) {
//         const defaultStockData = {
//           available_stock: lastesttock || 0,
//           timestampCreate: Timestamp.now(),
//         };
//         await setDoc(stockRef, defaultStockData);
//         console.log(`Created new stock document for product: ${productId}`);
//         return defaultStockData;
//       }
//       return stockDoc.data();
//     } catch (error) {
//       console.error(`Failed to ensure stock exists for product: ${productId}`, error);
//       return null;
//     }
//   };

//   const ensureStockExists = async (productId, productName, productImage) => {
//     try {
//       const stockRef = doc(db, "stock", productId);
//       const stockDoc = await getDoc(stockRef);

//       if (!stockDoc.exists()) {
//         const defaultStockData = {
//           product_name: productName || "Unknown Product",
//           product_image: productImage || "",
//           available_stock: 100,
//           low_stock: 1,
//           price: 0,
//           sale_price: 0,
//           isPublished: true,
//           timestampCreate: Timestamp.now(),
//         };
//         await setDoc(stockRef, defaultStockData);
//         console.log(`Created new stock document for product: ${productId}`);
//         return defaultStockData;
//       }
//       return stockDoc.data();
//     } catch (error) {
//       console.error(`Failed to ensure stock exists for product: ${productId}`, error);
//       return null;
//     }
//   };

//   const combinedData = products.map((product) => {
//     const stockItem = stockData?.data?.find((stock) => stock.id === product.id);

//     updateCurrentStock(product.id)

//     if (!stockItem) {
//       // Ensure stock exists if it doesn't in the stock data
//       ensureStockExists(product.id, product.title, product.featureImageURL);
//     }

//     return {
//       ...product,
//       ...stockItem,
//     };
//   });

//   return {
//     data: combinedData,
//     lastSnapDoc: stockData?.lastVisible,
//     error: error?.message,
//     isLoading: !stockData && !error,
//     isValidating,
//   };
// }

// Function to get all products with stock
// export const useGetAllStock = async () => {
//   const stockCollection = collection(db, "stock");
//   const productCollection = collection(db, "products");

//   // Get all products
//   const productDocs = await getDocs(query(productCollection, orderBy("timestampCreate", "desc")));
//   const products = productDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

//   // Process each product to ensure stock exists
//   const stockPromises = products.map(async (product) => {
//     const stockRef = doc(stockCollection, product.id);
//     const stockDoc = await getDoc(stockRef);

//     if (!stockDoc.exists()) {
//       // Create default stock document if it doesn't exist
//       const defaultStock = {
//         product_name: product.product_name || "Unknown Product",
//         product_image: product.image || "",
//         available_stock: 0,
//         low_stock: 0,
//         price: 0,
//         sale_price: 0,
//         timestampCreate: product.timestampCreate || null,
//       };
//       await setDoc(stockRef, defaultStock);
//       return { id: product.id, ...defaultStock };
//     }

//     return { id: stockDoc.id, ...stockDoc.data() };
//   });

//   return Promise.all(stockPromises);
// };

export function useGetStock({ stockId }) {
	const { data, error } = useSWR(
		['stock', stockId], // Key to uniquely identify this request
		([path, id]) => fetcher(`${path}/${id}`), // Fetch single product by ID
	)

	return {
		data, // Single product data
		error,
		isLoading: !error && !data,
	}
}

export function useProductsByIds({ idsList }) {
	const { data, error } = useSWR(
		['products', idsList], // Key to uniquely identify this request
		([path, ids]) => {
			// Assuming the fetcher can be extended to support `where` queries
			const promises = ids.map((id) => fetcher(`${path}/${id}`))
			return Promise.all(promises) // Fetch all products with the given IDs
		},
	)

	return {
		data, // Array of product data
		error,
		isLoading: !error && !data,
	}
}

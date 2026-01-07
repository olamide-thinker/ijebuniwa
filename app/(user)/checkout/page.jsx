// // import { ProductCard } from "@/app/components/Products";
// // import { algoliasearch } from "algoliasearch";

// // // Fetch products directly in the Server Component
// // const getProducts = async (text) => {
// //   if (!text) {
// //     return [];
// //   }
// //   const client = algoliasearch(
// //     process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
// //     process.env.NEXT_PUBLIC_ALGOLIA_APP_KEY
// //   );
// //   const search = await client.searchForHits({
// //     requests: [
// //       {
// //         indexName: "products",
// //         query: text,
// //         hitsPerPage: 20,
// //       },
// //     ],
// //   });
// //   return search.results[0]?.hits ?? [];
// // };

// // export default async function Page({ searchParams }) {
// //   const { q } = searchParams;
// //   const products = await getProducts(q);

// //   return (
// //     <main className="flex flex-col min-h-screen gap-1 p-5">
// //       <div className="flex flex-col items-center justify-center gap-1">
// //         {/* <SearchBox /> */}
// //       </div>
// //       {products?.length !== 0 && (
// //         <div className="flex justify-center w-full">
// //           <div className="flex flex-col gap-5 p-5">
// //             <h1 className="text-sm text-center">
// //               Results for {q}: {products.length} {products.length > 0 ? 'products' : 'product'} found
// //             </h1>
// //             <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-5">
// //               {products?.map((item) => (
// //                 <ProductCard product={item} key={item?.id} />
// //               ))}
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </main>
// //   );
// // }

// import { ProductCard } from "@/app/components/Products";
// import { algoliasearch } from "algoliasearch";

// // Fetch products directly in the Server Component
// const getProducts = async (text) => {
//   if (!text) {
//     return [];
//   }
//   const client = algoliasearch(
//     process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
//     process.env.NEXT_PUBLIC_ALGOLIA_APP_KEY
//   );
//   const search = await client.searchForHits({
//     requests: [
//       {
//         indexName: "products",
//         query: text,
//         hitsPerPage: 20,
//       },
//     ],
//   });
//   return search.results[0]?.hits ?? [];
// };

// export default async function CheckoutPage({ searchParams }) {
//   const { q } = searchParams;

//   console.log('popo ', q)
//   const products = await getProducts(q);

//   return (
//     <main className="flex flex-col min-h-screen gap-1 p-5">
//       Hello
//       <div className="flex flex-col items-center justify-center gap-1">
//         {/* <SearchBox /> */}
//       </div>
//       {products?.length !== 0 && (
//         <div className="flex justify-center w-full">
//           <div className="flex flex-col gap-5 p-5">
//             <h1 className="text-sm text-center">
//               Results for {q}: {products.length} {products.length > 0 ? 'products' : 'product'} found
//             </h1>
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-5">
//               {products?.map((item) => (
//                 <ProductCard product={item} key={item?.id} />
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }

'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useProductStore } from '@/lib/firestore/products/read'
import { useUser } from '@/lib/firestore/user/read'
import { getGuestCart } from '@/lib/guestCart'
import { CircularProgress } from '@nextui-org/react'
import { useSearchParams } from 'next/navigation'
import Checkout from './components/Checkout'

import { useEffect, useMemo, useState } from 'react'

export default function Page() {
	const { user } = useAuth()
	console.log('User authentication status: ', user)

	const { data, isLoading: lng, error: err } = useUser({ uid: user?.uid })
	const { fetchProductsByIds, products, loading, error } = useProductStore()

	const searchParams = useSearchParams()
	const type = searchParams.get('type')
	const productId = searchParams.get('productId')

	// Memoize productIdsList to prevent endless loops in useEffect
	const productIdsList = useMemo(() => {
		if (type === 'buynow') {
			return [productId]
		}
		// Use guest cart if not logged in
		if (!user?.uid) {
			const guestCart = getGuestCart()
			return guestCart?.map((item) => item?.id) || []
		}
		return data?.carts?.map((item) => item?.id) || []
	}, [type, productId, data, user])

	useEffect(() => {
		async function getProduct() {
			if (productIdsList.length > 0) {
				await fetchProductsByIds(productIdsList)
			}
		}
		getProduct()
	}, [productIdsList, fetchProductsByIds])

	// useEffect(() => {
	//   const unsubscribe = onAuthStateChanged(auth, (user) => {
	//     setCurrentUser(user || null);
	//   });
	//   return () => unsubscribe();
	// }, []);

	// const {
	//   data: products,
	//   error,
	//   isLoading,
	// } = useProductsByIds({
	//   idsList: productIdsList,
	// });

	if (loading) {
		return (
			<div>
				<CircularProgress />
			</div>
		)
	}

	// if (error) {
	//   return <div>{error}</div>;
	// }

	if (!productIdsList || productIdsList?.length === 0) {
		return (
			<div>
				<h1>Products Not Found</h1>
			</div>
		)
	}

	const productList =
		type === 'buynow'
			? [
					{
						id: productId,
						quantity: 1,
						product: products[0],
					},
				]
			: (user?.uid ? data?.carts : getGuestCart())?.map((item) => {
					return {
						...item,
						product: products?.find((e) => e?.id === item?.id),
					}
				})
	console.log('Product IDs List:', productIdsList)
	console.log('Fetched Products:', products)
	console.log('Final Product List:', productList)
	
	// Show loading until products are fetched
	if (loading || (productIdsList.length > 0 && (!products || products.length === 0))) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<CircularProgress />
			</div>
		)
	}
	
	return (
		<main className="flex flex-col gap-4 p-5">
			<h1 className="text-xl">Checkout</h1>
			<Checkout productList={productList} user />
		</main>
	)
}

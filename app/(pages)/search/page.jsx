'use client'
// import { ProductCard } from "@/app/components/Products";
// import { algoliasearch } from "algoliasearch";

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
//   const hits = search.results[0]?.hits;
//   return hits ?? [];
// };

// export default async function Page({ searchParams }) {
//   const { q } = searchParams;
//   const products = await getProducts(q);
//   return (
//     <main className="flex flex-col min-h-screen gap-1 p-5">
//       {/* <SearchBox /> */}
//       <div className="flex flex-col items-center justify-center gap-1">
//        </div>
//       {products?.length != 0 && (
//         <div className="flex justify-center w-full">
//           <div className="flex flex-col gap-5 p-5">
//             <h1 className="text-sm text-center">
//               Results for {q} : {products.length } {products.length > 0 ? 'products' : 'product'}  was found
//             </h1>
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-5">
//               {products?.map((item) => {
//                 return <ProductCard product={item} key={item?.id} />;
//               })}
//             </div>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }

// import { useState, useEffect } from "react";
// import { ProductCard } from "@/app/components/Products";
// import { CircularProgress } from "@nextui-org/react";
// import { algoliasearch } from "algoliasearch";
// import { SearchParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
// import { useSearchParams } from "next/navigation";

// const client = algoliasearch(
//   process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
//   process.env.NEXT_PUBLIC_ALGOLIA_APP_KEY
// );

// const fetchProducts = async (text) => {
//   if (!text) return [];
//   const search = await client.search([
//     {
//       indexName: "products",
//       query: text,
//       hitsPerPage: 20,
//     },
//   ]);
//   return search.results[0]?.hits ?? [];
// };

// export default function Page() {
//   const { q } = useSearchParams();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (q) {
//       fetchProducts(q).then((data) => {
//         setProducts(data);
//         setLoading(false);
//       });
//     } else {
//       setLoading(false);
//     }
//   }, [q]);

//   if (loading) {
//     return (
//       <div className="flex justify-center w-full p-10">
//         <CircularProgress />
//       </div>
//     );
//   }

//   return (
//     <main className="flex flex-col min-h-screen gap-1 p-5">
//       <div className="flex flex-col items-center justify-center gap-1">
//         {/* <SearchBox /> */}
//       </div>
//       {products.length > 0 ? (
//         <div className="flex justify-center w-full">
//           <div className="flex flex-col gap-5 p-5">
//             <h1 className="text-sm text-center">
//               Results for "{q}": {products.length}{" "}
//               {products.length > 1 ? "products" : "product"} found
//             </h1>
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-5">
//               {products.map((item) => (
//                 <ProductCard product={item} key={item.objectID} />
//               ))}
//             </div>
//           </div>
//         </div>
//       ) : (
//         <h1 className="text-center text-gray-600">No products found for "{q}"</h1>
//       )}
//     </main>
//   );
// }

import { useState, useEffect, Suspense } from 'react'
import { ProductCard } from '@/app/components/Products'
import { CircularProgress } from '@nextui-org/react'
import { useSearchParams } from 'next/navigation'
import { algoliasearch } from 'algoliasearch'

const client = algoliasearch(
	process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
	process.env.NEXT_PUBLIC_ALGOLIA_APP_KEY,
)

const fetchProducts = async (text) => {
	if (!text) return []
	const search = await client.search([
		{
			indexName: 'products',
			query: text,
			hitsPerPage: 20,
		},
	])
	return search.results[0]?.hits ?? []
}

function ProductSearch() {
	const searchParams = useSearchParams()
	const q = searchParams.get('q')
	const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (q) {
			fetchProducts(q).then((data) => {
				setProducts(data)
				setLoading(false)
			})
		} else {
			setLoading(false)
		}
	}, [q])

	if (loading) {
		return (
			<div className="flex justify-center w-full p-10">
				<CircularProgress />
			</div>
		)
	}

	return (
		<main className="flex flex-col min-h-screen gap-1 p-5">
			<div className="flex flex-col items-center justify-center gap-1">{/* <SearchBox /> */}</div>
			{products.length > 0 ? (
				<div className="flex justify-center w-full">
					<div className="flex flex-col gap-5 p-5">
						<h1 className="text-sm text-center">
							Results for "{q}": {products.length} {products.length > 1 ? 'products' : 'product'}{' '}
							found
						</h1>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-5">
							{products.map((item) => (
								<ProductCard product={item} key={item.objectID} />
							))}
						</div>
					</div>
				</div>
			) : (
				<h1 className="text-center text-gray-600">No products found for "{q}"</h1>
			)}
		</main>
	)
}

export default function Page() {
	return (
		<Suspense
			fallback={
				<div className="flex justify-center w-full p-10">
					<CircularProgress />
				</div>
			}
		>
			<ProductSearch />
		</Suspense>
	)
}

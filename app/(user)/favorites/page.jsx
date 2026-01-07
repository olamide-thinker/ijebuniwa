'use client'

import { ProductCard } from '@/app/components/Products'
import { useAuth } from '@/contexts/AuthContext'
import { useProduct, useProductStore } from '@/lib/firestore/products/read'
import { useUser } from '@/lib/firestore/user/read'
import { CircularProgress } from '@nextui-org/react'
import { useEffect, useState } from 'react'

export default function Page() {
	const { user } = useAuth()
	const { data, isLoading } = useUser({ uid: user?.uid })
	if (isLoading) {
		return (
			<div className="flex justify-center w-full p-10">
				<CircularProgress />
			</div>
		)
	}
	return (
		<main className="flex flex-col items-center justify-center gap-3 p-5">
			<h1 className="text-2xl font-semibold">Favorites</h1>
			{(!data?.favorites || data?.favorites?.length === 0) && (
				<div className="flex flex-col items-center justify-center w-full h-full gap-5 py-20">
					<div className="flex justify-center">
						<img className="h-[200px]" src="/svgs/Empty-pana.svg" alt="" />
					</div>
					<h1 className="font-semibold text-gray-600">Please Add Products To Favorites</h1>
				</div>
			)}
			<div className="grid w-full grid-cols-1 gap-4 p-5 md:grid-cols-3 lg:grid-cols-4">
				{data?.favorites?.map((productId) => {
					return <ProductItem productId={productId} key={productId} />
				})}
			</div>
		</main>
	)
}

function ProductItem({ productId }) {
	const [product, setProduct] = useState()
	// const { data: product } = useProduct({ productId: productId });
	const { fetchProduct } = useProductStore()

	useEffect(() => {
		async function getProduct() {
			const data = await fetchProduct(productId)
			setProduct(data)
		}
		getProduct()
	}, [])

	return <ProductCard product={product} />
}

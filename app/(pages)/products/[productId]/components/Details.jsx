import AddToCartButton from '@/app/components/AddToCartButton'
import Editor from '@/app/components/editorJs/editorjs'
import FavoriteButton from '@/app/components/FavoriteButton'
import MyRating from '@/app/components/MyRating'
import AuthContextProvider from '@/contexts/AuthContext'
import { getBrand } from '@/lib/firestore/brands/read_server'
import { getCategory } from '@/lib/firestore/categories/read_server'
import { getProductReviewCounts } from '@/lib/firestore/products/count/read'
import { formatMoney } from '@/lib/helpers'
import { Button } from '@nextui-org/react'
import Link from 'next/link'
import { Suspense } from 'react'

export default function Details({ product }) {
	return (
		<div className="flex flex-col w-full gap-3">
			<h2>Details:</h2>
			{product?.stock <= (product?.orders ?? 0) && (
				<div className="flex">
					<h3 className="py-1 text-sm font-semibold text-red-500 rounded-lg">Out Of Stock</h3>
				</div>
			)}
			<div className="flex flex-col gap-2 py-2">
				<div
					className="text-gray-600"
					dangerouslySetInnerHTML={{ __html: product?.description ?? '' }}
				></div>
			</div>
		</div>
	)
}

export async function SideDetails({ product }) {
	// console.log('PPPPPP>>>> ', product)]
	return (
		<div className="flex flex-col justify-between w-full h-full gap-8">
			<div className="flex w-full gap-3 p-2 border-b">
				<Category categoryId={product?.categoryId} />
				<Brand brandId={product?.brandId} />
			</div>
			<div className="py-3">
				<h1 className="text-xl font-semibold md:text-4xl">{product?.title}</h1>
				<Suspense fallback="Failed To Load">
					<RatingReview product={product} />
				</Suspense>

				<div className="flex w-full items-center gap-3 p-2 border-t border-b">
					<div className="">
						<h2 className="text-lg font-bold">
							{product.onSale ? formatMoney(product?.salePrice) : formatMoney(product?.price)}{' '}
						</h2>
						<p className="text-xs text-gray-600 line-through">
							{product.onSale && formatMoney(product?.price)}
						</p>
					</div>

					{product?.stock <= (product?.orders < 0) && (
						<div className="flex">
							<h3 className="text-xs font-semibold text-red-500 rounded-lg">
								This product is out Of Stock
							</h3>
						</div>
					)}
				</div>
			</div>
			<p className="mb-4 text-sm text-center text-gray-600 line-clamp-3 md:line-clamp-4">
				{product?.shortDescription}
			</p>
			<div className="">
				<p className="px-4 py-1 ml-2 text-xs rounded-t-md bg-secondary w-fit">
					Full Product Description
				</p>
				<Editor
					readOnly={true}
					data={product && product?.description} // Pass the initial description data
					// onChange={(content) => {}}
				/>
			</div>

			{/* <div className="flex flex-wrap items-center gap-4"> */}
			<div className="flex flex-col w-full  gap-3 p-2 border-t ">
				<div className="flex w-full items-center gap-3 p-2 border-b">
					<div className="">
						<h2 className="text-lg font-bold">
							{product.onSale ? formatMoney(product?.salePrice) : formatMoney(product?.price)}{' '}
						</h2>
						<p className="text-xs text-gray-600 line-through">
							{product.onSale && formatMoney(product?.price)}
						</p>
					</div>
				</div>

				<div className="flex flex-col md:flex-row justify-between  gap-4">
					<AuthContextProvider>
						<FavoriteButton productId={product?.id} />
					</AuthContextProvider>
					<div className="space-x-2  w-fit whitespace-nowrap">
						<Link
							href={
								product?.stock <= (product?.orders < 0)
									? ''
									: `/checkout?type=buynow&productId=${product?.id}`
							}
						>
							<Button
								isDisabled={product?.stock <= (product?.orders < 0)}
								size="lg"
								className=" bg-[#FDC321] font-bold"
							>
								{product?.stock <= (product?.orders < 0) ? 'Out of Stock' : 'Buy Now'}
							</Button>
						</Link>
						<AuthContextProvider>
							<AddToCartButton
								type={'cute'}
								productId={product?.id}
								isDisabled={product?.stock <= (product?.orders < 0)}
							/>
						</AuthContextProvider>
					</div>
				</div>
			</div>
		</div>
	)
}

export async function Category({ categoryId }) {
	const category = await getCategory({ id: categoryId })
	return (
		<Link href={`/categories/${categoryId}`}>
			<div className="flex items-center gap-1 px-3 py-1 border rounded-full">
				<img className="h-4" src={category?.imageURL} alt="" />
				<h4 className="text-xs font-semibold">{category?.name}</h4>
			</div>
		</Link>
	)
}

export async function Brand({ brandId }) {
	const brand = await getBrand({ id: brandId })
	return (
		<div className="flex items-center gap-1 px-3 py-1 border rounded-full">
			<img className="h-4" src={brand?.imageURL} alt="" />
			<h4 className="text-xs font-semibold">{brand?.name}</h4>
		</div>
	)
}

export async function RatingReview({ product }) {
	const counts = await getProductReviewCounts({ productId: product?.id })
	return (
		<div className="flex items-center gap-3">
			<MyRating value={counts?.averageRating ?? 0} />
			<h1 className="text-sm text-gray-400">
				<span>{counts?.averageRating?.toFixed(1)}</span> ({counts?.totalReviews})
			</h1>
		</div>
	)
}

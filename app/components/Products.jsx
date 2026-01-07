import Link from 'next/link'
import FavoriteButton from './FavoriteButton'
import AuthContextProvider from '@/contexts/AuthContext'
import AddToCartButton from './AddToCartButton'
import { getProductReviewCounts } from '@/lib/firestore/products/count/read'
import { Suspense } from 'react'
import MyRating from './MyRating'
import { formatMoney } from '@/lib/helpers'
import { SocialShareProductCard } from './socialShare-productcard'

export default function ProductsGridView({ products }) {
	return (
		<section className="flex justify-center w-full ">
			<div className="flex flex-col gap-5 max-w-[1300px] p-5">
				<h1 className="text-xs font-semibold text-left">
					{' '}
					{products.length} {products.length > 1 ? 'Products' : 'Product'} listed
				</h1>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-5">
					{' '}
					{products?.map((item, i) => {
						return <ProductCard product={item} key={i} />
					})}
				</div>
			</div>
		</section>
	)
}

export function ProductCard({ product }) {
	return (
		<div className="flex flex-col gap-3 p-2 border cursor-default rounded-xl hover:bg-zinc-100">
			<div className="relative flex flex-col w-full">
				<Link href={`/products/${product?.id}`}>
					<img
						src={product?.featureImageURL}
						className="object-cover w-full h-48 rounded-lg"
						alt={product?.title}
					/>
				</Link>
				<div className="absolute flex flex-col gap-2 top-1 right-1">
					<AuthContextProvider>
						<FavoriteButton productId={product?.id} />
					</AuthContextProvider>
					<SocialShareProductCard
						url={`https://www.laptopwarehouseonline.net/products/${product?.id}`}
						title={product?.title}
					/>
				</div>
			</div>
			<div className="h-full">
				<Link href={`/products/${product?.id}`}>
					<span className="text-sm font-serif font-bold line-clamp-2">{product?.title} </span>
				</Link>

				<span className="text-xs text-gray-500 line-clamp-4">
					{product?.shortDescription}
					{product?.brand}
				</span>
			</div>

			<Suspense>
				<RatingReview product={product} />
			</Suspense>

			{product?.stock <= (product?.orders < 0) && (
				<div className="flex">
					<h3 className="text-xs font-semibold text-red-500 rounded-lg">Out Of Stock</h3>
				</div>
			)}
			<div className="flex justify-between">
				<div className="">
					<h2 className="font-serif font-bold text-md">
						{product?.onSale ? formatMoney(product?.salePrice) : formatMoney(product?.price)}{' '}
					</h2>
					<p className="text-xs text-gray-600 line-through">
						{product?.onSale && formatMoney(product?.price)}
					</p>
				</div>
				<div className="flex items-center gap-4 ">
					<div className="w-">
						<Link href={`/checkout?type=buynow&productId=${product?.id}`}>
							<button
								disabled={product?.stock <= (product?.orders < 0)}
								className={`flex-1   ${product?.stock <= (product?.orders < 0) ? 'bg-secondary' : 'bg-[#1e1b4b] text-white'} px-4 py-2 rounded-lg text-xs font-bold w-full hover:bg-[#c05621] transition-colors`}
							>
								Buy Now
							</button>
						</Link>
					</div>

					<AuthContextProvider>
						<AddToCartButton
							productId={product?.id}
							isDisabled={product?.stock <= (product?.orders < 0)}
						/>
					</AuthContextProvider>
				</div>
			</div>
		</div>
	)
}

export function ProductCard_Large({ product, brandLogo }) {
	return (
		<div className="flex flex-row-reverse gap-3 p-2 border cursor-default rounded-xl hover:bg-zinc-100">
			<img
				src={brandLogo}
				className="rounded-lg h-[32px] w-auto aspect-square  object-cover"
				alt={product?.title}
			/>

			<div className="relative w-[400px]">
				<Link href={`/products/${product?.id}`}>
					<img
						src={product?.featureImageURL}
						className="rounded-lg h-[200px] w-full object-cover"
						alt={product?.title}
					/>
				</Link>
				<div className="absolute top-1 right-1">
					<AuthContextProvider>
						<FavoriteButton productId={product?.id} />
					</AuthContextProvider>
				</div>
			</div>

			<div className="w-1/2 ">
				<parent className="h-full">
					<Link href={`/products/${product?.id}`}>
						<span className="text-sm font-serif font-bold line-clamp-2">{product?.title} </span>
					</Link>

					<span className="text-xs text-gray-500 line-clamp-2">
						hello
						{product?.shortDescription}
						{product?.brand}
					</span>
				</parent>

				<Suspense>
					<RatingReview product={product} />
				</Suspense>

				{product?.stock <= (product?.orders < 0) && (
					<div className="flex">
						<h3 className="text-xs font-semibold text-red-500 rounded-lg">Out Of Stock</h3>
					</div>
				)}
				<div className="">
					<div className="flex items-center gap-4 ">
						<h2 className="font-serif font-bold text-md">₦ {formatMoney(product?.salePrice)} </h2>
						<p className="text-xs text-gray-600 line-through">₦ {formatMoney(product?.price)}</p>
					</div>

					<AuthContextProvider>
						<div className="flex items-center gap-4">
							<div className="w-">
								<Link href={`/checkout?type=buynow&productId=${product?.id}`}>
									<button className="flex-1 w-full px-4 py-2 text-xs font-bold text-white bg-[#1e1b4b] rounded-lg whitespace-nowrap hover:bg-[#c05621] transition-colors">
										Buy Now
									</button>
								</Link>
							</div>
							<AddToCartButton
								productId={product?.id}
								type={'large'}
								isDisabled={product?.stock <= (product?.orders < 0)}
							/>
							<FavoriteButton productId={product?.id} />
						</div>
					</AuthContextProvider>

					{/* <div className="flex items-center gap-4 ">
        <div className="w-">
          <Link href={`/checkout?type=buynow&productId=${product?.id}`}>
            <button className="flex-1 w-full px-4 py-2 text-xs font-semibold text-white bg-orange-500 rounded-lg">
              Buy Now
            </button>
          </Link>
        </div>

        <AuthContextProvider>
          <AddToCartButton productId={product?.id} />
        </AuthContextProvider>
      </div> */}
				</div>
			</div>
		</div>
	)
}

export async function getServerSideProps(context) {
	const { id } = context.params
	const counts = await getProductReviewCounts({ productId: id })

	return {
		props: {
			counts,
		},
		revalidate: 60, // Rebuild the page every 60 seconds
	}
}
function RatingReview({ counts }) {
	return (
		<div className="flex items-center gap-3">
			<MyRating value={counts?.averageRating ?? 0} />
			<h1 className="text-xs text-gray-400">
				<span>{counts?.averageRating?.toFixed(1)}</span> ({counts?.totalReviews})
			</h1>
		</div>
	)
}

// async function RatingReview({ product }) {
//   const counts = await getProductReviewCounts({ productId: product?.id });
//   return (
//     <div className="flex items-center gap-3">
//       <MyRating value={counts?.averageRating ?? 0} />
//       <h1 className="text-xs text-gray-400">
//         <span>{counts?.averageRating?.toFixed(1)}</span> ({counts?.totalReviews}
//         )
//       </h1>
//     </div>
//   );
// }

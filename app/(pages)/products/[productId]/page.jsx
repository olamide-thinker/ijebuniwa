import { getProduct } from '@/lib/firestore/products/read_server'
import Photos from './components/Photos'
import Details, { Brand, Category, RatingReview, SideDetails } from './components/Details'
import Reviews from './components/Reviews'
import RelatedProducts from './components/RelatedProducts'
import AddReview from './components/AddReiveiw'
import AuthContextProvider from '@/contexts/AuthContext'
import FavoriteButton from '@/app/components/FavoriteButton'
import Link from 'next/link'
import { Suspense } from 'react'
import AddToCartButton from '@/app/components/AddToCartButton'

export async function generateMetadata({ params }) {
	const { productId } = params

	console.log('producdfysgd ::: ', productId)
	const product = await getProduct({ id: productId })

	return {
		title: `${product?.title} | Product`,
		description: product?.shortDescription ?? '',
		openGraph: {
			images: [product?.featureImageURL],
		},
	}
}

export default async function Page({ params }) {
	const { productId } = await params
	const product = await getProduct({ id: productId })
	return (
		<main className="p-0 md:p-10">
			<section className=" gap-3 relative p-2">
				<div className="w-full space-y-4 flex flex-col md:flex-row p-4 md:p-8 bg-secondary rounded-xl gap-4 h-fit">
					<div className="bg-background  p-4 rounded-xl w-full md:sticky md:top-24 md:h-fit">
						<Photos imageList={[product?.featureImageURL, ...(product?.imageList ?? [])]} />
					</div>

					<div className="bg-background p-4 rounded-xl w-full">
						<SideDetails product={product} />
					</div>
				</div>
				{/* <Details product={product} /> */}
			</section>
			<AuthContextProvider>
				<div className="space-y-4 w-full  p-8 ">
					<AddReview productId={productId} />
					<Reviews productId={productId} />
				</div>
			</AuthContextProvider>
			{/* <div className="flex justify-center py-10">
        <AuthContextProvider>
          <div className="flex flex-col md:flex-row gap-4 md:max-w-[900px] w-full">
            <AddReview productId={productId} />
            <Reviews productId={productId} />
          </div>
        </AuthContextProvider>
      </div> */}
			<RelatedProducts categoryId={product?.categoryId} />
		</main>
	)
}

import { ProductCard } from '@/app/components/Products'
import { getCollection } from '@/lib/firestore/collections/read_server'
import { getProduct } from '@/lib/firestore/products/read_server'

export async function generateMetadata({ params }) {
	const { collectionId } = params
	const collection = await getCollection({ id: collectionId })
	console.log('colelctersjhd  ', collectionId)
	return {
		title: `${collection?.title} | Collection`,
		description: collection?.subTitle ?? '',
		openGraph: {
			images: [collection?.imageURL],
		},
	}
}

export default async function Page({ params }) {
	const { collectionId } = await params
	const collection = await getCollection({ id: collectionId })
	console.log('colelcte  ', collection)
	return (
		<main className="flex justify-center w-full p-5 md:px-10 md:py-5">
			<div className="flex flex-col gap-6 p-5">
				<div className="flex justify-center w-full">
					<img className="h-[110px]" src={collection?.imageURL} alt="" />
				</div>
				<h1 className="text-4xl font-semibold text-center">{collection?.title}</h1>
				<h1 className="text-center text-gray-500">{collection?.subTitle}</h1>
				<div className="grid items-center justify-center grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 justify-self-center md:gap-5">
					{collection?.products?.map((productId) => {
						return <Product productId={productId} key={productId} />
					})}
				</div>
			</div>
		</main>
	)
}

async function Product({ productId }) {
	const product = await getProduct({ id: productId })
	return <ProductCard product={product} />
}

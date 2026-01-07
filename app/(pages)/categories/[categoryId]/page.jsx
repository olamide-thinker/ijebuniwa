import { ProductCard } from '@/app/components/Products'
import { getCategory } from '@/lib/firestore/categories/read_server'
import { getProductsByCategory } from '@/lib/firestore/products/read_server'

export async function generateMetadata({ params }) {
	const { categoryId } = params
	const category = await getCategory({ id: categoryId })

	return {
		title: `${category?.name} | Category`,
		openGraph: {
			images: [category?.imageURL],
		},
	}
}

export default async function Page({ params }) {
	const { categoryId } = params
	console.log('Catetsvtgd  ', categoryId)
	const category = await getCategory({ id: categoryId })
	const products = await getProductsByCategory({ categoryId: categoryId })
	return (
		<main className="flex justify-center w-full min-h-[65vh] p-5 md:px-10 md:py-5">
			<div className="flex flex-col gap-6 p-5">
				<h1 className="text-4xl font-semibold text-center">{category.name}</h1>
				<div className="grid items-center justify-center grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 justify-self-center md:gap-5">
					{products?.map((item) => {
						return <ProductCard product={item} key={item?.id} />
					})}
				</div>
			</div>
		</main>
	)
}

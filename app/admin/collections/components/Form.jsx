'use client'

import { getCollection } from '@/lib/firestore/collections/read_server'
import { createNewCollection, updateCollection } from '@/lib/firestore/collections/write'
import { useProduct, useProducts, useProductStore } from '@/lib/firestore/products/read'
import { Button } from '@nextui-org/react'
import { X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/card'

export default function Form() {
	const [data, setData] = useState(null)
	const [image, setImage] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	// const { data: products } = useProducts({ pageLimit: 2000 });
	const { fetchProducts, products } = useProductStore()

	console.log('XXXXXXXXX>>>>', products)

	useEffect(() => {
		fetchProducts()
	}, [])

	const router = useRouter()

	const searchParams = useSearchParams()
	const id = searchParams.get('id')

	const fetchData = async () => {
		try {
			const res = await getCollection({ id: id })
			if (!res) {
				toast.error('Collection Not Found!')
			} else {
				setData(res)
			}
		} catch (error) {
			toast.error(error?.message)
		}
	}

	useEffect(() => {
		if (id) {
			fetchData()
		}
	}, [id])

	const handleData = (key, value) => {
		setData((preData) => {
			return {
				...(preData ?? {}),
				[key]: value,
			}
		})
	}

	const handleCreate = async () => {
		setIsLoading(true)
		try {
			await createNewCollection({ data: data, image: image })
			toast.success('Successfully Created')
			setData(null)
			setImage(null)
		} catch (error) {
			toast.error(error?.message)
		}
		setIsLoading(false)
	}

	const handleUpdate = async () => {
		setIsLoading(true)
		try {
			await updateCollection({ data: data, image: image })
			toast.success('Successfully Updated')
			setData(null)
			setImage(null)
			router.push(`/admin/collections`)
		} catch (error) {
			toast.error(error?.message)
		}
		setIsLoading(false)
	}

	return (
		<div className="flex flex-col gap-3 bg-white rounded-xl p-5 w-full md:w-[400px]">
			<h1 className="font-semibold">{id ? 'Update' : 'Create'} Collection</h1>
			<form
				onSubmit={(e) => {
					e.preventDefault()
					if (id) {
						handleUpdate()
					} else {
						handleCreate()
					}
				}}
				className="flex flex-col gap-3"
			>
				<div className="flex flex-col gap-1">
					<label htmlFor="category-name" className="text-sm text-gray-500">
						Image <span className="text-red-500">*</span>{' '}
					</label>
					{image && (
						<div className="flex items-center justify-center p-3">
							<img className="h-20" src={URL.createObjectURL(image)} alt="" />
						</div>
					)}
					<input
						onChange={(e) => {
							if (e.target.files.length > 0) {
								setImage(e.target.files[0])
							}
						}}
						id="category-image"
						name="category-image"
						type="file"
						className="w-full px-4 py-2 border rounded-lg"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<label htmlFor="collection-title" className="text-sm text-gray-500">
						Title <span className="text-red-500">*</span>{' '}
					</label>
					<input
						id="collection-title"
						name="collection-title"
						type="text"
						placeholder="Enter Title"
						value={data?.title ?? ''}
						onChange={(e) => {
							handleData('title', e.target.value)
						}}
						className="w-full px-4 py-2 border rounded-lg focus:outline-none"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<label htmlFor="collection-sub-title" className="text-sm text-gray-500">
						Sub Title <span className="text-red-500">*</span>{' '}
					</label>
					<input
						id="collection-sub-title"
						name="collection-sub-title"
						type="text"
						value={data?.subTitle ?? ''}
						onChange={(e) => {
							handleData('subTitle', e.target.value)
						}}
						placeholder="Enter Sub Title"
						className="w-full px-4 py-2 border rounded-lg focus:outline-none"
					/>
				</div>
				<div className="flex flex-wrap gap-3">
					{data?.products?.map((productId) => {
						return <ProductCard productId={productId} key={productId} setData={setData} />
					})}
				</div>
				<div className="flex flex-col gap-1">
					<label htmlFor="collection-sub-title" className="text-sm text-gray-500">
						Select Product <span className="text-red-500">*</span>{' '}
					</label>
					<select
						id="collection-products"
						name="collection-products"
						type="text"
						onChange={(e) => {
							setData((prevData) => {
								let list = [...(prevData?.products ?? [])]
								list.push(e.target.value)
								return {
									...prevData,
									products: list,
								}
							})
						}}
						className="w-full px-4 py-2 border rounded-lg focus:outline-none"
					>
						<option value="">Select Product</option>
						{products?.map((item) => {
							return (
								<option
									key={item?.id}
									disabled={data?.products?.includes(item?.id)}
									value={item?.id}
								>
									{item?.title}
								</option>
							)
						})}
					</select>
				</div>
				<Button isLoading={isLoading} isDisabled={isLoading} type="submit">
					{id ? 'Update' : 'Create'}
				</Button>
			</form>
		</div>
	)
}

function ProductCard({ productId, setData }) {
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

	return (
		// <div className="flex gap-3 px-4 py-1 text-sm text-white bg-blue-500 rounded-md">
		<Card className="w-full gap-0 space-y-0">
			<CardHeader className="items-start justify-between pb-0 mb-0">
				<div className="flex gap-5">
					<img
						src={product?.featureImageURL}
						alt={'o'}
						className="object-cover max-w-16 min-w-16 max-h-14"
					/>
				</div>
				<Button
					className={'bg-transparent text-foreground border-default-200'}
					color="primary"
					radius="full"
					isIconOnly
					size="sm"
					variant={'faded'}
					onPress={(e) => {
						e.preventDefault()
						setData((prevData) => {
							let list = [...prevData?.products]
							list = list?.filter((item) => item != productId)
							return {
								...prevData,
								products: list,
							}
						})
					}}
				>
					<X size={12} />
				</Button>
			</CardHeader>
			<CardBody className="pt-0 mt-0">
				<h2>{product?.title}</h2>
			</CardBody>
		</Card>
		// </div>
	)
}

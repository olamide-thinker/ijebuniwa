'use client'

import { useProduct, useProductStore } from '@/lib/firestore/products/read'
import { useAllReview } from '@/lib/firestore/reviews/read'
import { deleteReview } from '@/lib/firestore/reviews/write'
import { Rating } from '@mui/material'
import { Avatar, Button, CircularProgress } from '@nextui-org/react'
import { Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function ListView() {
	const { data: reviews } = useAllReview()

	return (
		<div className="flex flex-col flex-1 gap-3 px-5 md:pr-5 md:px-0 rounded-xl">
			<div className="flex flex-col gap-4">
				{reviews?.map((item) => {
					return <ReviewCard item={item} key={item?.id} />
				})}
			</div>
		</div>
	)
}

function ReviewCard({ item }) {
	const [isLoading, setIsLoading] = useState(false)
	// const { data: product } = useProduct({ productId: item?.productId });

	const [product, setProduct] = useState()
	// const { data: product } = useProduct({ productId: productId });
	const { fetchProduct } = useProductStore()

	useEffect(() => {
		async function getProduct() {
			const data = await fetchProduct(item?.productId)
			setProduct(data)
		}
		getProduct()
	}, [])

	const handleDelete = async () => {
		if (!confirm('Are you sure?')) return
		setIsLoading(true)
		try {
			await deleteReview({
				uid: item?.uid,
				productId: item?.productId,
			})
			toast.success('Successfully Deleted')
		} catch (error) {
			toast.error(error?.message)
		}
		setIsLoading(false)
	}

	return (
		<div className="flex gap-3 p-5 bg-white border rounded-xl">
			<div className="">
				<Avatar src={item?.photoURL} />
			</div>
			<div className="flex flex-col flex-1">
				<div className="flex justify-between">
					<div>
						<h1 className="font-semibold">{item?.displayName}</h1>
						<Rating value={item?.rating} readOnly size="small" />
						<Link href={`/products/${item?.productId}`}>
							<h1 className="text-xs">{product?.title}</h1>
						</Link>
					</div>
					<Button
						isIconOnly
						size="sm"
						color="danger"
						variant="flat"
						isDisabled={isLoading}
						isLoading={isLoading}
						onPress={handleDelete}
					>
						<Trash2 size={12} />
					</Button>
				</div>
				<p className="pt-1 text-sm text-gray-700">{item?.message}</p>
			</div>
		</div>
	)
}

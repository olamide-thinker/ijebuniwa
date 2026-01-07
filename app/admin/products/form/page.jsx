'use client'
import React, { useEffect, useState, useCallback } from 'react'
import BasicDetails from './components/BasicDetails'
import Images from './components/Images'
import Description from './components/Description'
import { Button } from '@nextui-org/react'
import toast from 'react-hot-toast'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useProductStore } from '@/lib/firestore/products/read'
import debounce from 'lodash.debounce'

export default function Page() {
	const {
		products,
		productData = {},
		featureImage,
		imageList,
		isLoading,
		setProductData,
		setFeatureImage,
		setImageList,
		resetProductData,
		fetchProduct,
		createProduct,
		updateProduct,
	} = useProductStore()

	const searchParams = useSearchParams()
	const router = useRouter()
	const id = searchParams.get('id')

	// Local state for description
	const [description, setDescription] = useState(null)

	// Fetch and initialize product data
	useEffect(() => {
		const initializeProductData = async () => {
			if (id) {
				const cachedProduct = products.find((product) => product.id === id)

				if (cachedProduct) {
					setProductData(cachedProduct)
					setDescription(cachedProduct.description || null)
					// setFeatureImage(cachedProduct.featureImage || "");
					// setImageList(cachedProduct.imageList || []);
				} else {
					try {
						const fetchedProduct = await fetchProduct(id)
						setProductData(fetchedProduct)
						setDescription(fetchedProduct.description || null)
						// setFeatureImage(cachedProduct.featureImage || "");
						// setImageList(cachedProduct.imageList || []);
					} catch (error) {
						toast.error(error.message || 'Failed to fetch product')
					}
				}
			} else {
				resetProductData()
				setDescription(null)
			}
		}

		initializeProductData()
	}, [id, products, fetchProduct, resetProductData])

	// Debounced function to update description
	const debouncedSetDescription = useCallback(
		debounce((value) => {
			setDescription(value)
		}, 300),
		[],
	)

	const handleData = (key, value) => {
		console.log('==-->', key, ' ', value)
		setProductData({
			...productData,
			[key]: value,
		})
	}

	console.log('called', description)

	// Handle form submission
	const handleSubmit = async () => {
		if (!productData) {
			toast.error('Product data is required')
			return
		}

		try {
			console.log({
				productData: { ...productData, description }, // Merge description on submission
				description,
				featureImage,
				imageList,
			})
			const action = id ? updateProduct : createProduct
			const success = await action({
				productData: { ...productData, description }, // Merge description on submission
				featureImage,
				imageList,
			})
			console.log(action, 'called', description)
			//also update product data
			setProductData({ ...productData, description })

			if (success) {
				toast.success(`Product successfully ${id ? 'updated' : 'created'}!`)
				if (id) {
					router.push('/admin/products')
				} else {
					resetProductData()
					setDescription(null)
					toast.success('Product successfully created!')
				}
			}
		} catch (error) {
			console.error(error)
			toast.error(error.message || 'An error occurred')
		}
	}

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				handleSubmit()
			}}
			className="flex flex-col gap-4 p-5"
		>
			<div className="flex items-center justify-between w-full">
				<div className="flex space-x-4">
					<button
						type="button"
						onPress={() => router.back()}
						className="flex items-center space-x-1"
					>
						<ArrowLeft />
					</button>
					<h1 className="font-semibold">{id ? 'Update Product' : 'Create New Product'}</h1>
				</div>
				<Button isLoading={isLoading} disabled={isLoading} type="submit">
					{id ? 'Update' : 'Create'}
				</Button>
			</div>

			<div className="flex flex-col md:flex-row gap-5 relative h-[80vh] overflow-auto">
				{/* Left Panel - Images */}
				<div className="sticky top-0 flex flex-1 overflow-auto">
					<Images
						data={productData}
						featureImage={featureImage}
						setFeatureImage={setFeatureImage}
						imageList={imageList}
						setImageList={setImageList}
					/>
				</div>

				{/* Right Panel - Details and Description */}
				<div className="flex flex-col flex-1 h-full gap-5">
					<BasicDetails data={productData} handleData={handleData} />
					<Description data={description} handleData={debouncedSetDescription} />
				</div>
			</div>
		</form>
	)
}

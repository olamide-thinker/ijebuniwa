'use client'

import { collection, query, where, orderBy, limit, startAfter, getDocs } from 'firebase/firestore'
import { useState, useEffect, useRef } from 'react'
import { fetcher } from '@/lib/globalFetcherFunc'
import ProductsGridView from './Products'
import { Button } from '@nextui-org/react'
import { db } from '@/lib/firebase'
import { Select, SelectItem, Avatar } from '@nextui-org/react'
import { Slider } from '@nextui-org/react'
import {
	getMaxPriceFromProducts,
	useProductMaxPrice,
} from '@/lib/firestore/products/count/read_client'

const ProductFilter = ({ onApplyFilters, filterValue, setSliderPrice, sliderPrice }) => {
	const [categories, setCategories] = useState([])
	const [brands, setBrands] = useState([])
	const [selectedCategory, setSelectedCategory] = useState('')
	const [selectedBrand, setSelectedBrand] = useState('')
	const [priceRange, setPriceRange] = useState([100, 1000])

	useEffect(() => {
		if (filterValue && filterValue.priceRange) {
			const [min, max] = filterValue.priceRange
			const validRange = [
				typeof min === 'number' && !isNaN(min) ? min : 0,
				typeof max === 'number' && !isNaN(max) ? max : 1000,
			]
			setPriceRange(validRange)
		}
	}, [filterValue])

	useEffect(() => {
		const fetchData = async () => {
			try {
				const categorySnapshot = await getDocs(collection(db, 'categories'))
				setCategories(
					categorySnapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data(),
					})),
				)

				const brandSnapshot = await getDocs(collection(db, 'brands'))
				setBrands(
					brandSnapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data(),
					})),
				)
			} catch (error) {
				console.error('Error fetching categories or brands:', error)
			}
		}

		fetchData()
	}, [])

	const handleSliderChange = (newValue) => {
		if (newValue.every((val) => typeof val === 'number' && !isNaN(val))) {
			setSliderPrice(newValue)
		} else {
			console.error('Invalid slider value:', newValue)
		}
	}

	const applyFilters = () => {
		if (!priceRange.every((val) => typeof val === 'number' && !isNaN(val))) {
			console.error('Invalid price range:', priceRange)
			return
		}

		onApplyFilters({
			categoryId: selectedCategory,
			brandId: selectedBrand,
		})
	}

	return (
		<div className="flex flex-col items-center w-full p-2 mb-2 border">
			<h2 className="w-full px-2 mb-2 text-lg font-bold">Products</h2>
			<div className="flex flex-col md:flex-row justify-between w-full gap-2">
				<div className="flex w-full gap-2">
					<Select
						items={categories}
						label="Category"
						placeholder="All categories"
						className="max-w-xs"
						onChange={(e) => setSelectedCategory(e.target.value)}
					>
						{(category) => <SelectItem textValue={category.name}>{category.name}</SelectItem>}
					</Select>

					<Select
						items={brands}
						label="Brands"
						placeholder="All Brands"
						className="max-w-xs gap-6"
						onChange={(e) => setSelectedBrand(e.target.value)}
					>
						{(brand) => <SelectItem textValue={brand.name}>{brand.name}</SelectItem>}
					</Select>
				</div>

				<div className="flex flex-col items-start justify-center w-full h-full gap-2 p-1 px-2 bg-secondary rounded-xl">
					<Slider
						label="Price Range"
						formatOptions={{ style: 'currency', currency: 'NGN' }}
						step={100}
						classNames={{ base: '', filler: 'bg-[#FDC321]' }}
						color="#FDC321"
						maxValue={
							Math.round((filterValue?.priceRange[1] / 100) * 10.6) + filterValue?.priceRange[1]
						}
						minValue={filterValue?.priceRange[0] || 0}
						value={sliderPrice}
						onChange={handleSliderChange}
						tooltipProps={{
							offset: 10,
							placement: 'bottom',
							classNames: {
								base: 'before:bg-gradient-to-r before:from-secondary-400 before:to-primary-500',
								content:
									'py-2 shadow-xl text-white bg-gradient-to-r from-secondary-400 to-primary-500',
							},
						}}
					/>
				</div>

				<div className="p-1">
					<Button onPress={applyFilters} variant="faded" className="p-6 font-semi">
						Apply Filters
					</Button>
				</div>
			</div>
		</div>
	)
}

// Main ProductsList Component
export const ProductsList = ({ pageSize = 10 }) => {
	const [products, setProducts] = useState([])
	const [lastSnapDoc, setLastSnapDoc] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const { data: prices, loading: loadingPrice } = useProductMaxPrice()
	const [sliderPrice, setSliderPrice] = useState(prices || [0, 10000000])
	const [filters, setFilters] = useState({ priceRange: [100, 1000] })

	const observerRef = useRef()

	const fetchProducts = async (isInitialLoad = false) => {
		setIsLoading(true)
		try {
			const { data: newProducts, lastVisible: newLastVisible } = await fetcher(
				'products',
				pageSize,
				lastSnapDoc,
				'timestampCreate',
				'desc',
			)

			if (newProducts.length === 0) {
				setHasMore(false)
			} else {
				setProducts((prevProducts) => [...prevProducts, ...newProducts])
				setLastSnapDoc(newLastVisible)
			}
		} catch (error) {
			console.error('Error fetching products:', error)
		}
		setIsLoading(false)
	}

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && hasMore && !isLoading) {
					fetchProducts(false)
				}
			},
			{ threshold: 1 },
		)
		if (observerRef.current) observer.observe(observerRef.current)
		return () => {
			if (observerRef.current) observer.disconnect()
		}
	}, [hasMore, isLoading])

	const handleApplyFilters = (newFilters) => {
		setProducts([])
		setLastSnapDoc(null)
		setHasMore(true)
		setFilters(newFilters)
	}

	return (
		<div className="flex flex-col items-center w-full border">
			<ProductFilter
				setSliderPrice={setSliderPrice}
				sliderPrice={sliderPrice}
				filterValue={
					prices && !loadingPrice && prices.length > 0
						? { priceRange: [prices[0] || 100, prices[1] || 1000] }
						: { priceRange: [0, 1000] }
				}
				onApplyFilters={handleApplyFilters}
			/>
			<ProductsGridView products={products} />
			<div ref={observerRef} className="h-10 w-full"></div>
			{isLoading && <p>Loading...</p>}
			{!hasMore && <p>No more products to load.</p>}
		</div>
	)
}

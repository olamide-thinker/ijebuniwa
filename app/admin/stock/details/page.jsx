'use client'

import { useEffect, useState } from 'react'
import Stock from './components/stock'
import { Button } from '@nextui-org/react'
import toast from 'react-hot-toast'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import StockDetails from './components/stockDetails'
// import SearchBar from "./components/ui/searchInput";
import AddStockModal from './components/addStock'
import { useStockStore } from '@/lib/firestore/stock/stockStore'
import { useProductStore } from '@/lib/firestore/products/read'
import SearchBar from '@/app/components/ui/searchInput'

export default function Page() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const id = searchParams.get('id')

	const {
		selectedStock,
		latestEntry,
		fetchStockById,
		fetchStockHistory,
		createStockHistory,
		loading,
	} = useStockStore()

	//this how we role because we can't call hooks in Zustan. so we call here
	const { fetchProduct } = useProductStore()

	const [isOpen, setIsOpen] = useState(false)

	// Fetch stock details and history when the component mounts
	useEffect(() => {
		if (id) {
			fetchStockById(id, fetchProduct)
			fetchStockHistory(id)
			console.log('----????', fetchStockById(id))
		}
	}, [id, fetchStockById, fetchStockHistory])

	// Handle creating a new stock entry
	// const handleCreate = async (data) => {

	//   try {

	//     await createStockHistory(id, data);
	//     toast.success("Stock added successfully");
	//   } catch (error) {
	//     toast.error("Stock not added successfully");
	//     console.error("Error adding stock:", error);
	//   }
	// };
	// console.log('|||||>>>>>>', selectedStock)

	return (
		<div className="flex flex-col gap-4 p-5">
			<div className="flex items-center justify-between w-full">
				<div className="flex space-x-4">
					<button onPress={() => router.back()}>
						<ArrowLeft />
					</button>
					<h1 className="font-semibold">Stock Information</h1>
				</div>

				<Button onPress={() => setIsOpen(true)} isDisabled={loading}>
					Add Stock
				</Button>
				<AddStockModal
					id={id}
					data={latestEntry}
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
					// onCreate={handleCreate}
				/>
			</div>

			<div className="flex flex-col md:flex-row gap-5 relative h-[80vh] overflow-auto sm:items-center">
				<div className="top-0 flex flex-col sm:flex-row lg:sticky ">
					<Stock data={selectedStock} id={id} />
				</div>
				<div className="flex flex-1 w-full lg:max-w-[70%] h-full gap-5">
					{/* hello */}
					<StockDetails data={selectedStock} id={id} />
				</div>
			</div>
		</div>
	)
}

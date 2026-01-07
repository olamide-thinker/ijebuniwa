'use client'

import { useStockStore } from '@/lib/firestore/stock/stockStore'
import { formatDate, formatMoney } from '@/lib/helpers'
import { Button, Chip, Input, Select, SelectItem } from '@nextui-org/react'
import { Eye, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import AddStockModal from '../details/components/addStock'
import { useProductStore } from '@/lib/firestore/products/read'

export default function ListView({ searchTerm }) {
	const { stock, lastSnapDoc, loading, error, hasMore, fetchStock, resetStock } = useStockStore()

	const { fetchProduct } = useProductStore()

	const filteredStock = stock?.filter((item) => {
		const searchWords = searchTerm?.toLowerCase().split(' ') // Split the search term into words
		const productName = item.product_name.toLowerCase()

		// Check if every word in the searchTerm exists in the product_name
		return searchWords.every((word) => productName.includes(word))
	})

	// console.log(filteredStock, searchTerm)

	// const [pageLimit, setPageLimit] = useState(10); // Default limit
	// const [currentPage, setCurrentPage] = useState(1);

	// // Fetch stock data when component mounts or state changes
	useEffect(() => {
		// resetStock(); // Clear existing data
		if (fetchProduct) {
			// syncStockPricesWithProducts(fetchProduct)
			fetchStock() // Fetch fresh data
		}
	}, [fetchProduct])

	// // Handle pagination
	// const handleNextPage = () => {
	//   if (hasMore && !loading) {
	//     setCurrentPage(currentPage + 1);
	//     fetchStock(pageLimit, searchTerm, lastSnapDoc);
	//   }
	// };

	// const handlePrePage = () => {
	//   if (currentPage > 1) {
	//     setCurrentPage(currentPage - 1);
	//     resetStock(); // Clear data and refetch
	//     fetchStock(pageLimit, searchTerm, null);
	//   }
	// };

	// // Handle limit change
	// const handlePageLimitChange = (value) => {
	//   setPageLimit(value);
	//   setCurrentPage(1); // Reset to first page
	// };

	// // Handle search input change
	// const handleSearchChange = (e) => {
	//   setSearchTerm(e.target.value);
	//   setCurrentPage(1);
	// };

	if (loading && stock.length === 0) {
		return <div>Loading...</div>
	}

	if (error) {
		return <div>Error: {error}</div>
	}

	return (
		<div className="flex flex-col flex-1 w-full gap-3 px-5 overflow-x-auto md:pr-5 md:px-0 rounded-xl">
			{/* <div className="flex justify-between mb-4">
      <Input
        type="text"
        placeholder="Search Products"
        value={searchTerm}
        onBlur={handleSearchChange}
      />
      </div> */}

			<table className="border-separate border-spacing-y-3">
				<thead>
					<tr>
						<th className="px-3 py-2 font-semibold bg-white border-l rounded-l-lg border-y">SN</th>
						<th className="px-3 py-2 font-semibold text-left bg-white border-y">Product</th>
						<th className="px-3 py-2 font-semibold text-left bg-white border-y">Current Stock</th>
						<th className="px-3 py-2 font-semibold text-left bg-white border-y">Status</th>
						<th className="px-3 py-2 font-semibold text-left bg-white border-y">Updated On</th>
						<th className="px-3 py-2 font-semibold text-center bg-white border-r rounded-r-lg border-y">
							Action
						</th>
					</tr>
				</thead>
				<tbody>
					{filteredStock?.map((item, index) => (
						<Row index={index} item={item} key={item.id || index} />
					))}
				</tbody>
			</table>

			{/* 

      <div className="flex items-center justify-between">
        <Button disabled={currentPage === 1 || loading} onPress={handlePrePage}>
          Previous
        </Button>
        <Select
        className="max-w-[200px]"
          selectedKeys={new Set([`${pageLimit}`])}
          onSelectionChange={(key) => handlePageLimitChange(Number(key))}
        >
          <SelectItem key="5">5 Items</SelectItem>
          <SelectItem key="10">10 Items</SelectItem>
          <SelectItem key="20">20 Items</SelectItem>
          <SelectItem key="50">50 Items</SelectItem>
        </Select>
        <Button disabled={!hasMore || loading} onPress={handleNextPage}>
          Next
        </Button>
      </div> */}
		</div>
	)
}

function Row({ item, index }) {
	const router = useRouter()

	const [isOpen, setIsOpen] = useState(false)

	// const handleCreate = async (data) => {

	//   try {
	//     await createStockHistory(id, data);
	//     toast.success("Stock added successfully");
	//   } catch (error) {
	//     toast.error("Stock not added successfully");
	//     console.error("Error adding stock:", error);
	//   }
	// }

	const {
		selectedStock,
		fetchStockById,
		fetchStockHistory,
		loading,
		latestEntry,
		createStockHistory,
	} = useStockStore()

	return (
		<tr>
			<td className="px-3 py-2 text-center bg-white border-l rounded-l-lg border-y">{index + 1}</td>
			<td className="flex items-center gap-4 px-3 py-2 bg-white border-y min-w-[300px]">
				<div
					className="flex justify-center cursor-pointer"
					onPress={() => {
						router.push(`/admin/stock/details?id=${item?.id}`)
					}}
				>
					<img className="object-cover w-10 h-10" src={item?.product_image} alt="" />
				</div>
				<div>
					{item?.product_name}
					<p className="opacity-60 ">{item?.product_sku}</p>
					<p className="opacity-60 ">{formatMoney(item?.price)}</p>
				</div>
			</td>
			<td className="px-3 py-2 bg-white border-y">
				<p className="flex gap-2">
					{item?.available_stock || 0}
					{item?.available_stock <= item?.low_stock ||
						(item?.available_stock == 0 && (
							<Chip color={'warning'} size={'sm'} className="text-xs font-semibold">
								{item?.available_stock <= item?.low_stock ? 'Low stock' : null}
							</Chip>
						))}
				</p>
			</td>
			<td className="px-3 py-2 bg-white border-y">
				<div className="flex text-xs">
					{item?.available_stock > 0 && (
						<div className="px-2 py-1 font-bold text-green-500 bg-green-100 rounded-md">
							Available
						</div>
					)}
					{item?.available_stock <= 0 && (
						<div className="px-2 py-1 text-red-500 bg-red-100 rounded-md">Out Of Stock</div>
					)}
				</div>
			</td>
			<td className="px-3 py-2 text-xs bg-white border-y">
				{formatDate({ timestamp: item?.timestampUpdated })}
			</td>
			<td className="px-3 py-2 bg-white border-r rounded-r-lg border-y">
				<div className="flex items-center gap-2">
					<Button
						onPress={() => {
							router.push(`/admin/stock/details?id=${item?.id}`)
						}}
						isIconOnly
						size="sm"
					>
						<Eye size={13} />
					</Button>

					<Button isIconOnly size="sm" onPress={() => setIsOpen(true)} isDisabled={loading}>
						<Plus size={13} />
					</Button>

					<AddStockModal
						header={
							<div className="flex items-center gap-3 max-w-[300px] text-xs">
								<div className="flex justify-center">
									<img className="object-cover h-20 w-28" src={item?.product_image} alt="" />
								</div>
								<div>
									<p className="">
										{' '}
										{item?.product_name}{' '}
										<Chip className="" size="sm">
											{' '}
											SKU: {item?.product_sku}{' '}
										</Chip>
									</p>
								</div>
							</div>
						}
						id={item.id}
						data={latestEntry}
						isOpen={isOpen}
						onClose={() => setIsOpen(false)}
						// onCreate={handleCreate}
					/>
				</div>
			</td>
		</tr>
	)
}

import { formatDate, formatMoney } from '@/lib/helpers'
import { Button, Chip } from '@nextui-org/react'
import { Settings } from 'lucide-react'
import StockInfoFormModal from './stockInfo'
import { useEffect, useState } from 'react'
// import { updateStockPreference } from "@/lib/firestore/stock/write";
import { useProductStore } from '@/lib/firestore/products/read'
import { useStockStore } from '@/lib/firestore/stock/stockStore'
import { collection, onSnapshot, doc, writeBatch, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase' // Adjust path based on your setup
import syncProductsAndStock from '@/lib/firestore/syncProductandStock'

export default function Stock({ data, id }) {
	// const [isOpen, setIsOpen] = useState(false);
	//   const [productData, setProductData] = useState({});
	//   const { updateProductPreference, updateStockPreference } = useStockStore();
	//   const { subscribeToStockUpdates } = useProductStore();

	//   useEffect(() => {
	//     setProductData(data);

	//     // Subscribe to stock updates for the given product
	//     const unsubscribe = subscribeToStockUpdates();
	//     return () => unsubscribe(); // Clean up subscription on component unmount
	//   }, [data, id, subscribeToStockUpdates]);

	//   const handleUpdate = async (updatedData) => {
	//     try {
	//       const newProductData = { ...productData, ...updatedData };

	//       // Update product preference
	//       const productResult = await updateProductPreference({ productId: id, data: newProductData });
	//       if (!productResult.success) {
	//         console.error("Failed to update product preference:", productResult.error);
	//       }

	//       // Update stock preference
	//       const stockResult = await updateStockPreference({ productId: id, data: newProductData });
	//       if (!stockResult.success) {
	//         console.error("Failed to update stock preference:", stockResult.error);
	//       }

	//       // Update local state
	//       setProductData(newProductData);
	//     } catch (error) {
	//       console.error("Error handling update:", error);
	//     } finally {
	//       setIsOpen(false);
	//     }
	//   };
	// console.log('>>>>>  ', productData , data)

	const [isOpen, setIsOpen] = useState(false)
	const [productData, setProductData] = useState({})
	const { updateProductPreference, updateStockPreference } = useStockStore()
	const { subscribeToStockUpdates } = useProductStore()

	// useEffect(() => {
	//   setProductData(data);

	//   // Subscribe to stock updates for the given product
	//   const unsubscribe = subscribeToStockUpdates();
	//   return () => unsubscribe(); // Clean up subscription on component unmount

	//   // Call sync function to ensure stock and product collections are in sync
	//   const syncData = async () => {
	//     await syncProductsAndStock();
	//   };

	//   // You can run this on page load, or in response to some event:
	//   syncData();
	// }, [data, id, subscribeToStockUpdates]);

	useEffect(() => {
		setProductData(data)

		// Subscribe to stock updates for the given product
		const unsubscribe = subscribeToStockUpdates()

		// Call sync function to ensure stock and product collections are in sync
		const syncData = async () => {
			await syncProductsAndStock()
		}

		// You can run this on page load, or in response to some event:
		syncData()

		// Clean up subscription on component unmount or dependency change
		return () => unsubscribe() // Clean up subscription last to ensure no interruption to other code
	}, [data, id, subscribeToStockUpdates])

	const handleUpdate = async (updatedData) => {
		try {
			const newProductData = { ...productData, ...updatedData }

			// Update product preference
			const productResult = await updateProductPreference({ productId: id, data: newProductData })
			if (!productResult.success) {
				console.error('Failed to update product preference:', productResult.error)
			}

			// Update stock preference
			const stockResult = await updateStockPreference({ productId: id, data: newProductData })
			if (!stockResult.success) {
				console.error('Failed to update stock preference:', stockResult.error)
			}

			// Update local state
			setProductData(newProductData)
		} catch (error) {
			console.error('Error handling update:', error)
		} finally {
			setIsOpen(false)
		}
	}

	return (
		<section className="relative  flex overflow-auto scrollbar-hide flex-col w-full max-w-[400px] gap-3 p-4 bg-white border h-full rounded-xl">
			<div className="sticky top-0 right-0 self-end p-0 -mb-10 w-fit h-fit">
				<Button isIconOnly onPress={() => setIsOpen(true)} variant="light">
					<Settings size={18} />
				</Button>

				<StockInfoFormModal
					initialData={productData} // Pass the updated product data
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
					onCreate={handleUpdate} // Use the updated handler
				/>
			</div>

			<div className="flex flex-col gap-1">
				<div className="flex justify-center">
					<img
						className="object-cover h-64 rounded-lg"
						src={productData?.product_image}
						alt={productData?.product_name || 'Product Image'}
					/>
				</div>
			</div>

			<p>{productData?.product_name}</p>
			<p className="text-xs">Updated: {formatDate({ timestamp: productData?.timestampCreate })}</p>
			<div className="grid grid-cols-2 gap-2 pb-4">
				<div className="p-2 border rounded-sm">
					<label className="text-xs">Available stock: </label>
					<div className="flex gap-2">
						{productData?.available_stock}
						{productData?.available_stock <= productData?.low_stock && (
							<Chip color="warning" size="sm" className="text-xs font-semibold">
								Low stock
							</Chip>
						)}
					</div>
				</div>
				<div className="p-2 border rounded-sm">
					<label className="text-xs">Low stock: </label>
					<p>{productData?.low_stock}</p>
				</div>

				<div className="p-2 border rounded-sm">
					<label className="text-xs">SKU: </label>
					<p>{productData?.product_sku}</p>
				</div>

				<div className="p-2 border rounded-sm">
					<label className="text-xs">Measuring unit: </label>
					<p>{productData?.measurement}</p>
				</div>

				<div className="p-2 border rounded-sm">
					<label className="text-xs"> Visibility: </label>
					<p>{productData?.isPublished ? 'published' : 'Draft'}</p>
				</div>

				<div className="p-2 border rounded-sm">
					<p className="text-xs">Current selling price: </p>
					<p>{formatMoney(productData?.price)}</p>
				</div>
				{productData?.onSale && (
					<div className="p-2 border rounded-sm">
						<p className="text-xs">Sale price: </p>
						<p>{formatMoney(productData?.sale_price)}</p>
					</div>
				)}
			</div>

			{/* <div>
        <div className="flex items-center justify-between w-full mb-4">
          <p className="text-sm">Product identifiers:</p>
        </div>
        <p className="flex flex-wrap gap-2">
          {productData?.product_identifier.map((id, i) => (
            <span key={i} className="px-4 py-1 rounded-full bg-secondary">
              {id}
            </span>
          ))}
        </p>
      </div> */}
		</section>
	)
}

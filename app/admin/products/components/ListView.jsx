'use client'

// import { useProducts } from "@/lib/firestore/products/read";
// import { deleteProduct } from "@/lib/firestore/products/write";
// import { formatMoney } from "@/lib/helpers";
// import { Button, CircularProgress } from "@nextui-org/react";
// import { Edit2, Trash2 } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";

// export default function ListView() {
//  // State to track page limit and last document in pagination
//  const [pageLimit, setPageLimit] = useState(10);
//  const [lastSnapDocList, setLastSnapDocList] = useState([]);

//  // Reset the last document stack when the page limit changes
//  useEffect(() => {
//    setLastSnapDocList([]);
//  }, [pageLimit]);

//  // Fetch products using the custom hook
//  const {
//    data: products,
//    error,
//    isLoading,
//    lastSnapDoc, // Get the last document snapshot for the current page
//  } = useProducts({
//    pageLimit,
//    lastSnapDoc:
//      lastSnapDocList.length === 0
//        ? null
//        : lastSnapDocList[lastSnapDocList.length - 1], // Pass the last snapshot for pagination
//  });

//  console.log("Destructured output:",  useProducts({ pageLimit}));

//  // Handle the next page, pushing the last document snapshot onto the stack
//  const handleNextPage = () => {
//    if (lastSnapDoc) {
//      setLastSnapDocList((prev) => [...prev, lastSnapDoc]);
//    }
//  };

//  // Handle the previous page, popping the last document snapshot off the stack
//  const handlePrePage = () => {
//    setLastSnapDocList((prev) => prev.slice(0, -1));
//  };

//   if (isLoading) {
//     return (
//       <div>
//         <CircularProgress />
//       </div>
//     );
//   }
//   if (error) {
//     return <div>{error}</div>;
//   }
//   return (
//     <div className="flex flex-col flex-1 w-full gap-3 px-5 overflow-x-auto md:pr-5 md:px-0 rounded-xl">
//       <table className="border-separate border-spacing-y-3">
//         <thead>
//           <tr>
//             <th className="px-3 py-2 font-semibold bg-white border-l rounded-l-lg border-y">
//               SN
//             </th>
//             <th className="px-3 py-2 font-semibold bg-white border-y">Image</th>
//             <th className="px-3 py-2 font-semibold text-left bg-white border-y">
//               Title
//             </th>
//             <th className="px-3 py-2 font-semibold text-left bg-white border-y">
//               Price
//             </th>
//             <th className="px-3 py-2 font-semibold text-left bg-white border-y">
//               Stock
//             </th>
//             {/* <th className="px-3 py-2 font-semibold text-left bg-white border-y">
//               Orders
//             </th> */}
//             <th className="px-3 py-2 font-semibold text-left bg-white border-y">
//               Status
//             </th>
//             <th className="px-3 py-2 font-semibold text-center bg-white border-r rounded-r-lg border-y">
//               Actions
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {products?.map((item, index) => {
//             return (
//               <Row
//                 index={index + lastSnapDocList?.length * pageLimit}
//                 item={item}
//                 key={item?.id}
//               />
//             );
//           })}
//         </tbody>
//       </table>
//       <div className="flex justify-between py-3 text-sm">
//         <Button
//           isDisabled={isLoading || lastSnapDocList?.length === 0}
//           onPress={handlePrePage}
//           size="sm"
//           variant="bordered"
//         >
//           Previous
//         </Button>
//         <select
//           value={pageLimit}
//           onChange={(e) => setPageLimit(e.target.value)}
//           className="px-5 rounded-xl"
//           name="perpage"
//           id="perpage"
//         >
//           <option value={3}>3 Items</option>
//           <option value={5}>5 Items</option>
//           <option value={10}>10 Items</option>
//           <option value={20}>20 Items</option>
//           <option value={100}>100 Items</option>
//         </select>
//         <Button
//           isDisabled={isLoading || products?.length === 0}
//           onPress={handleNextPage}
//           size="sm"
//           variant="bordered"
//         >
//           Next
//         </Button>
//       </div>
//     </div>
//   );
// }

// function Row({ item, index }) {
//   const [isDeleting, setIsDeleting] = useState(false);
//   const router = useRouter();

//   const handleDelete = async () => {
//     if (!confirm("Are you sure?")) return;

//     setIsDeleting(true);
//     try {
//       await deleteProduct({ id: item?.id });
//       toast.success("Successfully Deleted");
//     } catch (error) {
//       toast.error(error?.message);
//     }
//     setIsDeleting(false);
//   };

//   const handleUpdate = () => {
//     router.push(`/admin/products/form?id=${item?.id}`);
//   };

//   return (
//     <tr>
//       <td className="px-3 py-2 text-center bg-white border-l rounded-l-lg border-y">
//         {index + 1}
//       </td>
//       <td className="px-3 py-2 text-center bg-white border-y">
//         <div className="flex justify-center">
//           <img
//             className="object-cover w-10 h-10"
//             src={item?.featureImageURL}
//             alt=""
//           />
//         </div>
//       </td>
//       <td className="px-3 py-2 bg-white border-y whitespace-nowrap">
//         {item?.title}{" "}
//         {item?.isFeatured === true && (
//           <span className="ml-2 bg-gradient-to-tr from-blue-500 to-indigo-400 text-white text-[10px] rounded-full px-3 py-1">
//             Featured
//           </span>
//         )}
//       </td>
//       <td className="px-3 py-2 bg-white border-y whitespace-nowrap">
//         {item?.salePrice < item?.price && (
//           <span className="text-xs text-gray-500 line-through">
//           {formatMoney(item?.price)}
//           </span>
//         )}{" "}
//       {formatMoney(item?.salePrice)}
//       </td>
//       <td className="px-3 py-2 bg-white border-y">{item?.stock}</td>
//       {/* <td className="px-3 py-2 bg-white border-y">{item?.orders ?? 0}</td> */}
//       <td className="px-3 py-2 bg-white border-y">
//         <div className="flex">
//           {item?.stock - (item?.orders ?? 0) > 0 && (
//             <div className="px-2 py-1 text-xs font-bold text-green-500 bg-green-100 rounded-md">
//               Available
//             </div>
//           )}
//           {item?.stock - (item?.orders ?? 0) <= 0 && (
//             <div className="px-2 py-1 text-xs text-red-500 bg-red-100 rounded-md">
//               Out Of Stock
//             </div>
//           )}
//         </div>
//       </td>
//       <td className="px-3 py-2 bg-white border-r rounded-r-lg border-y">
//         <div className="flex items-center gap-2">
//           <Button
//             onPress={handleUpdate}
//             isDisabled={isDeleting}
//             isIconOnly
//             size="sm"
//           >
//             <Edit2 size={13} />
//           </Button>
//           <Button
//             onPress={handleDelete}
//             isLoading={isDeleting}
//             isDisabled={isDeleting}
//             isIconOnly
//             size="sm"
//             color="danger"
//           >
//             <Trash2 size={13} />
//           </Button>
//         </div>
//       </td>
//     </tr>
//   );
// }

// "use client"

import { useEffect, useState } from 'react'
// import { useProductStore } from "@/lib/store/productStore";
import { formatMoney } from '@/lib/helpers'
import { Button, CircularProgress } from '@nextui-org/react'
import { Edit2, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useProductStore } from '@/lib/firestore/products/read'

export default function ListView({ searchTerm }) {
	const subscribeToStockUpdates = useProductStore((state) => state.subscribeToStockUpdates)

	const {
		products,
		isLoading,
		error,
		fetchProducts,
		deleteProduct,
		pageLimit,
		lastSnapDocList,
		nextPage,
		prevPage,
		// subscribeToStockUpdates,
	} = useProductStore()

	useEffect(() => {
		// Start subscription on mount
		const unsubscribe = subscribeToStockUpdates()
		// Clean up subscription on unmount
		return () => unsubscribe()
	}, [subscribeToStockUpdates])

	// useEffect(() => {
	//   fetchProducts( );
	// }, [fetchProducts]);

	useEffect(() => {
		fetchProducts(1000) // Initial load with a page size of 10
	}, [])

	const handleNextPage = async () => {
		if (isLoading) return
		await nextPage()
	}

	const handlePrevPage = () => {
		if (lastSnapDocList.length === 0) return
		prevPage()
	}

	const filteredProduct = products?.filter((item) => {
		const searchWords = searchTerm.toLowerCase().split(' ') // Split the search term into words
		const productName = item?.title?.toLowerCase()

		// Check if every word in the searchTerm exists in the product_name
		return searchWords.every((word) => productName?.includes(word))
	})

	// console.log(filteredProduct , searchTerm)

	if (isLoading) {
		return (
			<div>
				<CircularProgress aria-label="Loading..." />
			</div>
		)
	}

	if (error) {
		return <div>{error}</div>
	}

	return (
		<div className="flex flex-col flex-1 w-full gap-3 px-5 overflow-x-auto md:pr-5 md:px-0 rounded-xl">
			<table className="border-separate border-spacing-y-3">
				<thead>
					<tr>
						<th className="px-3 py-2 font-semibold bg-white border-l rounded-l-lg border-y">SN</th>
						<th className="px-3 py-2 font-semibold bg-white border-y">Image</th>
						<th className="px-3 py-2 font-semibold text-left bg-white border-y">Title</th>
						<th className="px-3 py-2 font-semibold text-left bg-white border-y">Price</th>
						<th className="px-3 py-2 font-semibold text-left bg-white border-y">Stock</th>
						<th className="px-3 py-2 font-semibold text-left bg-white border-y">Status</th>
						<th className="px-3 py-2 font-semibold text-center bg-white border-r rounded-r-lg border-y">
							Actions
						</th>
					</tr>
				</thead>
				<tbody>
					{filteredProduct?.map((item, index) => (
						<Row index={index} item={item} key={`${item?.id || 'default'}-${index}`} />
					))}
				</tbody>
			</table>

			{/* <div className="flex justify-between py-3 text-sm">
  <Button
    isDisabled={isLoading || lastSnapDocList?.length === 0}
    onPress={handlePrevPage}
    size="sm"
    variant="bordered"
  >
    Previous
  </Button>
  <select
    value={pageLimit}
    onChange={(e) => setPageSize(Number(e.target.value))}
    className="px-5 rounded-xl"
    name="perpage"
    id="perpage"
  >
    <option value={5}>5 Items</option>
    <option value={10}>10 Items</option>
    <option value={20}>20 Items</option>
    <option value={50}>50 Items</option>
  </select>
  <Button
    isDisabled={isLoading || products?.length === 0}
    onPress={handleNextPage}
    size="sm"
    variant="bordered"
  >
    Next
  </Button>
</div> */}
		</div>
	)
}

function Row({ item, index }) {
	const { deleteProduct } = useProductStore()

	const [isDeleting, setIsDeleting] = useState(false)
	const router = useRouter()

	const handleDelete = async () => {
		if (!confirm('Are you sure?')) return

		setIsDeleting(true)
		try {
			await deleteProduct(item?.id)
			toast.success('Successfully Deleted')
		} catch (error) {
			toast.error(error?.message)
		}
		setIsDeleting(false)
	}

	const handleUpdate = () => {
		router.push(`/admin/products/form?id=${item?.id}`)
	}

	return (
		<tr>
			<td className="px-3 py-2 text-center bg-white border-l rounded-l-lg border-y">{index + 1}</td>
			<td className="px-3 py-2 text-center bg-white border-y">
				<div className="flex justify-center">
					<img className="object-cover w-10 h-10" src={item?.featureImageURL} alt="" />
				</div>
			</td>
			<td className="w-full min-w-[300px] px-3 py-2 bg-white border-y">{item?.title}</td>
			<td className="px-3 py-2 bg-white border-y whitespace-nowrap">
				{/* {item?.salePrice > item?.price && (
          <span className="text-xs text-gray-500 line-through">
            {formatMoney(item?.price)}
          </span>
        )}{" "}
        {formatMoney(item?.salePrice)}
     */}
				<h2 className="font-semibold text-md">
					{item.onSale ? formatMoney(item?.salePrice) : formatMoney(item?.price)}{' '}
				</h2>
				<p className="text-xs text-gray-600 line-through">
					{item.onSale && formatMoney(item?.price)}
				</p>
			</td>
			<td className="px-3 py-2 bg-white border-y">{item?.stock}</td>
			<td className="px-3 py-2 bg-white border-y">
				<div className="flex">
					{item?.stock > 0 ? (
						<div className="px-2 py-1 text-xs font-bold text-green-500 bg-green-100 rounded-md">
							Available
						</div>
					) : (
						<div className="px-2 py-1 text-xs text-red-500 bg-red-100 rounded-md">Out Of Stock</div>
					)}
				</div>
			</td>
			<td className="px-3 py-2 bg-white border-r rounded-r-lg border-y">
				<div className="flex items-center gap-2">
					<Button onPress={handleUpdate} isDisabled={isDeleting} isIconOnly size="sm">
						<Edit2 size={13} />
					</Button>

					<Button
						onPress={handleDelete}
						isLoading={isDeleting}
						isDisabled={isDeleting}
						isIconOnly
						size="sm"
						color="danger"
					>
						<Trash2 size={13} />
					</Button>
				</div>
			</td>
		</tr>
	)
}

// "use client";

// import PropTypes from 'prop-types';
// import { deleteProduct } from "@/lib/firestore/products/write";
// import { useGetAllStock } from "@/lib/firestore/stock/read";
// import { getStockHistory } from "@/lib/firestore/stock/stockHistroy/read";
// import { formatDate, formatMoney } from "@/lib/helpers";
// import { Button, CircularProgress } from "@nextui-org/react";
// import { Edit2, Trash2 } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";

// export default function StockDetails({id, data , getData}) {
//  // State to track page limit and last document in pagination
//  const [pageLimit, setPageLimit] = useState(10);
//  const [lastSnapDocList, setLastSnapDocList] = useState([]);
//  const [history, setHistory] = useState([])
//  const [isLoading, setIsLoading] = useState(true);
//  const [error, setError] = useState(null);
//  const [isSubmitting, setIsSubmitting] = useState(false);
// //  const data = getStockHistory()

// console.log('id-> ',id)
//  // Fetch customer insights (array of insights)
//  useEffect(() => {
//   async function fetchData() {
//     try {
//       const data = await getStockHistory(id);
//       setHistory(data || []);

//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   }
//   fetchData();
// }, [id, data]);

// // Ensure getData is called when `history` updates
// // useEffect(() => {
// //   if (history.length > 0) {
// //     getData(history);
// //   }
// // }, [history, getData]);

// // console.log('=======>',history)

// //  // Reset the last document stack when the page limit changes
// //  useEffect(() => {
// //    setLastSnapDocList([]);
// //  }, [pageLimit]);

//  // Fetch products using the custom hook
// // //  const {
// // //    data: stock,
// // //    error,
// // //    isLoading,
// // //    lastSnapDoc, // Get the last document snapshot for the current page
// // //  } = useGetAllStock({
// // //    pageLimit,
// // //    lastSnapDoc:
// // //      lastSnapDocList.length === 0
// // //        ? null
// // //        : lastSnapDocList[lastSnapDocList.length - 1], // Pass the last snapshot for pagination
// // //  });

// //  // Handle the next page, pushing the last document snapshot onto the stack
// //  const handleNextPage = () => {
// //    if (lastSnapDoc) {
// //      setLastSnapDocList((prev) => [...prev, lastSnapDoc]);
// //    }
// //  };

// //  // Handle the previous page, popping the last document snapshot off the stack
// //  const handlePrePage = () => {
// //    setLastSnapDocList((prev) => prev.slice(0, -1));
// //  };

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
//       <table className="border-separate border-spacing-y-1">
//         <thead>
//           <tr>
//             <th className="px-3 py-2 font-semibold bg-white border-l rounded-l-lg border-y">
//               SN
//             </th>
//             {/* <th className="px-3 py-2 font-semibold bg-white border-y">Image</th> */}
//             <th className="px-3 py-2 font-semibold text-left bg-white border-y">
//               Made by
//             </th>
//             {/* <th className="px-3 py-2 font-semibold text-left bg-white border-y">
//               Price
//             </th> */}
//             {/* <th className="px-3 py-2 font-semibold text-left bg-white border-y">
//               current Stock
//             </th> */}
//             <th className="px-3 py-2 font-semibold text-left bg-white border-y">
//               Stock
//             </th>
//             <th className="px-3 py-2 font-semibold text-left bg-white border-y">
//               Stock_in
//             </th>
//             <th className="px-3 py-2 font-semibold text-left bg-white border-y">
//               Stock_out
//             </th>
//             {/* <th className="px-3 py-2 font-semibold text-left bg-white border-y">
//               Status
//             </th> */}
//             <th className="px-3 py-2 font-semibold text-left bg-white border-y">
//               Date
//             </th>

//             <th className="px-3 py-2 font-semibold text-left bg-white border-y">
//              Price
//             </th>
//             <th className="px-3 py-2 font-semibold text-left bg-white border-y">
//               Doc
//             </th>
//             <th className="px-3 py-2 font-semibold text-center bg-white border-r rounded-r-lg border-y">
//               Note
//             </th>

//           </tr>
//         </thead>
//         <tbody>
//           {history?.map((item, index) => {
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
//       {/* <div className="flex justify-between py-3 text-sm">
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
//           isDisabled={isLoading || stock?.length === 0}
//           onPress={handleNextPage}
//           size="sm"
//           variant="bordered"
//         >
//           Next
//         </Button>
//       </div> */}
//     </div>
//   );
// }

// function Row({ item, index }) {
// //   const [isDeleting, setIsDeleting] = useState(false);
// //   const router = useRouter();
// // // console.log('first----', item)
// //   const handleDelete = async () => {
// //     if (!confirm("Are you sure?")) return;

// //     setIsDeleting(true);
// //     try {
// //       await deleteProduct({ id: item?.id });
// //       toast.success("Successfully Deleted");
// //     } catch (error) {
// //       toast.error(error?.message);
// //     }
// //     setIsDeleting(false);
// //   };

// //   const handleUpdate = () => {
// //     router.push(`/admin/products/form?id=${item?.id}`);
// //   };

//   // console.log(item?.date.toDate())

//   return (
//     <tr>
//       <td className="px-3 py-2 text-center bg-white border-l rounded-l-lg border-y">
//         {index + 1}
//       </td>
//       <td className="gap-4 px-3 py-2 bg-white border-y whitespace-nowrap">
//         <div className="">
//      <p> {item?.createdBy}</p>
//      <p className="text-xs"> {item?.email}</p>
//           </div>
//       </td>
//       <td className="px-3 py-2 bg-white border-y whitespace-nowrap">
//       {item?.stock ?? 0}<span className="pl-1 text-xs">{item?.measurement ?? 0}</span>
//       </td>
//       <td className="px-3 py-2 bg-white border-y whitespace-nowrap">
//       {item?.stockIn ?? 0}
//       </td>
//       <td className="px-3 py-2 bg-white border-y">{item?.stockOut ?? 0}</td>
//       <td className="px-3 py-2 bg-white whitespace-nowrap border-y">{formatDate({timestamp:item?.date})}</td>
//       <td className="px-3 py-2 bg-white border-y whitespace-nowrap">
//     <p className="text-xs">U: {formatMoney(item?.unitCost)} <span className="text-primary">*</span> {item?.stockIn}</p>
//    <p className="font-semibold"><span className="text-xs font-normal">T: </span>{formatMoney(item?.totalCost)}</p>
//       </td>
//       <td className="px-3 py-2 bg-white border-y">
//       {/* {item?.doc ?? N/A} */}
//       </td>
//       <td className="px-3 py-2 bg-white border-r rounded-r-lg border-y whitespace-nowrap">
//       {item?.note}
//       </td>
//     </tr>

//   );
// }

// // "use client";

// // import PropTypes from "prop-types";
// // import { formatDate, formatMoney } from "@/lib/helpers";
// // import { CircularProgress } from "@nextui-org/react";
// // import { useEffect, useRef, useState } from "react";
// // import { useStockStore } from "@/lib/firestore/stock/stockStore";

// // export default function StockDetails({ id, getData }) {
// //   const [history, setHistory] = useState([])

// //   const {
// //     stockHistory,
// //     fetchStockHistory,
// //     loading,
// //     error,
// //   } = useStockStore((state) => ({
// //     stockHistory: state.stockHistory,
// //     fetchStockHistory: state.fetchStockHistory,
// //     loading: state.loading,
// //     error: state.error,
// //   }));

// //   // Track whether the data has been fetched to avoid redundant calls
// //   const hasFetched = useRef(false);

// //   // Fetch stock history when component mounts or id changes
// //   useEffect(() => {
// //     if (id && !hasFetched.current) {
// //       fetchStockHistory(id);
// //       hasFetched.current = true;
// //     }
// //   }, [id, fetchStockHistory]);

// //   // Only call getData when history data is updated or changed
// //   useEffect(() => {
// //     // Check if history data exists for the current id
// //     if (stockHistory[id] && stockHistory[id] !== getData) {
// //       getData(stockHistory[id]);
// //     }
// //   }, [stockHistory, id, getData]); // Re-run only when stockHistory or id changes

// //   useEffect(()=>{
// //  setHistory(stockHistory[id] || []);
// //   },[])

// //   if (loading) {
// //     return (
// //       <div>
// //         <CircularProgress />
// //       </div>
// //     );
// //   }
// //   if (error) {
// //     return <div>{error}</div>;
// //   }

// //   return (
// //     <div className="flex flex-col flex-1 w-full gap-3 px-5 overflow-x-auto scrollbar-hide md:pr-5 md:px-0 rounded-xl">
// //       <table className="border-separate border-spacing-y-1">
// //         <thead>
// //           <tr>
// //             <th className="px-3 py-2 font-semibold bg-white border-l rounded-l-lg border-y">
// //               SN
// //             </th>
// //             <th className="px-3 py-2 font-semibold text-left bg-white border-y">
// //               Made by
// //             </th>
// //             <th className="px-3 py-2 font-semibold text-left bg-white border-y">
// //               Stock
// //             </th>
// //             <th className="px-3 py-2 font-semibold text-left bg-white border-y">
// //               Stock_in
// //             </th>
// //             <th className="px-3 py-2 font-semibold text-left bg-white border-y">
// //               Stock_out
// //             </th>
// //             <th className="px-3 py-2 font-semibold text-left bg-white border-y">
// //               Date
// //             </th>
// //             <th className="px-3 py-2 font-semibold text-left bg-white border-y">
// //               Price
// //             </th>
// //             <th className="px-3 py-2 font-semibold text-left bg-white border-y">
// //               Doc
// //             </th>
// //             <th className="px-3 py-2 font-semibold text-center bg-white border-r rounded-r-lg border-y">
// //               Note
// //             </th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {history?.map((item, index) => (
// //             <Row index={index} item={item} key={item.id} />
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // }

// // function Row({ item, index }) {
// //   return (
// //     <tr>
// //       <td className="px-3 py-2 text-center bg-white border-l rounded-l-lg border-y">
// //         {index + 1}
// //       </td>
// //       <td className="gap-4 px-3 py-2 bg-white border-y whitespace-nowrap">
// //         <div>
// //           <p>{item?.createdBy}</p>
// //           <p className="text-xs">{item?.email}</p>
// //         </div>
// //       </td>
// //       <td className="px-3 py-2 bg-white border-y whitespace-nowrap">
// //         {item?.stock ?? 0}
// //         <span className="pl-1 text-xs">{item?.measurement ?? 0}</span>
// //       </td>
// //       <td className="px-3 py-2 bg-white border-y whitespace-nowrap">
// //         {item?.stockIn ?? 0}
// //       </td>
// //       <td className="px-3 py-2 bg-white border-y">{item?.stockOut ?? 0}</td>
// //       <td className="px-3 py-2 bg-white whitespace-nowrap border-y">
// //         {formatDate({ timestamp: item?.date })}
// //       </td>
// //       <td className="px-3 py-2 bg-white border-y whitespace-nowrap">
// //         <p className="text-xs">
// //           U: {formatMoney(item?.unitCost)}{" "}
// //           <span className="text-primary">*</span> {item?.stockIn}
// //         </p>
// //         <p className="font-semibold">
// //           <span className="text-xs font-normal">T: </span>
// //           {formatMoney(item?.totalCost)}
// //         </p>
// //       </td>
// //       <td className="px-3 py-2 bg-white border-y">{item?.doc ?? "N/A"}</td>
// //       <td className="px-3 py-2 bg-white border-r rounded-r-lg border-y whitespace-nowrap">
// //         {item?.note}
// //       </td>
// //     </tr>
// //   );
// // }

'use client'

import PropTypes from 'prop-types'
import { formatDate, formatMoney } from '@/lib/helpers'
import { CircularProgress } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { useStockStore } from '@/lib/firestore/stock/stockStore'

export default function StockDetails({ id }) {
	const fetchStockHistory = useStockStore((state) => state.fetchStockHistory)
	const stockHistoryData = useStockStore((state) => state.stockHistory)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState(null)
	const stockHistory = stockHistoryData[id]

	// Fetch stock history using Zustand
	useEffect(() => {
		async function fetchData() {
			setIsLoading(true)
			try {
				await fetchStockHistory(id) // Zustand fetch function
			} catch (err) {
				setError(err.message)
			} finally {
				setIsLoading(false)
			}
		}

		if (id) {
			fetchData()
		}
	}, [id, fetchStockHistory])

	// console.log("====> ", stockHistory)

	if (isLoading) {
		return (
			<div>
				<CircularProgress />
			</div>
		)
	}

	if (error) {
		return <div className="text-red-500">Error: {error}</div>
	}

	return (
		<div className="flex flex-col flex-1 w-full gap-3 overflow-x-auto md:pr-5 md:px-0 rounded-xl">
			<table className="relative border-separate border-spacing-y-1">
				<thead className="sticky top-0">
					<tr>
						<th className="px-3 py-2 font-semibold bg-white border-l rounded-l-lg border-y">SN</th>
						<th className="px-3 py-2 font-semibold text-left bg-white border-y">Made by</th>
						<th className="px-3 py-2 font-semibold text-left bg-white border-y">Stock</th>
						<th className="px-3 py-2 font-semibold text-left bg-white whitespace-nowrap border-y">
							Stk-In
						</th>
						<th className="px-3 py-2 font-semibold text-left bg-white whitespace-nowrap border-y">
							Stk-Out
						</th>
						<th className="px-3 py-2 font-semibold text-left bg-white border-y">Date</th>
						<th className="px-3 py-2 font-semibold text-left bg-white border-y">Price</th>
						<th className="px-3 py-2 font-semibold text-left bg-white border-y">Doc</th>
						<th className="px-3 py-2 font-semibold text-left bg-white border-r rounded-r-lg border-y">
							Note
						</th>
					</tr>
				</thead>
				<tbody>
					{stockHistory?.map((item, index) => (
						<Row index={index} item={item} key={item.id || index} />
					))}
				</tbody>
			</table>
		</div>
	)
}

function Row({ item, index }) {
	return (
		<tr className="hover:ring-2">
			<td className="px-3 py-2 text-center bg-white border-l rounded-l-lg border-y">{index + 1}</td>
			<td className="gap-4 px-3 py-2 bg-white border-y whitespace-nowrap">
				<div>
					<p>{item?.createdBy}</p>
					<p className="text-xs">{item?.email}</p>
				</div>
			</td>
			<td className="px-3 py-2 bg-white border-y whitespace-nowrap">
				{item?.stock ?? 0}
				<span className="pl-1 text-xs">{item?.measurement ?? ''}</span>
			</td>
			<td className="px-3 py-2 bg-white border-y whitespace-nowrap">{item?.stockIn ?? '--'}</td>
			<td className="px-3 py-2 bg-white border-y">{item?.stockOut ?? '--'}</td>
			<td className="px-3 py-2 bg-white whitespace-nowrap border-y">
				{formatDate({ timestamp: item?.date })}
			</td>
			<td className="px-3 py-2 bg-white border-y whitespace-nowrap">
				<p className="text-xs">
					U: {formatMoney(item?.unitCost)} <span className="text-primary">*</span>{' '}
					{item?.stockIn || '1'}
				</p>
				<p className="font-semibold">
					<span className="text-xs font-normal">T: </span>
					{formatMoney(item?.totalCost)}
				</p>
			</td>
			<td className="px-3 py-2 bg-white border-y">{item?.doc ?? 'N/A'}</td>
			<td className="px-3 py-2 bg-white border-r rounded-r-lg border-y whitespace-nowrap">
				{item?.note}
			</td>
		</tr>
	)
}

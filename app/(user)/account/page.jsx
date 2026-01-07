'use client'

import { useOrders } from '@/lib/firestore/orders/read'
import { CircularProgress } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { formatMoney } from '@/lib/helpers'

export const dynamic = 'force-dynamic'

export default function Page() {
	const { user } = useAuth()
	const router = useRouter()

	// Redirect to login if not authenticated
	useEffect(() => {
		if (user === null) {
			router.push('/login')
		}
	}, [user, router])

	if (!user) {
		return (
			<div className="flex justify-center py-48">
				<CircularProgress />
			</div>
		)
	}

	const { data: orders, error, isLoading } = useOrders({ uid: user?.uid })

	// Countdown state
	const [countdowns, setCountdowns] = useState({})

	// Function to calculate time remaining in milliseconds
	const getTimeRemaining = (timestamp) => {
		const deliveredTime = timestamp?.toDate()?.getTime()
		const currentTime = new Date().getTime()
		const timeDifference = 24 * 60 * 60 * 1000 - (currentTime - deliveredTime)
		return timeDifference > 0 ? timeDifference : 0
	}

	useEffect(() => {
		if (orders) {
			const newCountdowns = orders.reduce((acc, item, index) => {
				if (item?.status === 'delivered' && item?.timestampStatusUpdate) {
					acc[index] = getTimeRemaining(item?.timestampStatusUpdate)
				}
				return acc
			}, {})
			setCountdowns(newCountdowns)
		}
	}, [orders])

	if (isLoading) {
		return (
			<div className="flex justify-center py-48">
				<CircularProgress />
			</div>
		)
	}

	if (error) {
		return <>{error}</>
	}

	const formatTime = (milliseconds) => {
		const hours = Math.floor(milliseconds / (1000 * 60 * 60))
		const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))
		return `${hours}h ${minutes}m`
	}

	return (
		<main className="flex flex-col gap-4 p-5">
			<h1 className="text-2xl font-semibold">My Orders</h1>

			{(!orders || orders?.length === 0) && (
				<div className="flex flex-col items-center justify-center gap-3 py-11">
					<div className="flex justify-center">
						<img className="h-44" src="/svgs/Empty-pana.svg" alt="" />
					</div>
					<h1>You have no active order</h1>
				</div>
			)}
			<div className="flex flex-col gap-3">
				{orders?.map((item, orderIndex) => {
					const totalAmount = item?.checkout?.line_items?.reduce((prev, curr) => {
						return prev + curr?.unit_price * curr?.quantity
					}, 0)

					// Calculate the remaining time for the "Send us a message" button
					const timeRemaining = countdowns[orderIndex] ?? 0

					return (
						<div key={item.id} className="flex flex-col gap-2 p-4 border rounded-lg ">
							<div className="flex flex-col gap-2">
								<div className="flex gap-3">
									<h3>{orderIndex + 1} :</h3>
									<h3>{item?.id}</h3>
									<h3 className="px-2 py-1 text-xs text-blue-500 uppercase bg-blue-100 rounded-lg">
										{item?.paymentMode}
									</h3>
									<h3 className="px-2 py-1 text-xs text-green-500 uppercase bg-green-100 rounded-lg">
										{item?.status ?? 'pending'}
									</h3>
									<h3 className="">{formatMoney(totalAmount)}</h3>
								</div>
								<h4 className="text-xs text-gray-600">
									{item?.timestampCreate?.toDate()?.toString()}
								</h4>
							</div>
							<div className="space-y-1">
								{item?.checkout?.line_items?.map((product, i) => {
									return (
										<div key={i} className="flex items-center gap-2 p-2 rounded bg-zinc-50">
											<img
												className="w-10 h-10 rounded-lg"
												src={product?.image}
												alt="Product Image"
											/>
											<div>
												<h1 className="">{product?.name}</h1>
												<h1 className="text-xs text-gray-500">
													{formatMoney(product?.unit_price)} <span>X</span>{' '}
													<span>{product?.quantity?.toString()}</span>
												</h1>
											</div>
										</div>
									)
								})}
							</div>

							{/* Button appears only if order is delivered and within 24 hours */}
							{item?.status === 'delivered' && timeRemaining > 0 && (
								<div className="flex items-center justify-between mt-4">
									{/* WhatsApp message button */}
									<a
										href={`https://wa.me/2348181685778?text=NAME:%20${user.displayName}%0AORDER%20ID:%20${item.id}%0A%0A✍️%20*Type%20your%20message%20below:*%0A%0A`}
										target="_blank"
										rel="noopener noreferrer"
										className="px-4 py-2 text-white transition bg-green-500 rounded-lg hover:bg-green-600"
									>
										Send us a message
									</a>

									<span className="text-xs text-gray-500">
										Available for {formatTime(timeRemaining)}
									</span>
								</div>
							)}
						</div>
					)
				})}
			</div>
		</main>
	)
}

// // "use client";

// import { useOrders } from "@/lib/firestore/orders/read";
// import { CircularProgress } from "@nextui-org/react";
// import { useEffect, useState, Suspense } from "react";
// import { useAuth } from "@/contexts/AuthContext";
// import { formatMoney } from "@/lib/helpers";
// import { useSearchParams } from 'next/navigation';

// const AccountContent = () => {
//   const searchParams = useSearchParams();
//   const { user } = useAuth();
//   const [countdowns, setCountdowns] = useState({});

//   const getTimeRemaining = (timestamp) => {
//     const deliveredTime = timestamp?.toDate()?.getTime();
//     const currentTime = new Date().getTime();
//     const timeDifference = 24 * 60 * 60 * 1000 - (currentTime - deliveredTime);
//     return timeDifference > 0 ? timeDifference : 0;
//   };

//   const { data: orders, error, isLoading } = useOrders({ uid: user?.uid });

//   useEffect(() => {
//     if (orders) {
//       const newCountdowns = orders.reduce((acc, item, index) => {
//         if (item?.status === "delivered" && item?.timestampStatusUpdate) {
//           acc[index] = getTimeRemaining(item?.timestampStatusUpdate);
//         }
//         return acc;
//       }, {});
//       setCountdowns(newCountdowns);
//     }
//   }, [orders]);

//   if (isLoading) {
//     return (
//       <div className="flex justify-center py-48">
//         <CircularProgress />
//       </div>
//     );
//   }

//   if (error) {
//     return <>{error}</>;
//   }

//   return (
//     <main className="flex flex-col gap-4 p-5">
//       <h1 className="text-2xl font-semibold">My Orders</h1>

//       {(!orders || orders.length === 0) && (
//         <div className="flex flex-col items-center justify-center gap-3 py-11">
//           <img className="h-44" src="/svgs/Empty-pana.svg" alt="" />
//           <h1>You have no order</h1>
//         </div>
//       )}

//       <div className="flex flex-col gap-3">
//         {orders?.map((item, orderIndex) => {
//           const totalAmount = item?.checkout?.line_items?.reduce(
//             (prev, curr) => prev + curr.unit_price * curr.quantity,
//             0
//           );

//           const timeRemaining = countdowns[orderIndex] ?? 0;

//           return (
//             <div key={item.id} className="flex flex-col gap-2 p-4 border rounded-lg">
//               <div className="flex gap-3">
//                 <h3>{orderIndex + 1} :</h3>
//                 <h3>{item?.id}</h3>
//                 <h3 className="px-2 py-1 text-xs text-blue-500 uppercase bg-blue-100 rounded-lg">
//                   {item?.paymentMode}
//                 </h3>
//                 <h3 className="px-2 py-1 text-xs text-green-500 uppercase bg-green-100 rounded-lg">
//                   {item?.status ?? "pending"}
//                 </h3>
//                 <h3>{formatMoney(totalAmount)}</h3>
//               </div>
//               {item?.status === "delivered" && timeRemaining > 0 && (
//                 <span className="text-xs text-gray-500">
//                   Available for {Math.floor(timeRemaining / (1000 * 60 * 60))}h{" "}
//                   {Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))}m
//                 </span>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </main>
//   );
// };

// export default function Page() {
//   return (
//     <Suspense fallback={<div className="flex justify-center py-48"><CircularProgress /></div>}>
//       <AccountContent />
//     </Suspense>
//   );
// }

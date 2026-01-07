// "use client";

// import { useUser, useUsers } from "@/lib/firestore/user/read";
// import { Avatar, Button, CircularProgress } from "@nextui-org/react";

// export default function ListView() {
//   const { data: users, error, isLoading } = useUsers();
// console.log('users: ', users)

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
//   if (!users) {
//     return <div>No users found</div>;
//   }
//   return (
//     <div className="flex flex-col flex-1 gap-3 px-5 rounded-xl md:pr-5 md:px-0">
//       <table className="border-separate border-spacing-y-3">
//         <thead>
//           <tr>
//             <th className="px-3 py-2 font-semibold bg-white rounded-l-lg border-l border-y">
//               SN
//             </th>
//             <th className="px-3 py-2 font-semibold bg-white border-y">Photo</th>
//             <th className="px-3 py-2 font-semibold text-left bg-white border-y">
//               Name
//             </th>
//             <th className="px-3 py-2 font-semibold text-left bg-white border-y">
//               Email
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {users?.data?.map((item, index) => {
//             return <Row index={index} item={item} key={item?.id} />;
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// function Row({ item, index }) {
//   return (
//     <tr>
//       <td className="px-3 py-2 text-center bg-white rounded-l-lg border-l border-y">
//         {index + 1}
//       </td>
//       <td className="px-3 py-2 text-center bg-white border-y">
//         <div className="flex justify-center">
//           <Avatar src={item?.photoURL} />
//         </div>
//       </td>
//       <td className="px-3 py-2 bg-white border-y">{item?.displayName}</td>
//       <td className="px-3 py-2 bg-white border-y">{item?.email}</td>
//     </tr>
//   );
// }

'use client'

import { useState } from 'react'
import { useUsers } from '@/lib/firestore/user/read' // Ensure correct imports for this hook
import { Avatar, CircularProgress } from '@nextui-org/react'
import CustomerInsightCard from './customerInsightCard'

export default function ListView() {
	const { data: users, error, isLoading } = useUsers()
	const [selectedCustomer, setSelectedCustomer] = useState(null) // State to track selected customer

	// Handle loading state
	if (isLoading) {
		return (
			<div>
				<CircularProgress />
			</div>
		)
	}

	// Handle error state
	if (error) {
		return <div>{error}</div>
	}

	// Handle empty state
	if (!users) {
		return <div>No users found</div>
	}

	return (
		<div className="flex flex-row gap-6">
			{/* Customer List */}
			<div className="flex flex-col flex-1 gap-3 px-5 rounded-xl md:pr-5 md:px-0">
				<table className="border-separate border-spacing-y-3">
					<thead>
						<tr>
							<th className="px-3 py-2 font-semibold bg-white rounded-l-lg border-l border-y">
								SN
							</th>
							<th className="px-3 py-2 font-semibold bg-white border-y">Photo</th>
							<th className="px-3 py-2 font-semibold text-left bg-white border-y">Name</th>
							<th className="px-3 py-2 font-semibold text-left bg-white border-y">Email</th>
						</tr>
					</thead>
					<tbody>
						{users?.data?.map((item, index) => {
							// console.log('========>',item)
							return (
								<Row
									index={index}
									item={item}
									key={item?.id}
									onSelect={() => setSelectedCustomer(item?.id)} // Handle row click to select customer
								/>
							)
						})}
					</tbody>
				</table>
			</div>

			{/* Customer Insight Card */}
			<div className="w-1/3">
				{selectedCustomer ? (
					<CustomerInsightCard uid={selectedCustomer} /> // Render insights for selected customer
				) : (
					<div className="text-center text-gray-500">Select a customer to view insights</div>
				)}
			</div>
		</div>
	)
}

function Row({ item, index, onSelect }) {
	return (
		<tr onPress={onSelect} className="cursor-pointer hover:bg-gray-100">
			<td className="px-3 py-2 text-center bg-white rounded-l-lg border-l border-y">{index + 1}</td>
			<td className="px-3 py-2 text-center bg-white border-y">
				<div className="flex justify-center">
					<Avatar src={item?.photoURL} />
				</div>
			</td>
			<td className="px-3 py-2 bg-white border-y">{item?.displayName}</td>
			<td className="px-3 py-2 bg-white border-y">{item?.email}</td>
		</tr>
	)
}

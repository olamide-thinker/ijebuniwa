'use client'

import { useState } from 'react'
import { useUsers } from '@/lib/firestore/user/read'
import { Avatar, CircularProgress } from '@nextui-org/react'
import CustomerInsightCard from './customerInsightCard'

export default function ListView() {
	const { data: users, error, isLoading } = useUsers()
	const [selectedCustomer, setSelectedCustomer] = useState(null)

	if (isLoading) {
		return (
			<div className="flex justify-center py-10">
				<CircularProgress aria-label="Loading..." />
			</div>
		)
	}

	if (error) {
		return <div className="p-5 text-red-500 font-medium">{error}</div>
	}

	if (!users) {
		return <div className="p-5 text-gray-500">No users found</div>
	}

	return (
		<div className="flex flex-col lg:flex-row gap-6 p-5">
			{/* Customer List */}
			<div className="flex flex-col flex-1 gap-3 overflow-x-auto rounded-xl">
				<table className="border-separate border-spacing-y-3">
					<thead>
						<tr>
							<th className="px-3 py-2 font-semibold bg-white rounded-l-lg border-l border-y">SN</th>
							<th className="px-3 py-2 font-semibold bg-white border-y">Photo</th>
							<th className="px-3 py-2 font-semibold text-left bg-white border-y">Name</th>
							<th className="px-3 py-2 font-semibold text-left bg-white border-y">Email</th>
						</tr>
					</thead>
					<tbody>
						{users?.data?.map((item, index) => (
							<Row
								index={index}
								item={item}
								key={item?.id}
								onSelect={() => setSelectedCustomer(item?.id)}
							/>
						))}
					</tbody>
				</table>
			</div>

			{/* Customer Insight Card */}
			<div className="lg:w-1/3">
				{selectedCustomer ? (
					<CustomerInsightCard uid={selectedCustomer} />
				) : (
					<div className="bg-white border rounded-xl p-8 text-center text-gray-500">
						Select a customer to view insights
					</div>
				)}
			</div>
		</div>
	)
}

function Row({ item, index, onSelect }) {
	return (
		<tr onClick={onSelect} className="cursor-pointer hover:bg-gray-50 transition-colors">
			<td className="px-3 py-2 text-center bg-white rounded-l-lg border-l border-y text-sm text-gray-500">{index + 1}</td>
			<td className="px-3 py-2 bg-white border-y">
				<div className="flex justify-center">
					<Avatar src={item?.photoURL} size="sm" />
				</div>
			</td>
			<td className="px-3 py-2 bg-white border-y font-medium text-sm">{item?.displayName || 'Unknown'}</td>
			<td className="px-3 py-2 bg-white border-y text-sm text-gray-600">{item?.email}</td>
		</tr>
	)
}

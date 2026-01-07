'use client'

import { useOrdersCounts } from '@/lib/firestore/orders/read_count'
import { useProductCount } from '@/lib/firestore/products/count/read_client'
import { useUsersCount } from '@/lib/firestore/user/read_count'
import { formatMoney } from '@/lib/helpers'

export default function CountMeter() {
	const { data: totalProduct } = useProductCount()
	const { data: totalUsers } = useUsersCount()
	const { data: ordersCounts } = useOrdersCounts()
	return (
		<section className="grid grid-cols-2 gap-5 md:grid-cols-4">
			<Card imgURL={'/box.png'} title={'Products'} value={totalProduct ?? 0} />
			<Card imgURL={'/received.png'} title={'Orders'} value={ordersCounts?.totalOrders ?? 0} />
			<Card
				imgURL={'/profit-up.png'}
				title={'Revenue'}
				value={`${formatMoney((ordersCounts?.totalRevenue ?? 0) / 100)}`}
			/>
			<Card imgURL={'/team.png'} title={'Customer'} value={totalUsers ?? 0} />
		</section>
	)
}

function Card({ title, value, imgURL }) {
	return (
		<div className="flex items-center justify-between w-full gap-2 px-4 py-2 bg-white shadow rounded-xl">
			<div className="flex flex-col">
				<h1 className="text-xl font-semibold">{value}</h1>
				<h1 className="text-sm text-gray-700">{title}</h1>
			</div>
			{/* <img className="h-10" src={imgURL} alt={title} /> */}
		</div>
	)
}

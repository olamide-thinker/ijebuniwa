'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useAdmin } from '@/lib/firestore/admins/read'
import { Avatar } from '@nextui-org/react'
import { Menu } from 'lucide-react'

export default function Header({ toggleSidebar, currentPage = 'Dashboard' }) {
	const { user } = useAuth()
	const { data: admin } = useAdmin({ email: user?.email })
	return (
		<section className="fixed top-0 z-50 flex items-center w-full gap-3 px-4 py-3 bg-white border-b">
			<div className="flex items-center justify-center md:hidden">
				<button onPress={toggleSidebar}>
					<Menu />
				</button>
			</div>
			<div className="w-full flex justify-between items-center pr-0 md:pr-[260px]">
				<h1 className="text-xl font-semibold">{!currentPage ? 'Dashboard' : currentPage}</h1>
				<div className="flex items-center gap-2">
					<div className="flex-col items-end hidden md:flex">
						<h1 className="text-sm font-semibold">{admin?.name}</h1>
						<h1 className="text-xs text-gray-600">{admin?.email}</h1>
					</div>
					<Avatar size="sm" src={admin?.imageURL} />
				</div>
			</div>
		</section>
	)
}

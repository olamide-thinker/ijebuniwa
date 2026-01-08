'use client'

import { auth } from '@/lib/firebase'
import { Button } from '@nextui-org/react'
import { signOut } from 'firebase/auth'
import {
	Cat,
	Layers2,
	LayoutDashboard,
	LibraryBig,
	LogOut,
	Mail,
	PackageOpen,
	ShieldCheck,
	ShoppingCart,
	Star,
	User,
	Boxes,
	FileText,
	MapPin,
	CalendarDays,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import toast from 'react-hot-toast'

export default function Sidebar() {
	const menuList = [
		{
			group: 'GENERAL',
			items: [
				{
					name: 'Dashboard',
					link: '/admin',
					icon: <LayoutDashboard className="w-5 h-5" />,
				},
			],
		},
		{
			group: 'COMMERCE',
			items: [
				{
					name: 'Products',
					link: '/admin/products',
					icon: <PackageOpen className="w-5 h-5" />,
				},
				{
					name: 'Categories',
					link: '/admin/categories',
					icon: <Layers2 className="w-5 h-5" />,
				},
				{
					name: 'Brands',
					link: '/admin/brands',
					icon: <Cat className="w-5 h-5" />,
				},
				{
					name: 'Collections',
					link: '/admin/collections',
					icon: <LibraryBig className="w-5 h-5" />,
				},
				{
					name: 'stock',
					link: '/admin/stock',
					icon: <Boxes className="w-5 h-5" />,
				},
			],
		},
		{
			group: 'RELATIONSHIPS',
			items: [
				{
					name: 'Orders',
					link: '/admin/orders',
					icon: <ShoppingCart className="w-5 h-5" />,
				},
				{
					name: 'Customers',
					link: '/admin/customers',
					icon: <User className="w-5 h-5" />,
				},
				{
					name: 'Reviews',
					link: '/admin/reviews',
					icon: <Star className="w-5 h-5" />,
				},
			],
		},
		{
			group: 'CONTENT',
			items: [
				{
					name: 'Blog',
					link: '/admin/blog',
					icon: <FileText className="w-5 h-5" />,
				},
				{
					name: 'Tourism',
					link: '/admin/tourism',
					icon: <MapPin className="w-5 h-5" />,
				},
				{
					name: 'Events',
					link: '/admin/events',
					icon: <CalendarDays className="w-5 h-5" />,
				},
			],
		},
		{
			group: 'SYSTEM',
			items: [
				{
					name: 'Admins',
					link: '/admin/admins',
					icon: <ShieldCheck className="w-5 h-5" />,
				},
			],
		},
	]
	return (
		<section className="sticky top-0 flex flex-col gap-6 bg-white border-r px-5 py-3 h-screen overflow-hidden w-[260px] z-50">
			<div className="flex justify-center py-1">
				<Link href={`/`}>
					<img className="w-full rounded-lg " src="/logo.png" alt="" />
				</Link>
			</div>
			<ul className="flex flex-col flex-1 h-full gap-4 overflow-y-auto text-sm font-normal scroll pb-10">
				{menuList?.map((group, groupKey) => (
					<div key={groupKey} className="flex flex-col gap-2">
						<div className="flex items-center gap-2 px-4 py-1">
							<span className="text-[8px] font-bold tracking-widest text-gray-400 uppercase">
								{group.group}
							</span>
							<div className="h-[1px] flex-1 bg-gray-100"></div>
						</div>
						{group.items.map((item, key) => (
							<Tab item={item} key={key} />
						))}
					</div>
				))}
			</ul>
			<div className="flex justify-center">
				<Button
					variant="light"
					size="sm"
					onPress={async () => {
						try {
							await toast.promise(signOut(auth), {
								error: (e) => e?.message,
								loading: 'Loading...',
								success: 'Successfully Logged out',
							})
						} catch (error) {
							toast.error(error?.message)
						}
					}}
					className="flex items-center gap-2 px-3 py-2 transition-all hover:bg-indigo-100 ease-soft-spring duration-400"
				>
					<LogOut className="w-5 h-5" /> Logout
				</Button>
			</div>
		</section>
	)
}

function Tab({ item }) {
	const pathname = usePathname()
	const isSelected = pathname === item?.link
	return (
		<Link href={item?.link}>
			<li
				className={`flex gap-2 w-full px-4 py-2 rounded justify-left font-semibold ease-soft-spring transition-all duration-300 hover:bg-muted
        ${isSelected ? 'bg-[#f2b824] hover:bg-[#f2a00f] ' : 'bg-white text-black'} 
        `}
			>
				{item?.icon} {item?.name}
			</li>
		</Link>
	)
}

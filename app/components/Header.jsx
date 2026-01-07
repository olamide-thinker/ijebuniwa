'use client'
import { UserCircle2, X } from 'lucide-react'
import Link from 'next/link'
import LogoutButton from './LogoutButton'
import AuthContextProvider from '@/contexts/AuthContext'
import HeaderClientButtons from './HeaderClientButtons'
import AccountButton from './AccountButton'
import AdminButton from './AdminButton'
import SearchBox from '../(pages)/search/components/SearchBox'
import { getCategories } from '@/lib/firestore/categories/read_server'
import { Button } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { useParams, usePathname, useRouter } from 'next/navigation'

export default function Header() {
	const url = usePathname()
	const path = useParams()
	const router = useRouter()
	const [categories, setCategories] = useState([])
	const [searchClicked, setSearchClicked] = useState(false)

	useEffect(() => {
		async function fetchCategories() {
			const data = await getCategories()
			setCategories(data)
		}
		fetchCategories()
	}, [])

	return (
		<header className="sticky top-0 z-50 bg-white/95 dark:bg-[#131022]/95 backdrop-blur-md border-b border-[#f1f0f4] dark:border-gray-800 transition-all duration-300">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-20">
					{/* Logo Section */}
					<Link href="/" className="flex items-center gap-3 group cursor-pointer">
						<div className="w-10 h-10 bg-[#1e1b4b] text-white rounded-lg flex items-center justify-center transform group-hover:rotate-3 transition-transform">
							<span className="material-symbols-outlined text-2xl">castle</span>
						</div>
						<div className="flex flex-col">
							<h1 className="text-xl font-serif font-bold tracking-tight text-[#121118] dark:text-white leading-none">
								Ijèbú ni wá
							</h1>
							<span className="text-[10px] tracking-widest uppercase text-[#c05621] font-bold">
								Take Ijebu Home
							</span>
						</div>
					</Link>

					{/* Desktop Menu */}
					<nav className="hidden lg:flex items-center gap-10">
						<Link
							href="/blog"
							className={`text-sm font-medium hover:text-[#c05621] transition-colors relative group py-2 ${url === '/blog' ? 'text-[#c05621]' : 'text-gray-700 dark:text-gray-200'}`}
						>
							News
							<span className={`absolute bottom-0 left-0 h-0.5 bg-[#c05621] transition-all group-hover:w-full ${url === '/blog' ? 'w-full' : 'w-0'}`}></span>
						</Link>
						<Link
							href="/products"
							className={`text-sm font-medium hover:text-[#c05621] transition-colors relative group py-2 ${url === '/products' ? 'text-[#c05621]' : 'text-gray-700 dark:text-gray-200'}`}
						>
							Marketplace
							<span className={`absolute bottom-0 left-0 h-0.5 bg-[#c05621] transition-all group-hover:w-full ${url === '/products' ? 'w-full' : 'w-0'}`}></span>
						</Link>
						<Link
							href="/categories/food"
							className={`text-sm font-medium hover:text-[#c05621] transition-colors relative group py-2 ${url?.includes('/food') ? 'text-[#c05621]' : 'text-gray-700 dark:text-gray-200'}`}
						>
							Food
							<span className={`absolute bottom-0 left-0 h-0.5 bg-[#c05621] transition-all group-hover:w-full ${url?.includes('/food') ? 'w-full' : 'w-0'}`}></span>
						</Link>
						<Link
							href="/events"
							className={`text-sm font-medium hover:text-[#c05621] transition-colors relative group py-2 ${url === '/events' ? 'text-[#c05621]' : 'text-gray-700 dark:text-gray-200'}`}
						>
							Culture
							<span className={`absolute bottom-0 left-0 h-0.5 bg-[#c05621] transition-all group-hover:w-full ${url === '/events' ? 'w-full' : 'w-0'}`}></span>
						</Link>
						<Link
							href="/attractions"
							className={`text-sm font-medium hover:text-[#c05621] transition-colors relative group py-2 ${url === '/attractions' ? 'text-[#c05621]' : 'text-gray-700 dark:text-gray-200'}`}
						>
							Attractions
							<span className={`absolute bottom-0 left-0 h-0.5 bg-[#c05621] transition-all group-hover:w-full ${url === '/attractions' ? 'w-full' : 'w-0'}`}></span>
						</Link>
					</nav>

					{/* Action Buttons */}
					<div className="flex items-center gap-5">
						{searchClicked ? (
							<div className="flex items-center gap-2">
								<SearchBox inFocus={searchClicked} />
								<button
									title="Close Search"
									className="text-gray-500 hover:text-[#c05621]"
									onClick={() => setSearchClicked(false)}
								>
									<X size={20} />
								</button>
							</div>
						) : (
							<button
								title="Search"
								className="text-gray-500 hover:text-[#c05621] dark:text-gray-300 transition-transform hover:scale-110"
								onClick={() => setSearchClicked(true)}
							>
								<span className="material-symbols-outlined">search</span>
							</button>
						)}

						<AuthContextProvider>
							<HeaderClientButtons />
						</AuthContextProvider>

						<div className="hidden sm:flex items-center gap-3 border-l border-gray-200 pl-5 ml-2 dark:border-gray-700">
							<AuthContextProvider>
								<AccountButton />
							</AuthContextProvider>

							<AuthContextProvider>
								<AdminButton />
							</AuthContextProvider>

							<AuthContextProvider>
								<LogoutButton />
							</AuthContextProvider>
						</div>
					</div>
				</div>
			</div>

			{/* Category Sub-header (Curated Dynamic Row) */}
			{!url.includes('checkout') && categories?.length > 0 && (
				<div className="bg-white/50 dark:bg-black/20 border-t border-[#f1f0f4] dark:border-gray-800 backdrop-blur-sm">
					<div className="max-w-7xl mx-auto px-4 md:px-8">
						<div className="flex items-center space-x-8 overflow-x-auto scrollbar-hide py-3">
							{categories.map((item, i) => {
								const isActive = item?.id === path.categoryId
								return (
									<button
										key={i}
										onClick={() => router.push(`/categories/${item?.id}`)}
										className={`text-[12px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors hover:text-[#c05621] ${isActive ? 'text-[#c05621]' : 'text-gray-500 dark:text-gray-400'}`}
									>
										{item?.name}
									</button>
								)
							})}
						</div>
					</div>
				</div>
			)}
		</header>
	)
}

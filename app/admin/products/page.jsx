'use client'
import Link from 'next/link'
import ListView from './components/ListView'
import BackBtn from '@/lib/backBtn'
import SearchBar from '@/app/components/ui/searchInput'
import { useState } from 'react'

export default function Page() {
	const [searchTerm, setSearchTerm] = useState('')
	return (
		<main className="flex flex-col gap-4 p-5">
			<div className="flex items-center justify-between">
				{/* <h1 className="text-xl">Products</h1> */}

				<BackBtn pageName={'Products'} />
				<div className="flex items-center gap-2">
					<SearchBar value={searchTerm} onChange={setSearchTerm} />
					<Link href={`/admin/products/form`}>
						<button className="bg-[#313131] text-sm text-white px-4 py-2 rounded-lg">Create</button>
					</Link>
				</div>
			</div>
			<ListView searchTerm={searchTerm} />
		</main>
	)
}

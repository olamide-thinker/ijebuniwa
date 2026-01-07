'use client'
import Link from 'next/link'
import ListView from './components/ListView'
import BackBtn from '@/lib/backBtn'
import { useState } from 'react'
import SearchBar from '@/app/components/ui/searchInput'

export default function Page() {
	const [searchTerm, setSearchTerm] = useState('')
	return (
		<main className="flex flex-col gap-4 p-5">
			<div className="flex items-center justify-between">
				<div className='hidden md:flex'><BackBtn pageName={'Stock'} /></div>
				<SearchBar value={searchTerm} onChange={setSearchTerm} />
				{/* <h1 className="text-xl">Products</h1> */}
				{/* <Link href={`/admin/stock/form`}>
          <button className="bg-[#313131] text-sm text-white px-4 py-2 rounded-lg">
            Create
          </button>
        </Link> */}
			</div>
			<ListView searchTerm={searchTerm} />
			{/* 
{Array.from({length:5}).map(()=>(
  <div> hello </div>
))} */}
		</main>
	)
}

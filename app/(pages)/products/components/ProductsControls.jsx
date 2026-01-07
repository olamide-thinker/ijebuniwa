'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function ProductsControls({ initialSearch, initialSort, initialMin, initialMax }) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [searchTerm, setSearchTerm] = useState(initialSearch || '')
    const [sort, setSort] = useState(initialSort || 'newest')
    const [minPrice, setMinPrice] = useState(initialMin || '')
    const [maxPrice, setMaxPrice] = useState(initialMax || '')

    // Update URL helper
    const updateURL = (updates) => {
        const params = new URLSearchParams(searchParams.toString())
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === '') {
                params.delete(key)
            } else {
                params.set(key, value)
            }
        })
        router.push(`/products?${params.toString()}`)
    }

    const handleSearch = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            updateURL({ q: searchTerm })
        }
    }

    const handleSortChange = (e) => {
        const newSort = e.target.value
        setSort(newSort)
        updateURL({ sort: newSort })
    }

    const handlePriceSubmit = () => {
        updateURL({ minPrice, maxPrice })
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Search & Sort Toolbar */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-[#f0f0f4] dark:border-gray-700 flex flex-col md:flex-row gap-4 justify-between items-center">
                {/* Search */}
                <div className="w-full md:flex-1">
                    <div className="flex w-full items-stretch rounded-lg h-12 bg-white dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 focus-within:border-[#c05621] transition-all overflow-hidden">
                        <div className="text-[#c05621] dark:text-gray-400 flex items-center justify-center pl-4 pr-2">
                            <span className="material-symbols-outlined">search</span>
                        </div>
                        <input
                            className="bg-transparent border-none w-full text-[#121118] dark:text-white placeholder:text-gray-400 focus:ring-0 text-base"
                            placeholder="Search for Adire, beads, artifacts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-[#1e1b4b] text-white px-6 font-bold hover:bg-[#c05621] transition-all duration-300"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <span className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-widest whitespace-nowrap hidden sm:block">
                        Sort by:
                    </span>
                    <div className="relative w-full md:w-48">
                        <select
                            value={sort}
                            onChange={handleSortChange}
                            className="w-full h-12 pl-4 pr-10 text-sm font-bold border border-gray-100 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[#121118] dark:text-white focus:ring-1 focus:ring-[#c05621] focus:border-[#c05621] appearance-none cursor-pointer"
                        >
                            <option value="popularity">Popularity</option>
                            <option value="newest">Newest Arrivals</option>
                            <option value="price_low">Price: Low to High</option>
                            <option value="price_high">Price: High to Low</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#c05621]">
                            <span className="material-symbols-outlined">expand_more</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Price Filter for Mobile/Sidebar (Mirrored in separate component but keeping consistent here) */}
            <div className="lg:hidden bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 space-y-4 shadow-sm">
                <h3 className="text-[#121118] dark:text-white font-bold uppercase tracking-widest text-xs">Price Range</h3>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full h-12 px-4 border border-gray-100 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-1 focus:ring-[#c05621] outline-none"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full h-12 px-4 border border-gray-100 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-1 focus:ring-[#c05621] outline-none"
                    />
                    <button
                        onClick={handlePriceSubmit}
                        className="h-12 px-6 bg-[#1e1b4b] text-white font-bold rounded-lg hover:bg-[#c05621] transition-all"
                    >
                        Go
                    </button>
                </div>
            </div>
        </div>
    )
}

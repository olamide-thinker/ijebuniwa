'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function PriceFilter({ initialMin, initialMax }) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [minPrice, setMinPrice] = useState(initialMin || '')
    const [maxPrice, setMaxPrice] = useState(initialMax || '')

    const handlePriceSubmit = () => {
        const params = new URLSearchParams(searchParams.toString())

        if (minPrice) params.set('minPrice', minPrice)
        else params.delete('minPrice')

        if (maxPrice) params.set('maxPrice', maxPrice)
        else params.delete('maxPrice')

        router.push(`/products?${params.toString()}`)
    }

    return (
        <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
            <h3 className="text-[#121118] dark:text-white font-bold text-xs uppercase tracking-widest">Price Range</h3>
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₦</span>
                        <input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-full h-11 pl-8 pr-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-600 rounded-lg text-sm text-[#121118] dark:text-white focus:ring-1 focus:ring-[#c05621] outline-none transition-all"
                        />
                    </div>
                    <span className="text-gray-300">/</span>
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₦</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full h-11 pl-8 pr-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-600 rounded-lg text-sm text-[#121118] dark:text-white focus:ring-1 focus:ring-[#c05621] outline-none transition-all"
                        />
                    </div>
                </div>
                <button
                    onClick={handlePriceSubmit}
                    className="w-full py-3 bg-[#1e1b4b] text-white text-sm font-bold rounded-lg hover:bg-[#c05621] transition-all duration-300 shadow-lg shadow-indigo-100/50"
                >
                    Apply Filter
                </button>
            </div>
        </div>
    )
}

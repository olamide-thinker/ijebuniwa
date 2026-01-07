import { fetcher } from '@/lib/globalFetcherFunc'
import { getCategories } from '@/lib/firestore/categories/read_server'
import Link from 'next/link'
import { formatMoney } from '@/lib/helpers'
import { ProductCard } from '@/app/components/Products'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import ProductsControls from './components/ProductsControls'
import PriceFilter from './components/PriceFilter'

export const dynamic = 'force-dynamic'

export default async function ProductsPage({ searchParams }) {
    const params = await searchParams
    const category = params?.category || null
    const queryTerm = params?.q || null
    const sort = params?.sort || 'newest'
    const minPrice = params?.minPrice || null
    const maxPrice = params?.maxPrice || null
    const page = parseInt(params?.page || '1', 10)

    // Translate sort to fetcher args
    let orderByField = 'timestampCreate'
    let orderByDirection = 'desc'

    if (sort === 'price_low') {
        orderByField = 'price'
        orderByDirection = 'asc'
    } else if (sort === 'price_high') {
        orderByField = 'price'
        orderByDirection = 'desc'
    } else if (sort === 'popularity') {
        orderByField = 'orders'
        orderByDirection = 'desc'
    }

    // Define filters
    const filters = {}
    if (category) filters.category = category
    if (minPrice) filters.minPrice = minPrice
    if (maxPrice) filters.maxPrice = maxPrice

    // Fetch products and categories
    // If searching, fetch a larger set to allow meaningful client-side filtering
    const fetchLimit = queryTerm ? 200 : 40
    const productsData = await fetcher('products', fetchLimit, null, orderByField, orderByDirection, filters)
    const categories = await getCategories()

    // Serialize data
    const serializeData = (data) => {
        if (!Array.isArray(data)) return []
        return data.map((product) => ({
            ...product,
            timestampCreate: product.timestampCreate ? product.timestampCreate.toMillis() : null,
            timestampUpdate: product.timestampUpdate ? product.timestampUpdate.toMillis() : null,
        }))
    }

    let products = serializeData(productsData?.data || productsData || [])

    // Client-side search for partial matches (Firestore fallback)
    if (queryTerm && products.length > 0) {
        products = products.filter(p =>
            p.title?.toLowerCase().includes(queryTerm.toLowerCase()) ||
            p.shortDescription?.toLowerCase().includes(queryTerm.toLowerCase()) ||
            p.brand?.toLowerCase().includes(queryTerm.toLowerCase())
        )
    }

    return (
        <div className="flex flex-col min-h-screen">

            {/* Main Content Wrapper */}
            <main className="flex-grow">
                {/* Hero Header Section */}
                <section className="relative h-64 md:h-80 w-full overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Marketplace Hero"
                        className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 max-w-7xl mx-auto">
                        <h1 className="text-white text-4xl md:text-5xl font-serif font-medium tracking-tight mb-2 drop-shadow-md">
                            Treasures of Ijebu
                        </h1>
                        <p className="text-white/90 text-lg font-light max-w-xl drop-shadow-sm opacity-90 tracking-wide">
                            Discover handcrafted heritage pieces, from royal adire textiles to exquisite beads.
                        </p>
                    </div>
                </section>

                {/* Breadcrumbs & Marketplace */}
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 relative bg-[length:24px_24px] bg-[position:0_0,12px_12px]" style={{
                    backgroundImage: 'radial-gradient(#e5e0d6 1px, transparent 1px), radial-gradient(#e5e0d6 1px, #fcfbf9 1px)'
                }}>
                    <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c05621] mb-8 relative z-10">
                        <Link href="/" className="hover:opacity-75">Home</Link>
                        <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                        <span className="opacity-60">Marketplace</span>
                    </nav>

                    <div className="flex flex-col lg:flex-row gap-10 relative z-10">
                        {/* Sidebar */}
                        <aside className="w-full lg:w-64 flex-shrink-0">
                            <div className="flex flex-col gap-10 sticky top-24">
                                {/* Categories */}
                                <div className="space-y-6">
                                    <h3 className="text-[#c05621] font-bold tracking-widest text-xs uppercase">
                                        Categories
                                    </h3>
                                    <nav className="flex flex-col gap-3">
                                        <Link
                                            href="/products"
                                            className={`text-sm font-bold transition-all py-1 border-l-2 pl-4 ${!category ? 'border-[#1e1b4b] text-[#1e1b4b]' : 'border-transparent text-gray-500 hover:text-[#c05621]'}`}
                                        >
                                            All Treasures
                                        </Link>
                                        {categories.map((cat) => (
                                            <Link
                                                key={cat.id}
                                                href={`/products?category=${cat.id}`}
                                                className={`text-sm font-bold transition-all py-1 border-l-2 pl-4 ${category === cat.id ? 'border-[#1e1b4b] text-[#1e1b4b]' : 'border-transparent text-gray-500 hover:text-[#c05621]'}`}
                                            >
                                                {cat.name}
                                            </Link>
                                        ))}
                                    </nav>
                                </div>

                                {/* Price Range */}
                                <PriceFilter initialMin={minPrice} initialMax={maxPrice} />
                            </div>
                        </aside>

                        {/* Product Content */}
                        <div className="flex-1 flex flex-col gap-6">
                            <ProductsControls
                                initialSearch={queryTerm}
                                initialSort={sort}
                                initialMin={minPrice}
                                initialMax={maxPrice}
                            />

                            {/* Product Grid */}
                            {products.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {products.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">inventory_2</span>
                                    <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400">No treasures found</h3>
                                    <p className="text-gray-400 mt-1">Try adjusting your filters or search term</p>
                                    <Link href="/products" className="mt-6 text-[#1e1b4b] font-bold hover:underline">
                                        Clear all filters
                                    </Link>
                                </div>
                            )}

                            {/* Load More */}
                            {products.length >= 40 && (
                                <div className="flex justify-center mt-8 mb-12">
                                    <button className="px-8 py-3 bg-[#1e1b4b] text-white font-bold rounded-lg hover:bg-[#c05621] transition-colors shadow-lg hover:shadow-[#1e1b4b]/30 flex items-center gap-2">
                                        Load More Products
                                        <span className="material-symbols-outlined text-sm">arrow_downward</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

        </div>
    )
}

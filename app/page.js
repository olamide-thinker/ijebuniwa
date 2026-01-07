import { fetcher } from '@/lib/globalFetcherFunc'
import { getCollections } from '@/lib/firestore/collections/read_server'
import { getCategories } from '@/lib/firestore/categories/read_server'
import { getBrands } from '@/lib/firestore/brands/read_server'
import Link from 'next/link'
import { formatMoney } from '@/lib/helpers'
import { ProductCard } from '@/app/components/Products'
import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'

export const dynamic = 'force-dynamic'

export default async function Home({ searchParams }) {
	const category = (await searchParams)?.category || null
	const page = parseInt((await searchParams)?.page || '1', 10)

	// Define filters object
	const filters = {}
	if (category) {
		filters.category = category
	}

	// Fetch featured products
	const featuredProductsData = await fetcher('products', 8, null, 'timestampCreate', 'desc', {
		isFeatured: true,
	})

	// Function to serialize data
	const serializeData = (data) => {
		if (!Array.isArray(data)) return []
		return data.map((product) => ({
			...product,
			timestampCreate: product.timestampCreate ? product.timestampCreate.toMillis() : null,
			timestampUpdate: product.timestampUpdate ? product.timestampUpdate.toMillis() : null,
		}))
	}

	const featuredProducts = serializeData(featuredProductsData?.data || featuredProductsData || [])

	// Fetch collections, categories, and brands
	const [collections, categories, brands] = await Promise.all([
		getCollections(),
		getCategories(),
		getBrands(),
	])

	return (
		<main className="flex flex-col min-h-screen bg-[#fcfbf9] dark:bg-[#131022] text-[#121118] dark:text-white font-['Plus_Jakarta_Sans',sans-serif]">
			<Header />

			{/* Hero Section */}
			<section className="relative w-full h-[650px] flex items-center justify-center overflow-hidden">
				<div className="absolute inset-0 z-0">
					<div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70 z-10 mix-blend-multiply"></div>
					<div
						className="w-full h-full bg-cover bg-center animate-[kenburns_20s_infinite_alternate]"
						style={{
							backgroundImage:
								"url('https://lh3.googleusercontent.com/aida-public/AB6AXuAymo-iGhAD7lsI6wLw2xKV9Q0knPsuS1MwmIV0fV1RiL7UTyG0ESymQWamTmS7m0L2lGdz5hmaZ7api_vGistSw_sEH3IIJnGaVGX8e3XSG0V3hh8v2TbSxnm0karK21C3qr2Zgv64qsPOV0HqgCB88H5J-BoAOIDn-awzx8lKEqInweepl47ZpN3CVUbAPbtSkt0O8w0r5_mY0HPAyXNUvEr1DJWUno-mJ2aiM5duMuz-2chi6Ds9y3gywYPx1rkLL3Q6WTA3j-xx')",
							transformOrigin: 'center',
						}}
					></div>
				</div>
				<div className="relative z-20 w-full max-w-5xl px-4 text-center mt-12">
					<div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-widest uppercase mb-6 shadow-lg">
						<span className="w-2 h-2 rounded-full bg-[#c05621]"></span> Welcome Home
					</div>
					<h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-serif font-medium tracking-tight mb-6 leading-tight drop-shadow-lg">
						Experience the <br />
						<span className="italic font-light">Heart of Ijebu</span>
					</h1>
					<p className="text-white/90 text-lg md:text-xl font-light max-w-2xl mx-auto mb-12 drop-shadow-md tracking-wide">
						Discover the heritage, taste the culture, and bring authentic Ijebu artifacts home. A curated
						marketplace for the diaspora.
					</p>
					<div className="bg-white/95 backdrop-blur-xl p-2 rounded-2xl shadow-2xl max-w-2xl mx-auto flex flex-col md:flex-row gap-2 border border-white/50">
						<div className="flex-1 flex items-center px-4 h-14 bg-transparent rounded-xl focus-within:bg-gray-50 transition-colors">
							<span className="material-symbols-outlined text-[#c05621] mr-3">search</span>
							<input
								className="bg-transparent border-none w-full text-gray-800 placeholder-gray-400 focus:ring-0 p-0 text-base font-medium"
								placeholder="Search for Adire, Garri, Hotels..."
								type="text"
							/>
						</div>
						<Link
							href="/search"
							className="h-14 px-8 bg-[#1e1b4b] hover:bg-[#c05621] text-white font-bold rounded-xl transition-all duration-300 active:scale-95 shadow-lg flex items-center justify-center gap-2"
						>
							<span>Explore</span>
						</Link>
					</div>
				</div>
				<div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-[#fcfbf9] dark:from-[#131022] to-transparent z-10"></div>
			</section >

			{/* Marketplace Section */}
			< section className="py-20 px-4 md:px-8 max-w-7xl mx-auto w-full relative bg-[length:24px_24px] bg-[position:0_0,12px_12px]" style={{
				backgroundImage: 'radial-gradient(#e5e0d6 1px, transparent 1px), radial-gradient(#e5e0d6 1px, #fcfbf9 1px)'
			}
			}>
				<div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 relative z-10">
					<div>
						<span className="text-[#c05621] font-bold tracking-widest text-xs uppercase mb-2 block">
							Curated Collection
						</span>
						<h2 className="text-4xl md:text-5xl font-serif text-[#121118] dark:text-white">
							The Marketplace
						</h2>
					</div>
					<div className="flex overflow-x-auto scrollbar-hide bg-white dark:bg-gray-800 p-1.5 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
						<button className="whitespace-nowrap px-6 py-2 rounded-full bg-[#1e1b4b] text-white text-sm font-bold shadow-md transition-all">
							All
						</button>
						{categories?.slice(0, 3).map((cat) => (
							<Link
								key={cat.id}
								href={`/categories/${cat.id}`}
								className="whitespace-nowrap px-6 py-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium transition-all"
							>
								{cat.name}
							</Link>
						))}
					</div>
				</div>

				{/* Product Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
					{featuredProducts?.slice(0, 4).map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>

				<div className="mt-12 text-center">
					<Link
						href="/products"
						className="inline-flex items-center gap-2 text-[#1e1b4b] font-bold hover:underline underline-offset-4 decoration-2"
					>
						View All Products <span className="material-symbols-outlined">arrow_forward</span>
					</Link>
				</div>
			</section >

			{/* Cultural Discovery Section */}
			< section className="py-20 px-4 md:px-8 bg-[#1a1727] text-white overflow-hidden relative" >
				<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c05621]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
				<div className="max-w-7xl mx-auto relative z-10">
					<div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
						<div>
							<span className="text-[#c05621] font-bold tracking-widest text-xs uppercase mb-2 block">
								Immersive Stories
							</span>
							<h2 className="text-4xl md:text-5xl font-serif text-white">Cultural Discovery</h2>
						</div>
						<p className="text-gray-400 mt-2 md:mt-0 font-light text-lg">
							Explore the ancient legends that shape our heritage.
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-5 h-auto md:h-[600px]">
						{/* Featured Story */}
						<div className="col-span-1 md:col-span-2 row-span-2 relative rounded-3xl overflow-hidden group cursor-pointer border border-white/5">
							<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>
							<div
								className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
								style={{
									backgroundImage:
										"url('https://lh3.googleusercontent.com/aida-public/AB6AXuCv980OsFrVVDkKKI-4HNWFUxZvFffenyDygp2y0KJPyqE2wUNmOkC4f-ONVVSow20gwp-072vABKR5UQQO7JvyDBAKLxE9L0IvJu5G75vuETZ004RXUwbmtyFTv1lwxCBgnTiT05gtzhYPFbckh6FO8OgoSU0KMBFuYC4M_HlK_wWypVnsMT0I8_fLHh2kphRHaZ3YfmVxjiWFLdktAMV1Vyw6qRX3-tLlXcGDet28twd1_IUsoFStuMCvOaREGBdI-FihLAWsCav2')",
								}}
							></div>
							<div className="absolute bottom-0 left-0 p-8 z-20 w-full transition-transform duration-300 group-hover:-translate-y-2">
								<span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded mb-4 border border-white/10">
									Tourist Attraction
								</span>
								<h3 className="text-4xl font-serif font-bold text-white mb-3">Sungbo's Eredo</h3>
								<p className="text-white/80 line-clamp-2 mb-6 font-light text-lg">
									A rampart system built a millennium ago, longer than the Great Wall of China. Discover
									the legend of Queen Bilikisu.
								</p>
								<div className="flex items-center gap-2 text-[#c05621] font-bold text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
									Read Story <span className="material-symbols-outlined text-sm">arrow_forward</span>
								</div>
							</div>
						</div>

						{/* Secondary Stories */}
						<div className="col-span-1 md:col-span-2 row-span-1 relative rounded-3xl overflow-hidden group cursor-pointer border border-white/5">
							<div className="absolute inset-0 bg-gradient-to-r from-[#1e1b4b]/90 via-transparent to-transparent z-10"></div>
							<div
								className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
								style={{
									backgroundImage:
										"url('https://lh3.googleusercontent.com/aida-public/AB6AXuBmirMl-6UfuX59NYHMrIsFLO1bHoh41aapXY-ES0lmG3bkT4AWd8wU90yoUwY9FctPliuHb_J2jdCUgiyrJW0kcVZ4WDxMzofD33OXlabwtL7Vfh9N3JjtBFCzPTT_WoRiOh0wX9dgzWnVfJKzhvM0nK1HlswvS5eoZhU6cAMu4psDCqBBmjKFhyXavYaKMEJWaOQLWlgQCO6MOe1yl--XhTbVnDSAogGT7OX64mAcy66s8rPLYR7yz1wYjFZc-ijQv9MFHqP-q50J')",
								}}
							></div>
							<div className="absolute inset-0 p-8 z-20 flex flex-col justify-center max-w-md">
								<span className="text-[#c05621] font-bold text-xs uppercase tracking-widest mb-2">
									Heritage Event
								</span>
								<h3 className="text-3xl font-serif font-bold text-white mb-2 leading-tight">
									The Grandeur of <br />
									Ojude Oba
								</h3>
								<p className="text-white/80 text-sm font-light mb-4">
									A yearly celebration of culture, fashion, and equestrian prowess.
								</p>
							</div>
						</div>

						<div className="col-span-1 md:col-span-1 row-span-1 relative rounded-3xl overflow-hidden group cursor-pointer border border-white/5">
							<div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors z-10"></div>
							<div
								className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
								style={{
									backgroundImage:
										"url('https://lh3.googleusercontent.com/aida-public/AB6AXuB-U0Ko74Iu7JghGG5cdwStGIMSRLNxuQ5bNQpSo3gNCqqZwEbth9_RHlQ713BdTMwmX7yjyRhAOqvwdGBkpyPMRA8NL-6U2OG_BAyZEQEhGU8ED7NgKgeR377bcAByw492cC0WIdUJUm3rsvT_P0jNjr_ngPTohOqq7dUhTNwiklpN-OASOEXwQ6uGpqMQbSF97WQg2UTSKG8iqlnSKFI9ZNnX4ZKnDjSsSuqNMuv3YdRbdrXv0IcvrqnVncnvb0K7m82Eidxb91ae')",
								}}
							></div>
							<div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-20">
								<div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
									<span className="material-symbols-outlined text-white text-2xl">museum</span>
								</div>
								<h3 className="text-xl font-serif font-bold text-white">Virtual Museum</h3>
								<span className="text-xs text-white/70 mt-1">360° Tours</span>
							</div>
						</div>

						<div className="col-span-1 md:col-span-1 row-span-1 relative rounded-3xl overflow-hidden group bg-gradient-to-br from-[#c05621] to-[#7c4a3a] border border-white/5">
							<div className="relative z-10 p-6 flex flex-col h-full justify-between">
								<div>
									<div className="flex justify-between items-start">
										<span className="material-symbols-outlined text-white/50 text-4xl">
											calendar_month
										</span>
										<span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold">
											UPCOMING
										</span>
									</div>
									<h3 className="text-xl font-serif font-bold text-white mt-4">Agemo Festival</h3>
								</div>
								<div>
									<div className="bg-black/20 rounded-lg p-3 mb-3 backdrop-blur-sm">
										<p className="text-white text-lg font-bold">DEC 12</p>
										<p className="text-white/80 text-xs">Grand Finale - Ijebu Ode</p>
									</div>
									<Link
										href="/events"
										className="text-white/90 hover:text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2"
									>
										View Calendar{' '}
										<span className="material-symbols-outlined text-xs">arrow_forward</span>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section >

			{/* News Section */}
			< section className="py-20 px-4 md:px-8 max-w-7xl mx-auto w-full" >
				<div className="flex items-center gap-4 mb-10">
					<h2 className="text-3xl md:text-4xl font-serif font-bold text-[#121118] dark:text-white">
						What's Happening
					</h2>
					<div className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-700"></div>
					<Link href="/blog" className="text-sm font-bold text-gray-500 hover:text-[#1e1b4b] transition-colors">
						View all news
					</Link>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<article className="md:col-span-2 group cursor-pointer">
						<div
							className="w-full aspect-video rounded-2xl bg-gray-200 bg-cover bg-center mb-6 overflow-hidden relative"
							style={{
								backgroundImage:
									"url('https://lh3.googleusercontent.com/aida-public/AB6AXuBj6x9Y2AfoQKGvoSLi3PpoGwS_aMiA9s2Iv96Eit1CffCKXA1YWeQFFhh1mHqmpdYtwz1lo2zuBHazObdBTNILIFtEo5EqQS3wEmZwwcxbemjIiRNmuyklE8p27o4He7yrDtJSWObaAx6LKMJvAljFt1vwjwVpjn5Je5YybTgj3RyuLAIufd-Jc1GUUnLoClf1dlNBhabTpUWBVDNiEWm0L9qZK6OnVmfY2izVwpSXG72UU3clPPBsXP8nUypG4lI9x7a-mBpfEkqg')",
							}}
						>
							<div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
						</div>
						<div className="flex items-center gap-3 mb-3 text-xs font-bold uppercase tracking-wider">
							<span className="text-[#1e1b4b]">Policy</span>
							<span className="text-gray-300">|</span>
							<span className="text-gray-400">2 hours ago</span>
						</div>
						<h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-3 group-hover:text-[#1e1b4b] transition-colors">
							Ogun State Government announces new tourism initiative for Ijebu region
						</h3>
						<p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed line-clamp-2">
							The new 'Heritage First' policy aims to boost infrastructure around key cultural sites
							including the Bilikisu Sungbo Shrine, promising a 40% increase in preservation funding.
						</p>
					</article>
					<div className="flex flex-col gap-8">
						<article className="flex gap-4 group cursor-pointer">
							<div
								className="w-24 h-24 rounded-xl bg-gray-200 bg-cover bg-center shrink-0"
								style={{
									backgroundImage:
										"url('https://lh3.googleusercontent.com/aida-public/AB6AXuD5wAg798AlJD1ZKQRXzgIOH3c71MRSwvJKAwpa27E8JUyjbyS40YYeIxwcUlQ7YjMbSQ1rgGutirMomFiJfV5lmLsXF1q6ioCy-G0yN9QX8_yZivCO2vCYuszfh2dox6--VMhgghTIl0l_m9b84y2cPHTwDqU3j4WziwAju7HcSf0hiBVFKWxgJFDyVJOo2qBy-V7eXKms2ghWXDtSkdrD07DQtDuPyb0QQMlmze21YXzNa5uExhh1S2OMmxeDjsQCFUbl9HkFrSPC')",
								}}
							></div>
							<div>
								<div className="flex items-center gap-2 mb-2 text-[10px] font-bold uppercase tracking-wider">
									<span className="text-[#c05621]">Community</span>
									<span className="text-gray-400">Yesterday</span>
								</div>
								<h3 className="text-lg font-serif font-bold text-gray-900 dark:text-white leading-tight group-hover:text-[#c05621] transition-colors">
									Local Potter Wins National Craft Award
								</h3>
							</div>
						</article>
					</div>
				</div>
			</section >

			{/* Vendor CTA */}
			< section className="mt-16 bg-[#131022] relative overflow-hidden" >
				<div className="max-w-7xl mx-auto px-4 py-24 md:px-8 flex flex-col md:flex-row items-center justify-between gap-16 relative z-10">
					<div className="max-w-2xl">
						<span className="text-[#c05621] font-bold tracking-widest uppercase text-xs mb-4 block">
							Vendor Portal
						</span>
						<h2 className="text-4xl md:text-6xl font-serif font-medium text-white mb-6">
							Take Your Craft <br />
							to the World
						</h2>
						<p className="text-gray-300 text-xl font-light mb-10 leading-relaxed">
							Are you an artisan, farmer, or hotelier in Ijebu? Join our curated marketplace and connect
							with thousands of customers globally.
						</p>
						<div className="flex flex-wrap gap-4">
							<Link
								href="/admin"
								className="bg-[#c05621] hover:bg-[#a84616] text-white font-bold py-4 px-10 rounded-xl transition-colors flex items-center gap-3 shadow-lg shadow-[#c05621]/20"
							>
								Become a Vendor <span className="material-symbols-outlined">storefront</span>
							</Link>
							<button className="bg-transparent border border-white/20 hover:bg-white/10 text-white font-bold py-4 px-10 rounded-xl transition-colors">
								Learn More
							</button>
						</div>
					</div>
				</div>
			</section >

			{/* Footer */}
			<Footer />
		</main >
	)
}

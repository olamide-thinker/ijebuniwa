import Link from 'next/link'

export default function Footer() {
	return (
		<footer className="bg-[#fcfbf9] dark:bg-[#131022] pt-20 pb-10 border-t border-gray-100 dark:border-gray-800">
			<div className="max-w-7xl mx-auto px-4 md:px-8">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
					<div>
						<div className="flex items-center gap-3 mb-6">
							<span className="material-symbols-outlined text-[#1e1b4b] text-4xl">castle</span>
							<h2 className="text-2xl font-serif font-bold text-[#121118] dark:text-white">
								Ijèbú ni wá
							</h2>
						</div>
						<p className="text-gray-500 text-base font-light mb-8 leading-relaxed max-w-sm">
							Connecting the Ijebu nation to the world. A digital bridge for commerce, culture, and
							community. Experience the heritage, wherever you are.
						</p>
					</div>
					<div>
						<h3 className="text-sm font-bold text-[#121118] dark:text-white uppercase tracking-widest mb-6">
							Discover
						</h3>
						<ul className="flex flex-col gap-4">
							<li>
								<Link
									href="/products"
									className="text-gray-500 hover:text-[#c05621] text-sm transition-colors"
								>
									Marketplace
								</Link>
							</li>
							<li>
								<Link
									href="/categories/food"
									className="text-gray-500 hover:text-[#c05621] text-sm transition-colors"
								>
									Food Planet
								</Link>
							</li>
							<li>
								<Link
									href="/events"
									className="text-gray-500 hover:text-[#c05621] text-sm transition-colors"
								>
									Culture & Art
								</Link>
							</li>
							<li>
								<Link
									href="/attractions"
									className="text-gray-500 hover:text-[#c05621] text-sm transition-colors"
								>
									Attractions
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h3 className="text-sm font-bold text-[#121118] dark:text-white uppercase tracking-widest mb-6">
							Support
						</h3>
						<ul className="flex flex-col gap-4">
							<li>
								<Link
									href="/help"
									className="text-gray-500 hover:text-[#c05621] text-sm transition-colors"
								>
									Help Center
								</Link>
							</li>
							<li>
								<Link
									href="/admin"
									className="text-gray-500 hover:text-[#c05621] text-sm transition-colors"
								>
									Vendor Login
								</Link>
							</li>
							<li>
								<Link
									href="/terms"
									className="text-gray-500 hover:text-[#c05621] text-sm transition-colors"
								>
									Terms of Service
								</Link>
							</li>
							<li>
								<Link
									href="/privacy"
									className="text-gray-500 hover:text-[#c05621] text-sm transition-colors"
								>
									Privacy Policy
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h3 className="text-sm font-bold text-[#121118] dark:text-white uppercase tracking-widest mb-6">
							Stay Connected
						</h3>
						<p className="text-gray-500 text-sm mb-4 font-light">
							Subscribe to our newsletter for updates on festivals and new arrivals.
						</p>
						<form className="flex flex-col gap-3">
							<input
								className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-[#1e1b4b] focus:ring-0 transition-all"
								placeholder="Your email address"
								type="email"
							/>
							<button className="bg-[#1e1b4b] text-white text-sm font-bold py-3 rounded-lg hover:bg-[#3211d4] transition-colors shadow-lg shadow-indigo-200">
								Subscribe
							</button>
						</form>
					</div>
				</div>
				<div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
					<p className="text-gray-400 text-xs">© 2024 Ijèbú ni wá. Powered by Tradition.</p>
				</div>
			</div>
		</footer>
	)
}

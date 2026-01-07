'use client'
import React, { useRef, useState } from 'react'
import { Button } from '@nextui-org/react'
import { IoArrowBackSharp, IoArrowForwardSharp } from 'react-icons/io5'
import Slider from 'react-slick'
import Link from 'next/link'
import FavoriteButton from './FavoriteButton'
import AuthContextProvider from '@/contexts/AuthContext'
import AddToCartButton from './AddToCartButton'
import { Share } from '@mui/icons-material'
import ShareButton from './socialShare'
import { useRouter } from 'next/navigation'
import { Helmet } from 'react-helmet'

export default function FeaturedProductSlider({ featuredProducts }) {
	const sliderRef = useRef(null)
	const [activeSlide, setActiveSlide] = useState(0) // Track the active slide index

	const settings = {
		infinite: true,
		autoplay: true,
		autoplaySpeed: 5000,
		cssEase: 'linear',
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		afterChange: (current) => setActiveSlide(current), // Update active slide index on change
	}

	const next = () => {
		sliderRef.current.slickNext()
	}

	const previous = () => {
		sliderRef.current.slickPrev()
	}

	const router = useRouter()

	return (
		<div className="relative overflow-hidden">
			<Slider ref={sliderRef} {...settings}>
				{featuredProducts?.map((product, i) => (
					<div key={i} className="border ">
						<Helmet>
							<meta property="og:title" content={product.title} />
							<meta
								property="og:description"
								content={product?.shortDescription || 'no description.'}
							/>
							<meta property="og:image" content={product?.featureImageURL} />
							<meta
								property="og:url"
								content={`https://www.laptopwarehouseonline.net/products/${product?.id}`}
							/>
						</Helmet>
						<div className="flex flex-col-reverse md:flex-row gap-4 bg-[#f8f8f8] p-5 lg:px-24 md:py-20 w-full">
							{/* Text Section */}
							<div
								className={`flex flex-col flex-1 gap-4 md:gap-10 transition-opacity duration-500 ${
									activeSlide === i ? 'animate-fadeInUp opacity-100' : 'opacity-0'
								}`}
							>
								<h2
									className={`text-xs text-gray-500 md:text-base transition-all ${
										activeSlide === i ? 'animate-fadeInUp animation-delay-200' : ''
									}`}
								>
									Featured
								</h2>
								<div className="flex flex-col gap-4">
									<Link href={`/products/${product?.id}`}>
										<h1
											className={`text-xl font-semibold md:text-4xl transition-all ${
												activeSlide === i ? 'animate-fadeInUp animation-delay-400' : ''
											}`}
										>
											{product?.title}
										</h1>
									</Link>
									<p
										className={`text-xs text-gray-600 md:text-sm max-w-96 line-clamp-4 transition-all ${
											activeSlide === i ? 'animate-fadeInUp animation-delay-600' : ''
										}`}
									>
										{product?.shortDescription}
									</p>
								</div>
								<AuthContextProvider>
									<div
										className={`flex items-center gap-4 transition-all ${
											activeSlide === i ? 'animate-fadeInUp animation-delay-800' : ''
										}`}
									>
										<Link href={`/checkout?type=buynow&productId=${product?.id}`}>
											<Button
												disabled={product?.stock <= (product?.orders < 0)}
												className={`flex-1 ${
													product?.stock <= (product?.orders < 0) ? 'bg-secondary' : 'bg-[#FDC321]'
												} px-4 py-2 rounded-lg text-xs font-bold w-full`}
											>
												SHOP NOW
											</Button>
										</Link>
										<AddToCartButton
											productId={product?.id}
											isDisabled={product?.stock <= (product?.orders < 0)}
										/>
										<FavoriteButton productId={product?.id} />
									</div>
								</AuthContextProvider>
							</div>

							{/* Image Section */}
							<div
								className={`transition-opacity p-0 md:p-4 flex duration-500 ${
									activeSlide === i ? 'animate-bounceIn opacity-100' : 'opacity-0'
								}`}
							>
								<Link href={`/products/${product?.id}`}>
									<img
										className="h-[20rem]  md:h-[23rem] rounded-lg object-contain "
										src={product?.featureImageURL}
										alt=""
									/>
								</Link>
								<div className="flex items-center h-full sm:items-start">
									<ShareButton
										url={`https://www.laptopwarehouseonline.net/products/${product?.id}`}
										title={product?.title}
									/>
								</div>
							</div>
						</div>
					</div>
				))}
			</Slider>

			{/* Navigation Buttons */}
			<div className="absolute space-x-4 bottom-4 right-8">
				<Button isIconOnly variant="light" className="button group" onPress={previous}>
					<IoArrowBackSharp className="group-hover:scale-125 ease-soft-spring" size={18} />
				</Button>
				<Button isIconOnly variant="light" className="button group" onPress={next}>
					<IoArrowForwardSharp
						className="group-hover:scale-125 group-focus:scale-90 ease-soft-spring"
						size={18}
					/>
				</Button>
			</div>
		</div>
	)
}

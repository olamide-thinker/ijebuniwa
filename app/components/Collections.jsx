'use client'

import { Button } from '@nextui-org/react'
import { collection } from 'firebase/firestore'
import { Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Slider from 'react-slick'

export default function Collections({ collections }) {
	var settings = {
		dots: true,
		infinite: false,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 2,
		initialSlide: 0,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 2,
					infinite: true,
					dots: true,
				},
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
					initialSlide: 2,
				},
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
		],
	}

	if (collections.length === 0) {
		return <></>
	}

	return (
		<div className="p-2 py-8 overflow-hidden md:p-10 bg-gradient-to-tr to-[#d9e2f1] from-[#cce7f5]">
			<Slider {...settings}>
				{(collections?.length <= 2
					? [...collections, ...collections, ...collections]
					: collections
				)?.map((collection, i) => {
					return (
						<div key={i} className="p-2 overflow-visible">
							<div className="flex gap-2 items-center justify-between bg-secondary  shadow-sm shadow-gray-300 p-4  rounded-xl md:h-[150px] h-[120px]">
								{/* <div className="flex gap-2 justify-between bg-gradient-to-tr to-[#d9e2f1] from-[#cce7f5] p-4  rounded-xl h-[130px]"> */}
								<div className="flex flex-col w-full gap-2">
									<div className="flex flex-col gap-2">
										<h1 className="text-base font-semibold md:text-lg">{collection?.title}</h1>
										<h1 className="text-xs text-gray-600 md:text-sm max-w-96 line-clamp-2">
											{collection?.subTitle}
										</h1>
									</div>
									<div className="flex gap-4">
										<Link href={`/collections/${collection?.id}`}>
											<Button
												disabled={collection?.stock <= (collection?.orders < 0)}
												className={`flex-1   ${collection?.stock <= (collection?.orders < 0) ? 'bg-secondary' : 'bg-[#FDC321]'} px-4 py-2 rounded-lg text-xs font-bold w-full`}
											>
												SHOP NOW
											</Button>
										</Link>
									</div>
								</div>

								<div className=" w-fit">
									<Image
										className="md:h-[8rem] md:w-[16rem] h-[6rem] w-[8rem] object-cover  rounded-lg"
										src={collection?.imageURL}
										alt={collection?.title}
										height={600}
										width={900}
									/>
								</div>
							</div>
						</div>
					)
				})}
			</Slider>
		</div>
	)
}

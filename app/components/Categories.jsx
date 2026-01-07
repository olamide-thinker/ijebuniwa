'use client'

import { Button } from '@nextui-org/react'
import { collection } from 'firebase/firestore'
import { Heart } from 'lucide-react'
import Link from 'next/link'
import Slider from 'react-slick'

export default function Categories({ categories }) {
	var settings = {
		dots: true,
		infinite: false,
		speed: 500,
		slidesToShow: 5,
		slidesToScroll: 5,
		initialSlide: 0,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 4,
					slidesToScroll: 4,
					infinite: true,
					dots: true,
				},
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 3,
					initialSlide: 3,
				},
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 2,
				},
			},
		],
	}

	if (categories.length === 0) {
		return <></>
	}

	return (
		<div className="flex flex-col justify-center gap-8 p-4 overflow-hidden">
			{/* <div className="flex justify-center w-full">
          <h1 className="text-lg font-semibold">Shop By Category</h1>
        </div> */}
			<Slider {...settings}>
				{(categories?.length <= 2
					? [...categories, ...categories, ...categories]
					: categories
				)?.map((category, i) => {
					return (
						<Link key={i} href={`/categories/${category?.id}`} className="p-2">
							<div className="p-5 mx-2 bg-white rounded-md shadow-sm hover:bg-secondary md:p-10">
								<div className="flex flex-col items-center justify-center gap-2">
									{/* <div className="w-16 h-16 p-2 overflow-hidden border rounded-full md:h-32 md:w-32 md:p-5"> */}
									<img
										src={category?.imageURL}
										alt=""
										className="object-cover w-16 h-16 overflow-hidden border rounded-full md:h-16 md:w-16 "
									/>
									{/* </div> */}
									<h1 className="font-semibold text-center whitespace-nowrap">{category?.name}</h1>
								</div>
							</div>
						</Link>
					)
				})}
			</Slider>
		</div>
	)
}

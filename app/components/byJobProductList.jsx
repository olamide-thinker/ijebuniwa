// 'use client'
// import { Button } from "@nextui-org/react";
// import React from "react";
// import { ProductCard_Large } from "./Products";
// import Slider from "react-slick";

// // brandId: 'Lv3ckjSnjXW4UvOHZeF1',
// // stock: 100,
// // categoryId: 'qLpTzyHfbztkvP6J2qwM',
// // price: 1000000,
// // id: 'IvqDzvT0mOp46eZ2zEew',
// // orders: 2,

// // Helper function to chunk the products
// const chunkProducts = (products, chunkSize) => {
//   const chunks = [];
//   for (let i = 0; i < products.length; i += chunkSize) {
//     chunks.push(products.slice(i, i + chunkSize));
//   }
//   return chunks;
// };

// export const ByJobProductList = ({products}) => {
//     var settings = {
//         dots: true,
//         infinite: false,
//         speed: 500,
//         slidesToScroll: 2,
//         initialSlide: 0,
//         responsive: [
//           {
//             breakpoint: 1024,
//             settings: {
//               slidesToShow: 2,
//               slidesToScroll: 2,
//               infinite: true,
//               dots: true,
//             },
//           },
//           {
//             breakpoint: 600,
//             settings: {
//               slidesToShow: 2,
//               slidesToScroll: 2,
//               initialSlide: 2,
//             },
//           },
//           {
//             breakpoint: 480,
//             settings: {
//               slidesToShow: 1,
//               slidesToScroll: 1,
//             },
//           },
//         ],
//       };

//     const filteredProducts = products || []
//     const productChunks = chunkProducts(filteredProducts, 4);

//   return (
//     <div>
//     {/* //group filter */}
//       <div>
//         {Array.from({ length: 5 }).map((_, i) => (
//           <Button key={i}>Group name </Button>
//         ))}
//       </div>

//     {/* title and filter by product */}
//       <div className="flex justify-between">
//         <div>
//           Because you are into Group name
//           <Button>View all</Button>
//         </div>
//         <div>
//           {Array.from({ length: 5 }).map((_, i) => (
//             <Button key={i}>Band logo </Button>
//           ))}
//         </div>
//       </div>

//     {/* Product carousel */}
//     <div className="overflow-hidden md:p-10 p-5">
//     <Slider {...settings}>
//       {productChunks.map((d,i)=>(
//         <div key={i}>
//         <ProductCard_Large product={d}/>
//         </div>
//         ))}
//      </Slider>
//     </div>
//     </div>
//   );
// };

'use client'

import { Button } from '@nextui-org/react'
import React from 'react'
import Slider from 'react-slick'
import { ProductCard_Large } from './Products'

// Import the slick carousel styles
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

// Custom Previous Arrow Component
const PrevArrow = (props) => {
	const { className, style, onPress } = props
	return (
		<div
			className={`${className} absolute left-0 z-10`} // Added absolute and z-index
			style={{
				...style,
				display: 'block',
				backgroundColor: 'rgba(255, 255, 255, 0.7)', // Optional background for visibility
				borderRadius: '50%', // Optional round shape
				padding: '10px', // Added padding
			}}
			onPress={onPress}
		>
			⬅️
		</div>
	)
}

// Custom Next Arrow Component
const NextArrow = (props) => {
	const { className, style, onPress } = props
	return (
		<div
			className={`${className} absolute right-0 z-10`} // Added absolute and z-index
			style={{
				...style,
				display: 'block',
				backgroundColor: 'rgba(255, 255, 255, 0.7)', // Optional background for visibility
				borderRadius: '50%', // Optional round shape
				padding: '10px', // Added padding
			}}
			onPress={onPress}
		>
			➡️
		</div>
	)
}

// Helper function to chunk the products
const chunkProducts = (products, chunkSize) => {
	const chunks = []
	for (let i = 0; i < products.length; i += chunkSize) {
		chunks.push(products.slice(i, i + chunkSize))
	}
	return chunks
}

export const ByJobProductList = ({ products, brands }) => {
	const settings = {
		dots: false, // Disable dots
		arrows: true, // Enable arrows
		infinite: false,
		speed: 500,
		slidesToShow: 1, // Show 1 chunk (4 products in 2x2 grid) at a time
		slidesToScroll: 1,
		nextArrow: <NextArrow />, // Add custom Next Arrow
		prevArrow: <PrevArrow />, // Add custom Prev Arrow
	}

	const filteredProducts = products || []

	// Group products into chunks of 4 (2 rows × 2 columns)
	const productChunks = chunkProducts(filteredProducts, 4)

	return (
		<div className="p-16 border">
			{/* Group filter */}
			<div className="mb-4 space-x-2">
				{Array.from({ length: 5 }).map((_, i) => (
					<Button color="primary" key={i}>
						Group name
					</Button>
				))}
			</div>

			{/* Title and filter by product */}
			<div className="flex justify-between">
				<div>
					Because you are into Group name
					<Button className=" ml-4" size="sm">
						View all
					</Button>
				</div>
				<div className="mb-4 space-x-2">
					{brands?.map((b, i) => (
						<Button isIconOnly variant="faded" color="primary" className="" size="md" key={i}>
							<img
								src={b.imageURL}
								className="rounded-lg h-[32px] w-auto aspect-square  object-cover"
								alt={b?.title}
							/>
						</Button>
					))}
				</div>
			</div>

			{/* Product carousel */}
			<div className="overflow-hidden md:p-10 p-5 relative">
				{' '}
				{/* Added relative position */}
				<Slider {...settings}>
					{productChunks?.map((chunk, index) => {
						return (
							<div key={index}>
								<div className="grid grid-cols-2 grid-rows-2 gap-4">
									{chunk?.map((product, i) => {
										const brandLogo =
											(brands && brands.find((s) => product.brandId === s.id).imageURL) || ''
										console.log(brandLogo)
										return <ProductCard_Large key={i} product={product} brandLogo={brandLogo} />
									})}
								</div>
							</div>
						)
					})}
				</Slider>
			</div>
		</div>
	)
}

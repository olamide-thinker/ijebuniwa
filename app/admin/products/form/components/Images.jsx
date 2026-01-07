// 'use client'
// import { Input } from "@nextui-org/react";

// export default function Images({
//   data,
//   setFeatureImage,
//   featureImage,
//   imageList,
//   setImageList,
// }) {

//   const [images, setImages] = React.useState(data?.imageList)

// console.log(imageList, data)

//   return (
//     <section className="flex flex-col w-full gap-3 p-4 bg-white border h-fit rounded-xl">
//       <h1 className="font-semibold">Images</h1>
//       <div className="flex flex-col gap-1">
//         {data?.featureImageURL && !featureImage && (
//           <div className="flex justify-center">
//             <img
//               className="object-cover h-64 rounded-lg "
//               src={data?.featureImageURL}
//               alt=""
//             />
//           </div>
//         )}
//         {featureImage && (
//           <div className="flex justify-center">
//             <img
//               className="object-cover h-20 rounded-lg"
//               src={URL.createObjectURL(featureImage)}
//               alt=""
//             />
//           </div>
//         )}
//         <label
//           className="text-xs text-gray-500"
//           htmlFor="product-feature-image"
//         >
//           Feature Image <span className="text-red-500">*</span>{" "}
//         </label>
//         <Input
//           type="file"
//           id="product-feature-image"
//           name="product-feature-image"
//           onChange={(e) => {
//             if (e.target.files.length > 0) {
//               setFeatureImage(e.target.files[0]);
//             }
//           }}
//           className="w-full px-4 py-2 border rounded-lg outline-none"
//         />
//       </div>
//       <div className="flex flex-col gap-1">
//         <div className="flex flex-wrap">
//         { data?.imageList?.length != 0 && (
//           <div className="flex flex-wrap gap-3">
//             {data?.imageList?.map((item, i) => {
//               return (
//                 <img
//                 key={i}
//                   className="object-cover w-20 rounded-lg"
//                   src={item}
//                   alt=""
//                 />
//               );
//             })}
//           </div>
//         )}
//         {imageList?.length > 0 && (
//           <div className="flex flex-wrap gap-3">
//             {imageList?.map((item) => {
//               console.log(item)
//               return (
//                 <img
//                   className="object-cover w-20 rounded-lg"
//                   src={URL.createObjectURL(item)}
//                   alt=""
//                 />
//               );
//             })}
//           </div>
//         )}

//         </div>
//         <label className="text-xs text-gray-500" htmlFor="product-images">
//           Images <span className="text-red-500">*</span>{" "}
//         </label>
//         <Input
//           type="file"
//           id="product-images"
//           name="product-images"
//           multiple
//           onChange={(e) => {
//             const newFiles = [];
//             for (let i = 0; i < e.target.files.length; i++) {
//               newFiles.push(e.target.files[i]);
//             }
//             setImageList(newFiles);
//           }}
//           className="w-full px-4 py-2 border rounded-lg outline-none"
//         />
//       </div>
//     </section>
//   );
// }

'use client'
import React, { useState, useEffect } from 'react'
import { Input } from '@nextui-org/react'

export default function Images({
	data,
	setFeatureImage,
	featureImage,
	imageList = [],
	setImageList,
}) {
	// Local state to handle the combined image URLs
	const [imageURLs, setImageURLs] = useState([])

	// Initialize imageURLs with existing data.imageList
	useEffect(() => {
		if (data?.imageList) {
			setImageURLs(data.imageList)
		}
	}, [data?.imageList])

	// Revoke object URLs when component unmounts or imageList changes
	useEffect(() => {
		return () => {
			imageURLs.forEach((url) => {
				if (url.startsWith('blob:')) {
					URL.revokeObjectURL(url)
				}
			})
		}
	}, [imageURLs])

	// Handle new image selection
	const handleImageChange = (e) => {
		const newFiles = Array.from(e.target.files)
		const newImageURLs = newFiles.map((file) => URL.createObjectURL(file))

		// Update the parent state with new files
		setImageList([...newFiles])

		// Update local state with new image URLs
		setImageURLs((prevURLs) => [...prevURLs, ...newImageURLs])
	}

	return (
		<section className="flex flex-col w-full gap-3 p-4 bg-white border h-fit rounded-xl">
			<h1 className="font-semibold">Images</h1>

			{/* Feature Image Section */}
			<div className="flex flex-col gap-1">
				{data?.featureImageURL && !featureImage && (
					<div className="flex justify-center">
						<img
							className="object-cover h-64 rounded-lg"
							src={data?.featureImageURL}
							alt="Feature Image"
						/>
					</div>
				)}
				{featureImage && (
					<div className="flex justify-center">
						<img
							className="object-cover h-20 rounded-lg"
							src={URL.createObjectURL(featureImage)}
							alt="Feature Image"
						/>
					</div>
				)}
				<label className="text-xs text-gray-500" htmlFor="product-feature-image">
					Feature Image <span className="text-red-500">*</span>
				</label>
				<Input
					type="file"
					id="product-feature-image"
					name="product-feature-image"
					onChange={(e) => {
						if (e.target.files.length > 0) {
							setFeatureImage(e.target.files[0])
						}
					}}
					className="w-full px-4 py-2 border rounded-lg outline-none"
				/>
			</div>

			{/* Image List Section */}
			<div className="flex flex-col gap-1">
				{imageURLs.length > 0 && (
					<div className="flex flex-wrap gap-3">
						{imageURLs.map((src, i) => (
							<img
								key={i}
								className="object-cover w-20 rounded-lg"
								src={src}
								alt={`Image ${i + 1}`}
							/>
						))}
					</div>
				)}

				<label className="text-xs text-gray-500" htmlFor="product-images">
					Images <span className="text-red-500">*</span>
				</label>
				<Input
					type="file"
					id="product-images"
					name="product-images"
					multiple
					onChange={handleImageChange}
					className="w-full px-4 py-2 border rounded-lg outline-none"
				/>
			</div>
		</section>
	)
}

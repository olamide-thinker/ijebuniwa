'use client'

import { useState } from 'react'

export default function Photos({ imageList }) {
	const [selectedImage, setSelectedImage] = useState(imageList[0])
	if (imageList?.length === 0) {
		return <></>
	}

	return (
		<div className="flex flex-col gap-3 w-full">
			<div className="flex justify-center w-full border rounded-xl">
				<img className="object-cover h-[350px] md:h-[430px]" src={selectedImage} />
			</div>
			<div className="flex  justify-center items-center gap-3">
				{imageList?.map((item, i) => {
					return (
						<div
							key={i}
							onPress={() => {
								setSelectedImage(item)
							}}
							className="w-[80px] border rounded p-2"
						>
							<img className="object-cover" src={item} alt="" />
						</div>
					)
				})}
			</div>
		</div>
	)
}

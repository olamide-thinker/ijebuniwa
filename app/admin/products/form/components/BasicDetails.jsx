'use client'

import { useBrands } from '@/lib/firestore/brands/read'
import { useCategories } from '@/lib/firestore/categories/read'
import { Input } from '@nextui-org/react'

export default function BasicDetails({ data, handleData }) {
	const { data: brands } = useBrands()
	const { data: categories } = useCategories()
	return (
		<section className="flex flex-col flex-1 gap-3 p-4 bg-white border rounded-xl">
			<h1 className="font-semibold">Basic Details</h1>

			<div className="flex flex-col gap-1">
				<label className="text-xs text-gray-500" htmlFor="product-title">
					Product Name <span className="text-red-500">*</span>{' '}
				</label>
				<Input
					type="text"
					placeholder="Enter Title"
					id="product-title"
					name="product-title"
					value={data?.title ?? ''}
					onChange={(e) => {
						handleData('title', e.target.value)
					}}
					// className="w-full px-4 py-2 border rounded-lg outline-none"
					required
				/>
			</div>

			<div className="flex flex-col gap-1">
				<label className="text-xs text-gray-500" htmlFor="product-short-decription">
					Short Description <span className="text-red-500">*</span>{' '}
				</label>
				<Input
					type="text"
					placeholder="Enter Short Description"
					id="product-short-decription"
					name="product-short-decription"
					value={data?.shortDescription ?? ''}
					onChange={(e) => {
						handleData('shortDescription', e.target.value)
					}}
					// className="w-full px-4 py-2 border rounded-lg outline-none"
					required
				/>
			</div>

			<div className="flex flex-col gap-1">
				<label className="text-xs text-gray-500" htmlFor="product-brand">
					Brand
					{/* <span className="text-red-500">*</span>{" "} */}
				</label>
				<select
					type="text"
					id="product-brand"
					name="product-brand"
					value={data?.brandId ?? ''}
					onChange={(e) => {
						handleData('brandId', e.target.value)
					}}
					className="w-full px-4 py-2 border rounded-lg outline-none"
					required
				>
					<option value="">Select Brand</option>
					{brands?.map((item) => {
						return (
							<option value={item?.id} key={item?.id}>
								{item?.name}
							</option>
						)
					})}
				</select>
			</div>

			<div className="flex flex-col gap-1">
				<label className="text-xs text-gray-500" htmlFor="product-category">
					Category
					{/* <span className="text-red-500">*</span>{" "} */}
				</label>
				<select
					type="text"
					id="product-category"
					name="product-category"
					value={data?.categoryId ?? ''}
					onChange={(e) => {
						handleData('categoryId', e.target.value)
					}}
					className="w-full px-4 py-2 border rounded-lg outline-none"
					required
				>
					<option value="">Select Category</option>
					{categories?.map((item) => {
						return (
							<option value={item?.id} key={item?.id}>
								{item?.name}
							</option>
						)
					})}
				</select>
			</div>

			{/* <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500" htmlFor="product-stock">
          Stock <span className="text-red-500">*</span>{" "}
        </label>
        <input
          type="number"
          placeholder="Enter Stock"
          id="product-stock"
          name="product-stock"
          value={data?.stock ?? ""}
          onChange={(e) => {
            handleData("stock", e.target.valueAsNumber);
          }}
          className="w-full px-4 py-2 border rounded-lg outline-none"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500" htmlFor="product-price">
          Price <span className="text-red-500">*</span>{" "}
        </label>
        <input
          type="number"
          placeholder="Enter Price"
          id="product-price"
          name="product-price"
          value={data?.price ?? ""}
          onChange={(e) => {
            handleData("price", e.target.valueAsNumber);
          }}
          className="w-full px-4 py-2 border rounded-lg outline-none"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500" htmlFor="product-sale-price">
          Sale Price <span className="text-red-500">*</span>{" "}
        </label>
        <input
          type="number"
          placeholder="Enter Sale Price"
          id="product-sale-price"
          name="product-sale-price"
          value={data?.salePrice ?? ""}
          onChange={(e) => {
            handleData("salePrice", e.target.valueAsNumber);
          }}
          className="w-full px-4 py-2 border rounded-lg outline-none"
          required
        />
      </div> */}

			<div className="flex flex-col gap-1">
				<label className="text-xs text-gray-500" htmlFor="product-is-featured-product">
					Is Featured Product
					{/* <span className="text-red-500">*</span>{" "} */}
				</label>
				<select
					type="number"
					placeholder="Enter Sale Price"
					id="product-is-featured-product"
					name="product-is-featured-product"
					value={data?.isFeatured ? 'yes' : 'no'}
					onChange={(e) => {
						handleData('isFeatured', e.target.value === 'yes' ? true : false)
					}}
					className="w-full px-4 py-2 border rounded-lg outline-none"
					required
				>
					<option value={'no'}>No</option>
					<option value={'yes'}>Yes</option>
				</select>
			</div>
		</section>
	)
}

import { Button, Chip } from '@nextui-org/react'
import { MapPinHouse, Phone } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { MdOutlineWhatsapp } from 'react-icons/md'

export const Hero = () => {
	return (
		<div className="p-4 relative ">
			<div className="h-[90vh] sm:h-[80vh] w-full  rounded-3xl px-4 py-4 bg-cover bg-[url('/heroBG.jpg')]">
				<div className="flex justify-between items-center flex-wrap">
					<Image
						src={'/logo.jpg'}
						alt="logo"
						height={500}
						width={500}
						className="h-[80px] w-auto rounded-md"
					/>

					<div className="flex gap-4 flex-wrap">
						{/* <Chip radius="md" className={"bg-[#2A2A2A] text-white border hover:scale-105 hover:bg-primary hover:text-black ease-linear duration-250 cursor-pointer"} > <p className='flex gap-2 items-center'> <MapPinHouse size={16}/> Address, Lagos, Nigeria | Location on map </p></Chip> */}
						<a href="https://wa.me/2347066305155" target="_blank" rel="noopener noreferrer">
							<Chip
								radius="md"
								className={
									'bg-[#2A2A2A] text-white border hover:scale-105 hover:bg-[#FDC321] hover:text-black ease-linear duration-250 cursor-pointer'
								}
							>
								<p className="flex gap-2 items-center font-bold">
									<MdOutlineWhatsapp size={16} /> 0706 630 5155
								</p>
							</Chip>
						</a>

						<a href="tel:+2348055926916">
							<Chip
								radius="md"
								className={
									'bg-[#2A2A2A] text-white border hover:scale-105 hover:bg-[#FDC321] hover:text-black ease-linear duration-250 cursor-pointer'
								}
							>
								<p className="flex gap-2 items-center font-bold">
									<Phone size={16} /> 0805 592 6916
								</p>
							</Chip>
						</a>
					</div>
				</div>
			</div>

			<div className=" absolute bottom-4 right-4 ">
				<div className="w-full flex justify-end">
					<div className="w-8 h-8 bg-no-repeat bg-cover bg-[url('/Subtract.png')]"></div>
				</div>

				<div className="flex items-end">
					<div className="w-8 h-8 bg-no-repeat bg-cover bg-[url('/Subtract.png')]"></div>
					<div className="max-w-[600px] p-8 space-y-4 bg-white rounded-tl-3xl rounded-br-3xl">
						<h1 className="text-4xl font-thin">
							Laptop warehouse offers best{' '}
							<span className="font-bold">deals for supercharged, heavy duty laptop PC.</span>
						</h1>
						{/* <Button size='lg' className=' bg-[#FDC321] font-bold'>
                Get best equipment for you 3d jobs
        </Button> */}
					</div>
				</div>
			</div>
		</div>
	)
}

// "use client";

// import { Button, Input } from "@nextui-org/react";
// import { CornerDownLeft, Search } from "lucide-react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function SearchBox() {
//   const [query, setQuery] = useState("");
//   const searchParams = useSearchParams();
//   const q = searchParams.get("q");
//   const router = useRouter();

//   useEffect(() => {
//    q && setQuery(q);
//   }, [q]);

//   const handleSubmit = () => {
//     router.push(`/search?q=${query}`);
//     router.refresh();
//   };

//   return (
//     <form
//       onSubmit={(e) => {
//         e.preventDefault();
//         handleSubmit();
//       }}
//       className="flex items-center justify-center w-full gap-3"
//     >
//           <Input
//       variant="faded"
//           endContent={
//             <div className="flex items-center pointer-events-none flex-nowrap">
//               <span className="focus:text-primary text-default-50 text-small whitespace-nowrap"><CornerDownLeft /></span>

//             </div>
//           }
//        value={query}
//        onKeyDown={(e)=>{
//         if(e=='enter') handleSubmit();
//        }}
//        onChange={(e) => {
//           setQuery(e.target.value);
//         }}
//           placeholder="Search for product..."
//           startContent={
//             <Search size={13}  className="flex-shrink-0 text-xl pointer-events-none text-default-400" />
//           }
//         />

//     </form>
//   );
// }

'use client'

import { Suspense, useEffect, useState } from 'react'
import { Button, Input } from '@nextui-org/react'
import { CornerDownLeft, Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

function SearchBoxContent({ inFocus }) {
	const [query, setQuery] = useState('')
	const searchParams = useSearchParams()
	const q = searchParams.get('q')
	const router = useRouter()

	useEffect(() => {
		q && setQuery(q)
	}, [q])

	const handleSubmit = () => {
		router.push(`/search?q=${query}`)
		router.refresh()
	}

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				handleSubmit()
			}}
			className="relative flex items-center justify-center w-full gap-3"
		>
			<Input
				classNames={{
					//  label: "text-black/50 dark:text-white/90",
					input: [
						'bg-transparent',
						//  "text-black/90 dark:text-white/90",
						//  "placeholder:text-default-700/50 dark:placeholder:text-white/60",
					],
					innerWrapper: 'bg-transparent',
					inputWrapper: [
						//  "shadow-xl",
						`${inFocus && 'w-[300px]'}`,
						'bg-transparent',
						'rounded-full',
						'p-4',
						'border-[#fec320]/75',
						'scale-80',

						'hover:scale-85',
						'focus:scale-105',
						'transition-all',
						'ease-out',

						'text-white',
						'duration-2000',
						//  "dark:bg-default/60",
						//  "backdrop-blur-xl",
						//  "backdrop-saturate-200",
						'hover:bg-black',
						//  "dark:hover:bg-default/70",
						'group-data-[focus=true]:bg-transparent',
						'group-data-[focus=true]:scale-105',
						'group-data-[focus=true]:w-[300px]',

						'group-data-[focus=true]:border-[#fec320]',
						//  "dark:group-data-[focus=true]:bg-default/60",
						'!cursor-text',
					],
				}}
				variant={'bordered'}
				// className="bg-[#fec320]/10 rounded-full p-2 ring-1 focus:ring-0 scale-80 focus:scale-105 text-white transition-all ease-out focus:border-0  hover:ring-2 hover:scale-85"
				value={query}
				onKeyDown={(e) => {
					if (e.key === 'Enter') handleSubmit()
				}}
				onChange={(e) => {
					setQuery(e.target.value)
				}}
				placeholder="🔎 Search for product..."
				startContent={
					<Search
						size={13}
						className="flex-shrink-0 text-xl pointer-events-none text-default-400"
					/>
				}
			/>
		</form>
	)
}

export default function SearchBox({ inFocus }) {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<SearchBoxContent inFocus={inFocus} />
		</Suspense>
	)
}

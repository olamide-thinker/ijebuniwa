'use client'
import React, { useState } from 'react'
import ShareButton from './socialShare'
import { Button } from '@nextui-org/react'
import ShareIcon from '@mui/icons-material/Share'

export const SocialShareProductCard = ({ url, title }) => {
	const [show, setShow] = useState(false)
	return (
		<div>
			{show && (
				<div
					onPointerLeave={() => setTimeout(() => setShow(false), 800)}
					className="absolute z-30 w-12 overflow-hidden border-gray-400 rounded-full shadow-md "
				>
					<ShareButton url={url} title={title} />
				</div>
			)}

			<Button
				onPress={() => setShow(!show)}
				variant="light"
				className="rounded-full bg-white/50"
				isIconOnly
				size="md"
			>
				<ShareIcon fontSize="small" />
			</Button>
		</div>
	)
}

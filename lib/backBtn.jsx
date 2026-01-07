'use client'
import { Button } from '@nextui-org/react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const BackBtn = ({ pageName }) => {
	const router = useRouter()
	return (
		<div className="flex gap-2 items-center">
			<Button isIconOnly variant="light" onPress={() => router.back()}>
				{' '}
				<ArrowLeft size={24} />{' '}
			</Button>
			<h1 className="text-xl font-semibold">{pageName}</h1>
		</div>
	)
}

export default BackBtn

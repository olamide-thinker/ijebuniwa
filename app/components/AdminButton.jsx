'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useAdmin } from '@/lib/firestore/admins/read'
import Link from 'next/link'

export default function AdminButton() {
	const { user } = useAuth()
	const { data } = useAdmin({ email: user?.email })
	if (!data) {
		return <></>
	}
	return (
		<Link
			href={'/admin'}
			title="Admin Dashboard"
			className="text-gray-500 hover:text-[#c05621] dark:text-gray-300 transition-transform hover:scale-110"
		>
			<span className="material-symbols-outlined">settings</span>
		</Link>
	)
}

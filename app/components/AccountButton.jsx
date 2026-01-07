'use client'

import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function AccountButton() {
	const { user } = useAuth()

	return (
		<Link
			href={user ? '/account' : '/login'}
			title={user ? "My Account" : "Sign In"}
			className="text-gray-500 hover:text-[#c05621] dark:text-gray-300 transition-transform hover:scale-110"
		>
			<span className="material-symbols-outlined">person</span>
		</Link>
	)
}

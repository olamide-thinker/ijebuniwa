'use client'

import { useAuth } from '@/contexts/AuthContext'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'
import toast from 'react-hot-toast'

export default function LogoutButton() {
	const { user } = useAuth()
	if (!user) {
		return <></>
	}
	return (
		<button
			onClick={async () => {
				if (!confirm('Are you sure?')) return
				try {
					await toast.promise(signOut(auth), {
						error: (e) => e?.message,
						loading: 'Loading...',
						success: 'Successfully Logged out',
					})
				} catch (error) {
					toast.error(error?.message)
				}
			}}
			className="text-gray-500 hover:text-[#c05621] dark:text-gray-300 transition-transform hover:scale-110"
			title="Logout"
		>
			<span className="material-symbols-outlined">logout</span>
		</button>
	)
}

'use client'

import { useEffect, useRef, useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useAdmin } from '@/lib/firestore/admins/read'
import { Button, CircularProgress } from '@nextui-org/react'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function AdminLayout({ children }) {
	const [isOpen, setIsOpen] = useState(false)
	const pathname = usePathname()
	const sidebarRef = useRef(null)
	const { user } = useAuth()
	const { data: admin, error, isLoading } = useAdmin({ email: user?.email })

	const toggleSidebar = () => {
		setIsOpen(!isOpen)
	}

	useEffect(() => {
		toggleSidebar()
	}, [pathname])

	//get the name of the current page from the pathName
	const getPageName = pathname?.split('/')[2]
	console.log('-->',getPageName)
	const currentPage = getPageName?.slice(0, 1)?.toUpperCase() + getPageName?.slice(1)

	useEffect(() => {
		function handleClickOutsideEvent(event) {
			if (sidebarRef.current && !sidebarRef?.current?.contains(event.target)) {
				setIsOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutsideEvent)
		return () => {
			document.removeEventListener('mousedown', handleClickOutsideEvent)
		}
	}, [])

	if (isLoading) {
		return (
			<div className="flex items-center justify-center w-screen h-screen">
				<CircularProgress />
			</div>
		)
	}

	if (error) {
		return (
			<div className="flex items-center justify-center w-screen h-screen">
				<h1 className="text-red-500">{error}</h1>
			</div>
		)
	}

	if (!admin) {
		return (
			<div className="flex flex-col items-center justify-center w-screen h-screen gap-2">
				<h1 className="font-bold">You are not admin!</h1>
				<h1 className="text-sm text-gray-600">{user?.email}</h1>
				<Button
					onPress={async () => {
						await signOut(auth)
					}}
				>
					Logout
				</Button>
			</div>
		)
	}

	return (
		<main className="relative flex">
			<div className="hidden md:block">
				<Sidebar />
			</div>
			<div
				ref={sidebarRef}
				className={`fixed md:hidden ease-in-out transition-all duration-400 z-50 
        ${isOpen ? 'translate-x-0' : '-translate-x-[260px]'}
        `}
			>
				<Sidebar />
			</div>
			<section className="flex flex-col flex-1 min-h-screen overflow-hidden">
				<Header toggleSidebar={toggleSidebar} currentPage={currentPage} />
				<section className="pt-14 flex-1 bg-[#eff3f4]">{children}</section>
			</section>
		</main>
	)
}

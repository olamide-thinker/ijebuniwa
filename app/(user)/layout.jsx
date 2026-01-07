'use client'

import AuthContextProvider, { useAuth } from '@/contexts/AuthContext'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { CircularProgress } from '@nextui-org/react'
import Link from 'next/link'
import { fetcher } from '@/lib/globalFetcherFunc'
import { SWRConfig } from 'swr'

export default function Layout({ children }) {
	return (
		<main>
			<Header />
			<AuthContextProvider>
				<UserChecking>
					{/* <SWRConfig
      value={{
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json()),
      }}> */}
					<SWRConfig value={{ fetcher }}>
						<section className="min-h-screen">{children}</section>
					</SWRConfig>
				</UserChecking>
			</AuthContextProvider>
			<Footer />
		</main>
	)
}

function UserChecking({ children }) {
	const { user, isLoading } = useAuth()
	if (isLoading) {
		return (
			<div className="flex items-center justify-center w-full h-screen">
				<CircularProgress />
			</div>
		)
	}
	// if (!user) {
	// 	return (
	// 		<div className="flex flex-col items-center justify-center w-full h-screen gap-3">
	// 			<h1 className="text-sm text-gray-600">You are not logged In!</h1>
	// 			<Link href={'/login'}>
	// 				<button className="px-4 py-2 text-sm text-white bg-blue-500 rounded-xl">Login</button>
	// 			</Link>
	// 		</div>
	// 	)
	// }
	return <>{children}</>
}

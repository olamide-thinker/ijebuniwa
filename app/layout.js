import localFont from 'next/font/local'
import { SWRConfig } from 'swr'
import './globals.css'
import { NextUIProvider } from '@nextui-org/react'
import { Toaster } from 'react-hot-toast'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900',
})
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
})

export const metadata = {
	title: 'Ijèbú ni wá - Modern Heritage Marketplace',
	description: 'Experience the heart of Ijebu. Discover heritage, taste culture, and bring authentic Ijebu artifacts home. A curated marketplace for the diaspora.',
}

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link
					href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200..800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap"
					rel="stylesheet"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body className="font-sans antialiased text-[#121118] bg-[#fcfbf9] dark:bg-[#131022]">
				<Toaster />
				<NextUIProvider>{children}</NextUIProvider>
			</body>
		</html>
	)
}

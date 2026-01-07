// import { Button } from '@nextui-org/react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { WhatsApp } from '@mui/icons-material'
import Link from 'next/link'
// import { FaWhatsapp } from 'react-icons/fa6'
import { Button } from '../components/ui/button'

export default function Layout({ children }) {
	return (
		<main className="relative max-h-screen overflow-auto">
			<Header />
			<Link
				href="https://wa.me/2347066305155?text=Hi%2C%20I'm%20interested%20in%20your%20laptops.%20Can%20you%20help%20me%20find%20the%20best%20option%3F"
				target="_blank"
				rel="noopener noreferrer"
				className="fixed z-50 right-8 bottom-8"
			>
				<Button className="font-bold ease-in-out bg-green-600 shadow-2xl animate-bounce">
					<WhatsApp className="h-[80px] w-auto" />
					Chat on WhatsApp ...
				</Button>
			</Link>
			{children}
			<Footer />
		</main>
	)
}

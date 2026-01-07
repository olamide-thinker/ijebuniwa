import { Button } from '@nextui-org/react'
import { FaTwitter, FaFacebookF, FaWhatsapp } from 'react-icons/fa'

const ShareButton = ({ url, title, imageUrl }) => {
	// Encoding the dynamic values
	const encodedUrl = encodeURIComponent(url)
	const encodedTitle = encodeURIComponent(title)
	const encodedImage = encodeURIComponent(imageUrl)

	// Dynamic message to be shared
	const message = `🚀 Discover the Power of the *${title}!* Featuring incredible performance and speed, this is your next go-to device. 👉 Check it out now and upgrade your experience! 🔗`
	const encodedMessage = encodeURIComponent(message)

	const openInNewTab = (link) => {
		if (typeof window !== 'undefined') {
			window.open(link, '_blank', 'noopener,noreferrer')
		}
	}

	return (
		<div className="flex flex-col items-center gap-3 pt-8 pb-4 rounded bg-secondary">
			<p className="h-8 p-1 mb-4 rotate-90 w-fit text-muted-foreground whitespace-nowrap">
				Share to
			</p>

			{/* Twitter */}
			<Button
				isIconOnly
				variant="light"
				onPress={() =>
					openInNewTab(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedMessage}`)
				}
				className="rounded-full bg-white/50"
				size="md"
				aria-label="Share on Twitter"
			>
				<FaTwitter style={{ fill: '#1DA1F2', fontSize: '1.5rem' }} />
			</Button>

			{/* Facebook */}
			<Button
				isIconOnly
				variant="light"
				onPress={() => openInNewTab(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`)}
				className="rounded-full bg-white/50"
				size="md"
				aria-label="Share on Facebook"
			>
				<FaFacebookF style={{ fill: '#3b5998', fontSize: '1.5rem' }} />
			</Button>

			{/* WhatsApp */}
			<Button
				isIconOnly
				variant="light"
				onPress={() =>
					openInNewTab(`https://api.whatsapp.com/send?text=${encodedMessage}%20${encodedUrl}`)
				}
				className="rounded-full bg-white/50"
				size="md"
				aria-label="Share on WhatsApp"
			>
				<FaWhatsapp style={{ fill: '#25D366', fontSize: '1.5rem' }} />
			</Button>
		</div>
	)
}

export default ShareButton

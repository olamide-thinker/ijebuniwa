'use client'

import { useAuth } from '@/contexts/AuthContext'
import { auth } from '@/lib/firebase'
import { createUser } from '@/lib/firestore/user/write'
import { Button } from '@nextui-org/react'
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { CgGoogle } from 'react-icons/cg'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { IoClose } from 'react-icons/io5'

// Helper function to convert Firebase errors to friendly messages
const getFriendlyErrorMessage = (error) => {
	const errorCode = error?.code || ''
	switch (errorCode) {
		case 'auth/invalid-credential':
			return "Hmm, we couldn't find an account with those credentials. Are you sure you're registered?"
		case 'auth/user-not-found':
			return "We couldn't find an account with that email. Would you like to create one?"
		case 'auth/wrong-password':
			return "That password doesn't look right. Want to try again?"
		case 'auth/invalid-email':
			return "That email address doesn't look valid. Please check and try again."
		case 'auth/user-disabled':
			return "This account has been disabled. Please contact support for help."
		case 'auth/too-many-requests':
			return "Too many failed attempts. Please try again in a few minutes."
			case 'auth/network-request-failed':
			return "Connection issue. Please check your internet and try again."
		case 'auth/popup-closed-by-user':
			return "Sign-in cancelled. Feel free to try again when you're ready."
		default:
			return "Something went wrong. Please try again or contact support if the issue persists."
	}
}

export default function LoginModal({ isOpen, onClose }) {
	const { user } = useAuth()
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)
	const [data, setData] = useState({ email: '', password: '' })

	useEffect(() => {
		if (user) onClose()
	}, [user])

	if (!isOpen) return null

	const handleLogin = async () => {
		setIsLoading(true)
		try {
			await signInWithEmailAndPassword(auth, data.email, data.password)
			toast.success('Logged in successfully')
		} catch (error) {
			toast.error(getFriendlyErrorMessage(error))
		}
		setIsLoading(false)
	}

	const handleGoogleLogin = async () => {
		setIsLoadingGoogle(true)
		try {
			const credential = await signInWithPopup(auth, new GoogleAuthProvider())
			const user = credential.user
			await createUser({
				uid: user?.uid,
				displayName: user?.displayName,
				photoURL: user?.photoURL,
			})
			toast.success('Logged in with Google')
		} catch (error) {
			toast.error(getFriendlyErrorMessage(error))
		}
		setIsLoading(false)
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
			<div className="bg-[#201e1f] text-white rounded-xl w-full max-w-md p-6 relative shadow-xl">
				<button onClick={onClose} className="absolute text-xl text-white top-3 right-3">
					<IoClose />
				</button>

				<div className="flex mb-4">
					<img src="/logo.png" alt="Logo" className="w-auto h-16" />
				</div>

				<h2 className="mb-4 text-lg text-center font-semi-bold">Please Login to continue.</h2>

				<form
					onSubmit={(e) => {
						e.preventDefault()
						handleLogin()
					}}
					className="flex flex-col gap-3"
				>
					<label className="text-xs text-white/70">Email</label>
					<input
						type="email"
						placeholder="Enter your email"
						value={data.email}
						onChange={(e) => setData({ ...data, email: e.target.value })}
						className="w-full px-3 py-2 text-black bg-white/40 rounded-xl focus:outline-none"
					/>

					<label className="text-xs text-white/70">Password</label>
					<input
						type="password"
						placeholder="Enter your password"
						value={data.password}
						onChange={(e) => setData({ ...data, password: e.target.value })}
						className="w-full px-3 py-2 text-black bg-white/40 rounded-xl focus:outline-none"
					/>

					<Button
						isLoading={isLoading}
						isDisabled={isLoading}
						type="submit"
						className="font-bold text-black bg-primary"
					>
						Login
					</Button>
				</form>

				<div className="flex justify-center gap-8 mt-4 text-sm">
					<Link href="/forget-password" className="font-semibold text-muted/50">
						If you forgot your password, Click here
					</Link>
				</div>

				<div className="flex items-center my-6">
					<hr className="w-full opacity-30" />
					<p className="px-2">or</p>
					<hr className="w-full opacity-30" />
				</div>
				<Button
					className="items-center w-full font-semibold text-black bg-white"
					isLoading={isLoadingGoogle}
					isDisabled={isLoadingGoogle}
					onPress={handleGoogleLogin}
				>
					<CgGoogle scale={1.5} className="mr-2 scale-110 animate-pulse" /> Sign in with Google
				</Button>

				<hr className="my-6 opacity-30" />

				<Button className="w-full text-black bg-white" isLoading={isLoading} isDisabled={isLoading}>
					<Link href="/sign-up" className="font-semibold ">
						Create an account - <span className="text-xs italic ">if you don't have one</span>
					</Link>
				</Button>
			</div>
		</div>
	)
}

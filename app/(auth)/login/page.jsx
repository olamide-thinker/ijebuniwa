'use client'

import { useAuth } from '@/contexts/AuthContext'
import { auth } from '@/lib/firebase'
import { createUser } from '@/lib/firestore/user/write'
import { Button } from '@nextui-org/react'
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { CgGoogle } from 'react-icons/cg'

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

export default function Page() {
	const { user } = useAuth()
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)

	const [data, setData] = useState({})

	const handleData = (key, value) => {
		setData({
			...data,
			[key]: value,
		})
	}

	const handleLogin = async () => {
		setIsLoading(true)
		try {
			await signInWithEmailAndPassword(auth, data?.email, data?.password)
			toast.success('Logged In Successfully')
		} catch (error) {
			toast.error(getFriendlyErrorMessage(error))
		}
		setIsLoading(false)
	}

	useEffect(() => {
		if (user) {
			router.push('/account')
		}
	}, [user])

	return (
		<main className="max-w-screen flex  items-center bg-[#201e1f]  min-h-screen">
			<section className="min-w-[65vw] h-screen relative hidden md:flex">
				<div className="flex justify-center absolute w-full h-full items-center bg-[#201e1f] p-16 bg-opacity-75">
					<img className="h-auto w-[450px] rounded-md" src="/logo.png" alt="Logo" />
				</div>
				<Image
					src={'/BackgroundLogin.jpg'}
					width={1000}
					height={1000}
					className="object-cover h-screen"
				/>
			</section>

			<section className="flex flex-col items-center justify-center w-full h-screen gap-3 text-center gaps-16">
				<div className="flex justify-center mb-16 sm:hidden  w-full items-center bg-[#201e1f] p-16 bg-opacity-75">
					<img className="h-auto w-[450px] rounded-md" src="/logo.png" alt="Logo" />
				</div>
				<div className="flex justify-center ">
					<h1 className="font-bold text-white text-md">Login</h1>
				</div>
				<div className="flex flex-col w-full gap-3 p-5 md:p-10 rounded-xl">
					<form
						onSubmit={(e) => {
							e.preventDefault()
							handleLogin()
						}}
						className="flex flex-col gap-3"
					>
						<div className="w-full font-normal text-left">
							<label className="text-white opacity-75">Email</label>
							<input
								placeholder="Enter Your Email"
								type="email"
								name="user-email"
								id="user-email"
								variant="bordered"
								value={data?.email}
								onChange={(e) => {
									handleData('email', e.target.value)
								}}
								className="w-full px-3 py-2 rounded-xl focus:outline-none "
							/>
						</div>
						<div className="w-full font-normal text-left">
							<label className="text-white opacity-75">Password</label>
							<input
								placeholder="Enter Your Password"
								type="password"
								name="user-password"
								id="user-password"
								variant="outlined"
								value={data?.password}
								onChange={(e) => {
									handleData('password', e.target.value)
								}}
								className="w-full px-3 py-2 rounded-xl focus:outline-none "
							/>
						</div>
						<Button
							isLoading={isLoading}
							isDisabled={isLoading}
							className="font-bold bg-primary text-"
							type="submit"
						>
							Login
						</Button>
					</form>
					<div className="flex justify-between text-white/85">
						<Link href={`/sign-up`}>
							<button className="text-sm font-semibold ">New? Create Account</button>
						</Link>
						<Link href={`/forget-password`}>
							<button className="text-sm font-semibold ">Forget Password?</button>
						</Link>
					</div>
					<hr className="py-8 opacity-25" />
					<SignInWithGoogleComponent />
				</div>
			</section>
		</main>
	)
}

function SignInWithGoogleComponent() {
	const [isLoading, setIsLoading] = useState(false)
	const handleLogin = async () => {
		setIsLoading(true)
		try {
			const credential = await signInWithPopup(auth, new GoogleAuthProvider())
			const user = credential.user
			await createUser({
				uid: user?.uid,
				displayName: user?.displayName,
				photoURL: user?.photoURL,
			})
		} catch (error) {
			toast.error(getFriendlyErrorMessage(error))
		}
		setIsLoading(false)
	}
	return (
		<Button className="bg-white" isLoading={isLoading} isDisabled={isLoading} onPress={handleLogin}>
			<CgGoogle /> Sign In With Google
		</Button>
	)
}

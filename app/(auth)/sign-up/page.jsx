'use client'

import { useAuth } from '@/contexts/AuthContext'
import { auth } from '@/lib/firebase'
import { createUser } from '@/lib/firestore/user/write'
import { Button } from '@nextui-org/react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

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

	const handleSignUp = async () => {
		setIsLoading(true)
		try {
			const credential = await createUserWithEmailAndPassword(auth, data?.email, data?.password)
			await updateProfile(credential.user, {
				displayName: data?.name,
			})
			const user = credential.user
			await createUser({
				uid: user?.uid,
				displayName: data?.name,
				photoURL: user?.photoURL,
			})
			toast.success('Successfully Signed Up')
			router.push('/account')
		} catch (error) {
			toast.error(error?.message || 'Error during sign-up.')
		} finally {
			setIsLoading(false)
		}
	}

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

			{/* <section className="min-w-[65vw] h-screen relative"> */}

			<section className="flex flex-col items-center justify-center w-full h-screen gap-3 text-center gaps-16">

      <div className="flex justify-center mb-16 sm:hidden  w-full items-center bg-[#201e1f] p-16 bg-opacity-75">
					<img className="h-auto w-[450px] rounded-md" src="/logo.png" alt="Logo" />
				</div>

				<div className="flex justify-center ">
					<h1 className="font-bold text-white text-md">Sign up</h1>
				</div>

				<div className="flex flex-col w-full gap-3 p-5 md:p-10 rounded-xl">
					{/* <h1 className="text-xl font-bold">Sign Up With Email</h1> */}

					<form
						onSubmit={(e) => {
							e.preventDefault()
							handleSignUp()
						}}
						className="flex flex-col gap-3"
					>
						<div className="w-full font-normal text-left">
							<label className="text-white opacity-75">User name</label>
							<input
								placeholder="Enter Your Name"
								type="text"
								name="user-name"
								id="user-name"
								value={data?.name}
								onChange={(e) => handleData('name', e.target.value)}
								className="w-full px-3 py-2 rounded-xl focus:outline-none "
							/>
						</div>

						<div className="w-full font-normal text-left">
							<label className="text-white opacity-75">Email</label>
							<input
								placeholder="Enter Your Email"
								type="email"
								name="user-email"
								id="user-email"
								value={data?.email}
								onChange={(e) => handleData('email', e.target.value)}
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
								value={data?.password}
								onChange={(e) => handleData('password', e.target.value)}
								className="w-full px-3 py-2 rounded-xl focus:outline-none "
							/>
						</div>
						<Button
							className="font-bold bg-primary text-"
							isLoading={isLoading}
							isDisabled={isLoading}
							type="submit"
							color="primary"
						>
							Sign Up
						</Button>
					</form>
					<div className="flex justify-between">
						<Link href={`/login`}>
							<button className="text-sm font-semibold text-gray-300">
								Already a user? Sign In
							</button>
						</Link>
					</div>
				</div>
			</section>
		</main>
	)
}

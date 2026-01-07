import Link from 'next/link'
import ListView from './components/ListView'
import BackBtn from '@/lib/backBtn'

export default function Page() {
	return (
		<main className="flex flex-col gap-4 p-5">
			<div className="flex justify-between items-center">
				<BackBtn pageName={'Customers'} />
				{/* <h1 className="text-xl">Customers</h1> */}
			</div>
			<ListView />
		</main>
	)
}

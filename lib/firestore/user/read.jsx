'use client'
import { fetcher } from '@/lib/globalFetcherFunc'
import { realTimeFetcher } from '@/lib/realTimeFetcher'
import useSWR from 'swr'

// useUser hook
export function useUser({ uid } = {}) {
	const { data, error, isLoading } = realTimeFetcher({ path: 'users', id: uid })
	const email = data?.email || null

	console.log('Fetching user data with UID: ', uid)
	console.log('User data response: ', data, error)

	return { data, email, error, isLoading }
}

// useUsers hook
export function useUsers() {
	const { data, error, isLoading } = useSWR(['users'], ([path]) => fetcher(path))

	return {
		data,
		error: error?.message || null,
		isLoading: !data && !error,
	}
}

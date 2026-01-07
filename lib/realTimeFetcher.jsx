import { useState, useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export function realTimeFetcher({ path, id }) {
	const [data, setData] = useState(null)
	const [error, setError] = useState(null)

	useEffect(() => {
		if (!id) {
			setError('ID is required')
			return
		}

		console.log(`Fetching document at path: ${path}/${id}`)
		const ref = doc(db, `${path}/${id}`)
		const unsubscribe = onSnapshot(
			ref,
			(snapshot) => {
				if (snapshot.exists()) {
					setData(snapshot.data())
					console.log('Document snapshot data: ', snapshot.data())
				} else {
					setData(null) // Document does not exist
					console.log('Document does not exist.')
				}
			},
			(err) => {
				if (err.code === 'resource-exhausted') {
					setData({ fallback: true }) // Use a fallback value on quota errors
				} else {
					setError(err)
				}
			},
		)

		return () => unsubscribe()
	}, [path, id])

	console.log(`Fetching ----->: ${data}`)

	return { data, error, isLoading: data === null && !error }
}

'use client'

import { fetcher } from '@/lib/globalFetcherFunc'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore'
import useSWR from 'swr'

// Fetch all event posts
export function useEventPosts() {
    // We order by createdAt desc for the general list
    const { data, error, mutate } = useSWR('events', () =>
        fetcher('events', 1000, null, 'createdAt', 'desc', {})
    )

    return {
        data,
        error: error?.message,
        isLoading: !data && !error,
        mutate,
    }
}

// Specialized hook for upcoming events
export function useUpcomingEvents() {
    const { data, error, mutate } = useSWR('upcoming-events', async () => {
        const ref = collection(db, 'events')
        const now = new Date()
        const q = query(
            ref,
            where('eventDate', '>=', now),
            where('status', '==', 'published'),
            orderBy('eventDate', 'asc')
        )
        const snapshot = await getDocs(q)
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    })

    return {
        data,
        error: error?.message,
        isLoading: !data && !error,
        mutate,
    }
}

// Fetch single event post by ID
export function useEventPost(id) {
    const { data, error, mutate } = useSWR(id ? `events/${id}` : null, async (path) => {
        const result = await fetcher(path)
        return result ? { data: result } : null
    })

    return {
        data,
        error: error?.message,
        isLoading: !data && !error,
        mutate,
    }
}

// Fetch single event post by slug
export function useEventPostBySlug(slug) {
    const { data, error, mutate } = useSWR(slug ? `events-slug/${slug}` : null, async () => {
        const ref = collection(db, 'events')
        const q = query(ref, where('slug', '==', slug), limit(1))
        const snapshot = await getDocs(q)

        if (snapshot.empty) {
            return null
        }

        return {
            data: {
                id: snapshot.docs[0].id,
                ...snapshot.docs[0].data()
            }
        }
    })

    return {
        data,
        error: error?.message,
        isLoading: !data && !error,
        mutate,
    }
}

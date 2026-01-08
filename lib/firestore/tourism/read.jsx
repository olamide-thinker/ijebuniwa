'use client'

import { fetcher } from '@/lib/globalFetcherFunc'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, limit } from 'firebase/firestore'
import useSWR from 'swr'

// Fetch all tourism posts
export function useTourismPosts() {
    const { data, error, mutate } = useSWR('tourism', () =>
        fetcher('tourism', 1000, null, 'createdAt', 'desc', {})
    )

    return {
        data,
        error: error?.message,
        isLoading: !data && !error,
        mutate,
    }
}

// Fetch single tourism post by ID
export function useTourismPost(id) {
    const { data, error, mutate } = useSWR(id ? `tourism/${id}` : null, async (path) => {
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

// Fetch single tourism post by slug
export function useTourismPostBySlug(slug) {
    const { data, error, mutate } = useSWR(slug ? `tourism-slug/${slug}` : null, async () => {
        const ref = collection(db, 'tourism')
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

// Use same categories/tags as blog for now or specialized ones?
// The user didn't specify, so I'll reuse the blog ones if needed,
// but for tourism we might want separate ones later.
// For now, let's just stick to the posts.

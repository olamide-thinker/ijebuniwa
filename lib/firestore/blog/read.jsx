'use client'

import { fetcher } from '@/lib/globalFetcherFunc'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, limit } from 'firebase/firestore'
import useSWR from 'swr'

// Fetch all blog posts
export function useBlogPosts() {
    const { data, error, mutate } = useSWR('blogs', () =>
        fetcher('blogs', 1000, null, 'createdAt', 'desc', {})
    )

    return {
        data,
        error: error?.message,
        isLoading: !data && !error,
        mutate,
    }
}

// Fetch single blog post by ID
export function useBlogPost(id) {
    const { data, error, mutate } = useSWR(id ? `blogs/${id}` : null, async (path) => {
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

// Fetch single blog post by slug
export function useBlogPostBySlug(slug) {
    const { data, error, mutate } = useSWR(slug ? `blogs-slug/${slug}` : null, async () => {
        const blogsRef = collection(db, 'blogs')
        const q = query(blogsRef, where('slug', '==', slug), limit(1))
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

// Fetch all blog categories
export function useBlogCategories() {
    const { data, error, mutate } = useSWR('blog_categories', fetcher)

    return {
        data,
        error: error?.message,
        isLoading: !data && !error,
        mutate,
    }
}

// Fetch all blog tags
export function useBlogTags() {
    const { data, error, mutate } = useSWR('blog_tags', fetcher)

    return {
        data,
        error: error?.message,
        isLoading: !data && !error,
        mutate,
    }
}

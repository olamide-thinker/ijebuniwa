'use client'

import { fetcher } from '@/lib/globalFetcherFunc'
import useSWR from 'swr'

// Fetch all blog posts
export function useBlogPosts() {
    const { data, error, mutate } = useSWR('blogs', fetcher)

    return {
        data,
        error: error?.message,
        isLoading: !data && !error,
        mutate,
    }
}

// Fetch single blog post by ID
export function useBlogPost(id) {
    const { data, error, mutate } = useSWR(id ? `blogs/${id}` : null, fetcher)

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

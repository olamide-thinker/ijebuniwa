'use client'

import { db } from '@/lib/firebase'
import {
    collection,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    Timestamp,
    getDoc,
} from 'firebase/firestore'

// Create a new blog post
export async function createBlogPost(data) {
    try {
        const newId = doc(collection(db, 'blogs')).id
        const slug = generateSlug(data.title)

        await setDoc(doc(db, `blogs/${newId}`), {
            ...data,
            id: newId,
            slug,
            status: data.status || 'draft',
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            lastSavedAt: Timestamp.now(),
        })

        return { success: true, id: newId }
    } catch (error) {
        console.error('Error creating blog post:', error)
        return { success: false, error: error.message }
    }
}

// Update an existing blog post
export async function updateBlogPost(id, data) {
    try {
        const updateData = {
            ...data,
            updatedAt: Timestamp.now(),
            lastSavedAt: Timestamp.now(),
        }

        // Update slug if title changed
        if (data.title) {
            updateData.slug = generateSlug(data.title)
        }

        await updateDoc(doc(db, `blogs/${id}`), updateData)

        return { success: true }
    } catch (error) {
        console.error('Error updating blog post:', error)
        return { success: false, error: error.message }
    }
}

// Delete a blog post
export async function deleteBlogPost(id) {
    try {
        await deleteDoc(doc(db, `blogs/${id}`))
        return { success: true }
    } catch (error) {
        console.error('Error deleting blog post:', error)
        return { success: false, error: error.message }
    }
}

// Auto-save function (debounced on client side)
export async function autoSaveBlogPost(id, data) {
    try {
        await updateDoc(doc(db, `blogs/${id}`), {
            ...data,
            lastSavedAt: Timestamp.now(),
        })

        return { success: true }
    } catch (error) {
        console.error('Error auto-saving blog post:', error)
        return { success: false, error: error.message }
    }
}

// Publish a blog post
export async function publishBlogPost(id) {
    try {
        await updateDoc(doc(db, `blogs/${id}`), {
            status: 'published',
            publishDate: Timestamp.now(),
            updatedAt: Timestamp.now(),
        })

        return { success: true }
    } catch (error) {
        console.error('Error publishing blog post:', error)
        return { success: false, error: error.message }
    }
}

// Helper function to generate URL-friendly slug
function generateSlug(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

// Category management
export async function createCategory(name) {
    try {
        const newId = generateSlug(name)

        await setDoc(doc(db, `blog_categories/${newId}`), {
            id: newId,
            name,
            slug: newId,
            count: 0,
        })

        return { success: true, id: newId }
    } catch (error) {
        console.error('Error creating category:', error)
        return { success: false, error: error.message }
    }
}

// Tag management
export async function createTag(name) {
    try {
        const newId = generateSlug(name)

        await setDoc(doc(db, `blog_tags/${newId}`), {
            id: newId,
            name,
            slug: newId,
            count: 0,
        })

        return { success: true, id: newId }
    } catch (error) {
        console.error('Error creating tag:', error)
        return { success: false, error: error.message }
    }
}

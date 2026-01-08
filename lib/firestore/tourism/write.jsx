'use client'

import { db } from '@/lib/firebase'
import {
    collection,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    Timestamp,
} from 'firebase/firestore'

// Create a new tourism post
export async function createTourismPost(data) {
    try {
        const newId = doc(collection(db, 'tourism')).id
        const slug = generateSlug(data.title)

        await setDoc(doc(db, `tourism/${newId}`), {
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
        console.error('Error creating tourism post:', error)
        return { success: false, error: error.message }
    }
}

// Update an existing tourism post
export async function updateTourismPost(id, data) {
    try {
        const updateData = {
            ...data,
            updatedAt: Timestamp.now(),
            lastSavedAt: Timestamp.now(),
        }

        if (data.title) {
            updateData.slug = generateSlug(data.title)
        }

        await updateDoc(doc(db, `tourism/${id}`), updateData)

        return { success: true }
    } catch (error) {
        console.error('Error updating tourism post:', error)
        return { success: false, error: error.message }
    }
}

// Delete a tourism post
export async function deleteTourismPost(id) {
    try {
        await deleteDoc(doc(db, `tourism/${id}`))
        return { success: true }
    } catch (error) {
        console.error('Error deleting tourism post:', error)
        return { success: false, error: error.message }
    }
}

// Auto-save function
export async function autoSaveTourismPost(id, data) {
    try {
        await updateDoc(doc(db, `tourism/${id}`), {
            ...data,
            lastSavedAt: Timestamp.now(),
        })

        return { success: true }
    } catch (error) {
        console.error('Error auto-saving tourism post:', error)
        return { success: false, error: error.message }
    }
}

// Publish a tourism post
export async function publishTourismPost(id) {
    try {
        await updateDoc(doc(db, `tourism/${id}`), {
            status: 'published',
            publishDate: Timestamp.now(),
            updatedAt: Timestamp.now(),
        })

        return { success: true }
    } catch (error) {
        console.error('Error publishing tourism post:', error)
        return { success: false, error: error.message }
    }
}

function generateSlug(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

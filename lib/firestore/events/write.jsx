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

// Create a new event post
export async function createEventPost(data) {
    try {
        const newId = doc(collection(db, 'events')).id
        const slug = generateSlug(data.title)

        await setDoc(doc(db, `events/${newId}`), {
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
        console.error('Error creating event post:', error)
        return { success: false, error: error.message }
    }
}

// Update an existing event post
export async function updateEventPost(id, data) {
    try {
        const updateData = {
            ...data,
            updatedAt: Timestamp.now(),
            lastSavedAt: Timestamp.now(),
        }

        if (data.title) {
            updateData.slug = generateSlug(data.title)
        }

        await updateDoc(doc(db, `events/${id}`), updateData)

        return { success: true }
    } catch (error) {
        console.error('Error updating event post:', error)
        return { success: false, error: error.message }
    }
}

// Delete an event post
export async function deleteEventPost(id) {
    try {
        await deleteDoc(doc(db, `events/${id}`))
        return { success: true }
    } catch (error) {
        console.error('Error deleting event post:', error)
        return { success: false, error: error.message }
    }
}

// Auto-save function
export async function autoSaveEventPost(id, data) {
    try {
        await updateDoc(doc(db, `events/${id}`), {
            ...data,
            lastSavedAt: Timestamp.now(),
        })

        return { success: true }
    } catch (error) {
        console.error('Error auto-saving event post:', error)
        return { success: false, error: error.message }
    }
}

// Publish an event post
export async function publishEventPost(id) {
    try {
        await updateDoc(doc(db, `events/${id}`), {
            status: 'published',
            publishDate: Timestamp.now(),
            updatedAt: Timestamp.now(),
        })

        return { success: true }
    } catch (error) {
        console.error('Error publishing event post:', error)
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

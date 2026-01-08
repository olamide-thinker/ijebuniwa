'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import BlogToolbar from '../../blog/components/BlogToolbar'
import EventSettings from '../components/EventSettings'
import { createEventPost, updateEventPost, publishEventPost, autoSaveEventPost } from '@/lib/firestore/events/write'
import toast from 'react-hot-toast'
import debounce from 'lodash.debounce'
import BackBtn from '@/lib/backBtn'
import { Button } from '@nextui-org/react'
import { useAuth } from '@/contexts/AuthContext'
import { Timestamp } from 'firebase/firestore'

export default function CreateEventPage() {
    const { user } = useAuth()
    const router = useRouter()

    // States
    const [title, setTitle] = useState('')
    const [content, setContent] = useState({})
    const [author, setAuthor] = useState('')
    const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0])
    const [isFeatured, setIsFeatured] = useState(false)
    const [categories, setCategories] = useState([])
    const [tags, setTags] = useState([])
    const [eventDate, setEventDate] = useState('') // datetime-local format

    const [wordCount, setWordCount] = useState(0)
    const [lastSaved, setLastSaved] = useState(null)
    const [currentId, setCurrentId] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    // Set default author
    useEffect(() => {
        if (user?.displayName && !author) {
            setAuthor(user.displayName)
        }
    }, [user])

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: { levels: [1, 2] } }),
            Underline,
            Image,
            Link.configure({ openOnClick: false }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        immediatelyRender: false,
        content: '',
        onUpdate: ({ editor }) => {
            const json = editor.getJSON()
            const text = editor.getText()
            setContent(json)
            setWordCount(text.split(/\s+/).filter((word) => word.length > 0).length)

            debouncedAutoSave({
                title,
                content: json,
                author,
                publishDate: new Date(publishDate),
                isFeatured,
                categories,
                tags,
                eventDate: eventDate ? new Date(eventDate) : null,
                status: 'draft',
            })
        },
    })

    const debouncedAutoSave = useCallback(
        debounce(async (data) => {
            if (currentId) {
                const result = await autoSaveEventPost(currentId, data)
                if (result.success) {
                    const now = new Date()
                    setLastSaved(`${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`)
                }
            } else if (data.title && data.title.trim().length > 0) {
                const result = await createEventPost(data)
                if (result.success) {
                    setCurrentId(result.id)
                    const now = new Date()
                    setLastSaved(`${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`)
                }
            }
        }, 2000),
        [currentId, title, author, publishDate, isFeatured, categories, tags, eventDate],
    )

    const handleSaveDraft = async () => {
        if (!title.trim()) {
            toast.error('Please enter an event title')
            return
        }
        setIsLoading(true)
        try {
            const data = {
                title,
                content,
                author,
                publishDate: new Date(publishDate),
                isFeatured,
                categories,
                tags,
                eventDate: eventDate ? new Date(eventDate) : null,
                status: 'draft',
            }
            let result
            if (currentId) {
                result = await updateEventPost(currentId, data)
            } else {
                result = await createEventPost(data)
                if (result.success) setCurrentId(result.id)
            }
            if (result.success) toast.success('Draft saved successfully')
            else toast.error(result.error || 'Failed to save draft')
        } catch (error) {
            toast.error('An error occurred while saving')
        } finally {
            setIsLoading(false)
        }
    }

    const handlePublish = async () => {
        if (!title.trim()) {
            toast.error('Please enter an event title')
            return
        }
        setIsLoading(true)
        try {
            let id = currentId
            if (!id) {
                const data = {
                    title,
                    content,
                    author,
                    publishDate: new Date(publishDate),
                    isFeatured,
                    categories,
                    tags,
                    eventDate: eventDate ? new Date(eventDate) : null,
                    status: 'draft',
                }
                const result = await createEventPost(data)
                if (!result.success) {
                    toast.error(result.error || 'Failed to create event')
                    return
                }
                id = result.id
                setCurrentId(id)
            } else {
                // Save current changes before publishing
                const updateData = {
                    title,
                    content,
                    author,
                    publishDate: new Date(publishDate),
                    isFeatured,
                    categories,
                    tags,
                    eventDate: eventDate ? new Date(eventDate) : null,
                }
                await updateEventPost(id, updateData)
            }
            const publishResult = await publishEventPost(id)
            if (publishResult.success) {
                toast.success('Event published successfully!')
                router.push('/admin/events')
            } else {
                toast.error(publishResult.error || 'Failed to publish')
            }
        } catch (error) {
            toast.error('An error occurred while publishing')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="flex flex-col gap-4 p-5">
            <div className="flex items-center justify-between w-full">
                <BackBtn pageName="Create New Event" />
                <div className="flex gap-2">
                    <Button variant="flat" onClick={handleSaveDraft} isLoading={isLoading}>Save Draft</Button>
                    <Button className="bg-[#313131] text-white" onClick={handlePublish} isLoading={isLoading}>Publish</Button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-5 relative h-[80vh] overflow-auto">
                <div className="flex-[2] flex flex-col gap-5 h-fit">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex flex-col min-h-[600px]">
                        <h2 className="font-semibold mb-3 text-sm">Event Details & Program</h2>
                        <div className="flex flex-col gap-1 mb-6">
                            <label className="text-xs text-gray-500 font-medium" htmlFor="event-title">Event Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                id="event-title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-2xl font-bold placeholder-gray-300 dark:placeholder-gray-600 text-gray-900 dark:text-white focus:border-gray-400 outline-none transition-all"
                                placeholder="Enter event name (e.g. Ojude Oba Festival)..."
                            />
                        </div>
                        <div className="mb-2"><BlogToolbar editor={editor} /></div>
                        <div className="flex-grow p-4 border border-gray-100 dark:border-gray-800 rounded-lg bg-gray-50/30">
                            <EditorContent editor={editor} className="h-full w-full" />
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 flex justify-between font-medium">
                            <span>{lastSaved ? `Last saved at ${lastSaved}` : 'Not saved yet'}</span>
                            <span>{wordCount} words</span>
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex flex-col gap-5">
                    <EventSettings
                        author={author} setAuthor={setAuthor}
                        publishDate={publishDate} setPublishDate={setPublishDate}
                        isFeatured={isFeatured} setIsFeatured={setIsFeatured}
                        categories={categories} setCategories={setCategories}
                        tags={tags} setTags={setTags}
                        eventDate={eventDate} setEventDate={setEventDate}
                    />
                </div>
            </div>
        </main>
    )
}

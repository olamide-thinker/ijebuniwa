'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import BlogToolbar from '../../../blog/components/BlogToolbar'
import EventSettings from '../../components/EventSettings'
import { useEventPost } from '@/lib/firestore/events/read'
import { updateEventPost, publishEventPost, autoSaveEventPost } from '@/lib/firestore/events/write'
import toast from 'react-hot-toast'
import debounce from 'lodash.debounce'
import BackBtn from '@/lib/backBtn'
import { Button, CircularProgress } from '@nextui-org/react'

export default function EditEventPage() {
    const params = useParams()
    const eventId = params.eventId
    const router = useRouter()

    const { data: eventData, isLoading: entryLoading, error: entryError } = useEventPost(eventId)

    // States
    const [title, setTitle] = useState('')
    const [content, setContent] = useState({})
    const [author, setAuthor] = useState('')
    const [publishDate, setPublishDate] = useState('')
    const [isFeatured, setIsFeatured] = useState(false)
    const [categories, setCategories] = useState([])
    const [tags, setTags] = useState([])
    const [eventDate, setEventDate] = useState('')

    const [wordCount, setWordCount] = useState(0)
    const [lastSaved, setLastSaved] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isDataLoaded, setIsDataLoaded] = useState(false)

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

            if (isDataLoaded) {
                debouncedAutoSave({
                    title,
                    content: json,
                    author,
                    publishDate: new Date(publishDate),
                    isFeatured,
                    categories,
                    tags,
                    eventDate: eventDate ? new Date(eventDate) : null,
                })
            }
        },
    })

    useEffect(() => {
        if (eventData?.data && editor && !isDataLoaded) {
            const data = eventData.data
            setTitle(data.title || '')
            setAuthor(data.author || '')
            setIsFeatured(data.isFeatured || false)
            setCategories(data.categories || [])
            setTags(data.tags || [])

            // Handle publishDate conversion
            if (data.publishDate) {
                const date = data.publishDate.seconds
                    ? new Date(data.publishDate.seconds * 1000)
                    : new Date(data.publishDate)
                setPublishDate(date.toISOString().split('T')[0])
            }

            // Handle eventDate conversion (datetime-local format: YYYY-MM-DDTHH:mm)
            if (data.eventDate) {
                const date = data.eventDate.seconds
                    ? new Date(data.eventDate.seconds * 1000)
                    : new Date(data.eventDate)

                const year = date.getFullYear()
                const month = String(date.getMonth() + 1).padStart(2, '0')
                const day = String(date.getDate()).padStart(2, '0')
                const hours = String(date.getHours()).padStart(2, '0')
                const minutes = String(date.getMinutes()).padStart(2, '0')
                setEventDate(`${year}-${month}-${day}T${hours}:${minutes}`)
            }

            editor.commands.setContent(data.content || '')
            setIsDataLoaded(true)
        }
    }, [eventData, editor, isDataLoaded])

    const debouncedAutoSave = useCallback(
        debounce(async (data) => {
            const result = await autoSaveEventPost(eventId, data)
            if (result.success) {
                const now = new Date()
                setLastSaved(`${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`)
            }
        }, 2000),
        [eventId]
    )

    const handleUpdate = async () => {
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
            }
            const result = await updateEventPost(eventId, data)
            if (result.success) toast.success('Event updated successfully')
            else toast.error(result.error || 'Failed to update event')
        } catch (error) {
            toast.error('An error occurred while saving')
        } finally {
            setIsLoading(false)
        }
    }

    const handlePublish = async () => {
        setIsLoading(true)
        try {
            // Save current changes first
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
            await updateEventPost(eventId, updateData)

            const publishResult = await publishEventPost(eventId)
            if (publishResult.success) {
                toast.success('Event published successfully!')
                router.push('/admin/events')
            } else {
                toast.error(publishResult.error || 'Failed to publish event')
            }
        } catch (error) {
            toast.error('An error occurred while publishing')
        } finally {
            setIsLoading(false)
        }
    }

    if (entryLoading) return (
        <div className="flex items-center justify-center min-h-screen">
            <CircularProgress aria-label="Loading..." />
        </div>
    )

    if (entryError) return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <p className="text-red-500 font-medium">Error loading event: {entryError}</p>
            <Button onClick={() => router.push('/admin/events')}>Back to List</Button>
        </div>
    )

    return (
        <main className="flex flex-col gap-4 p-5">
            <div className="flex items-center justify-between w-full">
                <BackBtn pageName="Edit Event" />
                <div className="flex gap-2">
                    <Button variant="flat" onClick={handleUpdate} isLoading={isLoading}>Save Changes</Button>
                    <Button className="bg-[#313131] text-white" onClick={handlePublish} isLoading={isLoading}>Publish</Button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-5 relative h-[80vh] overflow-auto">
                <div className="flex-[2] flex flex-col gap-5 h-fit">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex flex-col min-h-[600px]">
                        <h2 className="font-semibold mb-3 text-sm">Event Details & Program</h2>
                        <div className="flex flex-col gap-1 mb-6">
                            <label className="text-xs text-gray-500 font-medium" htmlFor="event-title">Event Title</label>
                            <input
                                type="text"
                                id="event-title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-2xl font-bold text-gray-900 dark:text-white focus:border-gray-400 outline-none transition-all"
                            />
                        </div>
                        <div className="mb-2"><BlogToolbar editor={editor} /></div>
                        <div className="flex-grow p-4 border border-gray-100 dark:border-gray-800 rounded-lg bg-gray-50/30">
                            <EditorContent editor={editor} className="h-full w-full" />
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 flex justify-between font-medium">
                            <span>{lastSaved ? `Auto-saved at ${lastSaved}` : 'All changes saved'}</span>
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

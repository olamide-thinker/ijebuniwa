'use client'

import { useEventPosts } from '@/lib/firestore/events/read'
import { useBlogCategories } from '@/lib/firestore/blog/read'
import { deleteEventPost } from '@/lib/firestore/events/write'
import { useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'
import toast from 'react-hot-toast'
import BackBtn from '@/lib/backBtn'
import { Button, Chip } from '@nextui-org/react'
import { Edit2, Trash2, CalendarDays, Archive } from 'lucide-react'

export default function EventsListPage() {
    const { data: posts, isLoading: postsLoading, error, mutate } = useEventPosts()
    const { data: categoriesData, isLoading: categoriesLoading } = useBlogCategories()
    const router = useRouter()
    const [deleteConfirm, setDeleteConfirm] = useState(null)

    const isLoading = postsLoading || categoriesLoading

    const categoryMap = useMemo(() => {
        const map = {}
        if (categoriesData?.data) {
            categoriesData.data.forEach(cat => {
                map[cat.id] = cat.name
            })
        }
        return map
    }, [categoriesData])

    const { upcomingEvents, pastEvents } = useMemo(() => {
        const now = new Date()
        const upcoming = []
        const past = []

        if (posts?.data) {
            posts.data.forEach(event => {
                const eventDate = event.eventDate?.seconds
                    ? new Date(event.eventDate.seconds * 1000)
                    : event.eventDate ? new Date(event.eventDate) : null

                if (!eventDate || eventDate >= now) {
                    upcoming.push(event)
                } else {
                    past.push(event)
                }
            })

            // Sort upcoming by date ascending (soonest first)
            upcoming.sort((a, b) => {
                const da = a.eventDate?.seconds ? a.eventDate.seconds * 1000 : (a.eventDate ? new Date(a.eventDate).getTime() : 0)
                const db = b.eventDate?.seconds ? b.eventDate.seconds * 1000 : (b.eventDate ? new Date(b.eventDate).getTime() : 0)
                return da - db
            })

            // Sort past by date descending (most recent first)
            past.sort((a, b) => {
                const da = a.eventDate?.seconds ? a.eventDate.seconds * 1000 : (a.eventDate ? new Date(a.eventDate).getTime() : 0)
                const db = b.eventDate?.seconds ? b.eventDate.seconds * 1000 : (b.eventDate ? new Date(b.eventDate).getTime() : 0)
                return db - da
            })
        }

        return { upcomingEvents: upcoming, pastEvents: past }
    }, [posts])

    const handleDelete = async (id) => {
        const result = await deleteEventPost(id)
        if (result.success) {
            toast.success('Event deleted')
            mutate()
            setDeleteConfirm(null)
        } else {
            toast.error(result.error || 'Failed to delete')
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-gray-500">Loading events...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-red-500">Error: {error}</p>
            </div>
        )
    }

    const renderTable = (events, title, emptyMsg, Icon) => (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
                <Icon size={18} className="text-gray-500" />
                <h3 className="font-bold text-gray-700 dark:text-gray-300">{title} ({events.length})</h3>
            </div>
            {events.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-8 text-center">
                    <p className="text-gray-400 text-sm italic">{emptyMsg}</p>
                </div>
            ) : (
                <div className="flex flex-col flex-1 w-full gap-3 overflow-x-auto rounded-xl">
                    <table className="border-separate border-spacing-y-3">
                        <thead>
                            <tr>
                                <th className="px-3 py-2 font-semibold bg-white border-l rounded-l-lg border-y">SN</th>
                                <th className="px-3 py-2 font-semibold bg-white border-y text-left">Image</th>
                                <th className="px-3 py-2 font-semibold text-left bg-white border-y">Event Name</th>
                                <th className="px-3 py-2 font-semibold text-left bg-white border-y">Category</th>
                                <th className="px-3 py-2 font-semibold text-left bg-white border-y">Event Date</th>
                                <th className="px-3 py-2 font-semibold text-left bg-white border-y">Status</th>
                                <th className="px-3 py-2 font-semibold text-center bg-white border-r rounded-r-lg border-y">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((post, index) => (
                                <tr key={post.id}>
                                    <td className="px-3 py-2 text-center bg-white border-l rounded-l-lg border-y text-sm">{index + 1}</td>
                                    <td className="px-3 py-2 bg-white border-y">
                                        <div className="flex items-center">
                                            <img
                                                className="object-cover w-10 h-10 rounded-md bg-gray-100"
                                                src={post?.featureImageURL || 'https://via.placeholder.com/40x40?text=Event'}
                                                alt=""
                                            />
                                        </div>
                                    </td>
                                    <td className="w-full min-w-[200px] px-3 py-2 bg-white border-y">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-sm text-gray-900 dark:text-white">{post.title}</span>
                                                {post.isFeatured && (
                                                    <Chip size="sm" color="warning" variant="flat" className="h-4 text-[10px]">Featured</Chip>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 bg-white border-y text-sm whitespace-nowrap">
                                        <div className="flex flex-wrap gap-1">
                                            {post.categories?.length > 0 ? (
                                                post.categories.map(catId => (
                                                    <span key={catId} className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded">
                                                        {categoryMap[catId] || catId}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-400 italic">No category</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 bg-white border-y text-sm whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <CalendarDays size={14} className="text-gray-400" />
                                            <span className="font-medium">
                                                {post.eventDate?.seconds
                                                    ? new Date(post.eventDate.seconds * 1000).toLocaleDateString('en-GB', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })
                                                    : post.eventDate
                                                        ? new Date(post.eventDate).toLocaleDateString('en-GB', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })
                                                        : 'Not set'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 bg-white border-y text-sm">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 bg-white border-r rounded-r-lg border-y">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button isIconOnly size="sm" variant="flat" onClick={() => router.push(`/admin/events/edit/${post.id}`)}>
                                                <Edit2 size={14} />
                                            </Button>
                                            {deleteConfirm === post.id ? (
                                                <div className="flex items-center gap-1">
                                                    <Button size="sm" color="danger" className="min-w-unit-0 px-2" onClick={() => handleDelete(post.id)}>Confirm</Button>
                                                    <Button size="sm" variant="flat" className="min-w-unit-0 px-2" onClick={() => setDeleteConfirm(null)}>X</Button>
                                                </div>
                                            ) : (
                                                <Button isIconOnly size="sm" color="danger" variant="flat" onClick={() => setDeleteConfirm(post.id)}>
                                                    <Trash2 size={14} />
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )

    return (
        <main className="flex flex-col gap-6 p-5 pb-20">
            <div className="flex items-center justify-between w-full">
                <BackBtn pageName="Events Catalog" />
                <button
                    onClick={() => router.push('/admin/events/create')}
                    className="bg-[#313131] text-sm text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-sm">add</span>
                    <span>New Event</span>
                </button>
            </div>

            {renderTable(upcomingEvents, "Upcoming Events", "No upcoming events scheduled.", CalendarDays)}

            <div className="mt-4 pt-6 border-t border-gray-200 dark:border-gray-800">
                {renderTable(pastEvents, "Past Events / Archive", "No archived events.", Archive)}
            </div>
        </main>
    )
}

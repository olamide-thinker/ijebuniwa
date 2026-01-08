'use client'

import { useState, useEffect } from 'react'
import { useBlogCategories } from '@/lib/firestore/blog/read'
import { createCategory } from '@/lib/firestore/blog/write'
import toast from 'react-hot-toast'
import { Checkbox, Button, Chip } from '@nextui-org/react'
import { Plus, CalendarDays } from 'lucide-react'

const DEFAULT_CATEGORIES = [
    { id: 'festivals', name: 'Festivals' },
    { id: 'cultural-events', name: 'Cultural Events' },
    { id: 'community', name: 'Community' },
    { id: 'concerts', name: 'Concerts & Shows' },
    { id: 'exhibitions', name: 'Exhibitions' },
]

export default function EventSettings({
    author,
    setAuthor,
    publishDate,
    setPublishDate,
    isFeatured,
    setIsFeatured,
    categories,
    setCategories,
    tags,
    setTags,
    eventDate,
    setEventDate,
}) {
    const [tagInput, setTagInput] = useState('')
    const [categoryInput, setCategoryInput] = useState('')
    const [availableCategories, setAvailableCategories] = useState(DEFAULT_CATEGORIES)

    const { data: firestoreCategories, mutate: mutateCategories } = useBlogCategories()

    useEffect(() => {
        if (firestoreCategories?.data) {
            const firestoreCats = firestoreCategories.data.map(cat => ({
                id: cat.id,
                name: cat.name || cat.id
            }))

            const merged = [...DEFAULT_CATEGORIES]
            firestoreCats.forEach(cat => {
                if (!merged.find(c => c.id === cat.id)) {
                    merged.push(cat)
                }
            })

            setAvailableCategories(merged)
        }
    }, [firestoreCategories])

    const toggleCategory = (categoryId) => {
        if (categories.includes(categoryId)) {
            setCategories(categories.filter((c) => c !== categoryId))
        } else {
            setCategories([...categories, categoryId])
        }
    }

    const addCategory = async () => {
        if (categoryInput.trim()) {
            const categoryId = categoryInput.toLowerCase().replace(/\s+/g, '-')
            const categoryExists = availableCategories.some((c) => c.id === categoryId)

            if (!categoryExists) {
                const newCategory = { id: categoryId, name: categoryInput.trim() }
                setAvailableCategories([...availableCategories, newCategory])
                const result = await createCategory(categoryInput.trim())
                if (result.success) {
                    toast.success('Category added!')
                    mutateCategories()
                } else {
                    toast.error(result.error || 'Failed to add category')
                    setAvailableCategories(availableCategories.filter(c => c.id !== categoryId))
                }
            } else {
                toast.error('Category already exists')
            }
            setCategoryInput('')
        }
    }

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim().toLowerCase()])
            setTagInput('')
        }
    }

    const removeTag = (tagToRemove) => {
        setTags(tags.filter((t) => t !== tagToRemove))
    }

    return (
        <div className="flex flex-col gap-5">
            {/* Event specialized field: Event Date */}
            <section className="flex flex-col gap-4 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                    <CalendarDays size={18} className="text-purple-500" />
                    <h3 className="font-semibold text-sm">Event Date</h3>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500 font-medium" htmlFor="event-date">When will this happen?</label>
                    <input
                        id="event-date"
                        type="datetime-local"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm outline-none focus:border-gray-400 transition-all font-mono"
                    />
                    <p className="text-[10px] text-gray-400 italic">Past events are automatically moved to archive.</p>
                </div>
            </section>

            {/* Standard Publish Settings Section */}
            <section className="flex flex-col gap-4 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
                <h3 className="font-semibold text-sm">Publish Settings</h3>

                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500 font-medium" htmlFor="author">Organizer / Author</label>
                        <input
                            id="author"
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm outline-none focus:border-gray-400 transition-all"
                            placeholder="Enter organizer name"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500 font-medium" htmlFor="publish-date">Publish Date</label>
                        <input
                            id="publish-date"
                            type="date"
                            value={publishDate}
                            onChange={(e) => setPublishDate(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm outline-none focus:border-gray-400 transition-all"
                        />
                    </div>

                    <Checkbox
                        isSelected={isFeatured}
                        onValueChange={setIsFeatured}
                        size="sm"
                        className="mt-1"
                    >
                        <span className="text-sm">Featured Event</span>
                    </Checkbox>
                </div>
            </section>

            {/* Categories & Tags */}
            <section className="flex flex-col gap-4 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
                <h3 className="font-semibold text-sm">Categories</h3>
                <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={categoryInput}
                            onChange={(e) => setCategoryInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                            placeholder="Add category..."
                            className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm outline-none focus:border-gray-400 transition-all"
                        />
                        <Button isIconOnly size="sm" variant="flat" onClick={addCategory}>
                            <Plus size={16} />
                        </Button>
                    </div>
                    <div className="flex flex-col gap-2 max-h-[150px] overflow-y-auto pr-1 custom-scrollbar">
                        {availableCategories.map((category) => (
                            <Checkbox
                                key={category.id}
                                isSelected={categories.includes(category.id)}
                                onValueChange={() => toggleCategory(category.id)}
                                size="sm"
                            >
                                <span className="text-sm">{category.name}</span>
                            </Checkbox>
                        ))}
                    </div>
                </div>
            </section>

            <section className="flex flex-col gap-4 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
                <h3 className="font-semibold text-sm">Tags</h3>
                <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addTag()}
                            placeholder="Add tag..."
                            className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm outline-none focus:border-gray-400 transition-all"
                        />
                        <Button isIconOnly size="sm" variant="flat" onClick={addTag}>
                            <Plus size={16} />
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <Chip
                                key={tag}
                                size="sm"
                                variant="flat"
                                onClose={() => removeTag(tag)}
                                className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-none"
                            >
                                {tag}
                            </Chip>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

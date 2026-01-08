'use client'

import { useState, useEffect } from 'react'
import { useBlogCategories } from '@/lib/firestore/blog/read'
import { createCategory } from '@/lib/firestore/blog/write'
import toast from 'react-hot-toast'
import { Checkbox, Input, Button, Chip } from '@nextui-org/react'
import { Plus, X } from 'lucide-react'

const DEFAULT_CATEGORIES = [
    { id: 'culture-heritage', name: 'Culture & Heritage' },
    { id: 'festivals', name: 'Festivals' },
    { id: 'cuisine', name: 'Cuisine' },
    { id: 'art-craft', name: 'Art & Craft' },
    { id: 'news', name: 'News' },
]

export default function PublishSettings({
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
}) {
    const [tagInput, setTagInput] = useState('')
    const [categoryInput, setCategoryInput] = useState('')
    const [availableCategories, setAvailableCategories] = useState(DEFAULT_CATEGORIES)

    // Load categories from Firestore
    const { data: firestoreCategories, mutate: mutateCategories } = useBlogCategories()

    // Merge Firestore categories with defaults
    useEffect(() => {
        if (firestoreCategories?.data) {
            const firestoreCats = firestoreCategories.data.map(cat => ({
                id: cat.id,
                name: cat.name || cat.id
            }))

            // Merge and deduplicate
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
                // Add to local state immediately
                const newCategory = { id: categoryId, name: categoryInput.trim() }
                setAvailableCategories([...availableCategories, newCategory])

                // Save to Firestore
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
            {/* Publish Settings Section */}
            <section className="flex flex-col gap-4 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl">
                <h3 className="font-semibold text-sm">Publish Settings</h3>

                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500 font-medium" htmlFor="author">Author</label>
                        <input
                            id="author"
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm outline-none focus:border-gray-400 transition-all"
                            placeholder="Enter author name"
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
                        <span className="text-sm">Featured Article</span>
                    </Checkbox>
                </div>
            </section>

            {/* Categories Section */}
            <section className="flex flex-col gap-4 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-poppins">
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

                    <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
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

            {/* Tags Section */}
            <section className="flex flex-col gap-4 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl">
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
                        {tags.length === 0 && <span className="text-xs text-gray-400 italic italic">No tags added</span>}
                    </div>
                </div>
            </section>
        </div>
    )
}

'use client'

import { useState } from 'react'

const DEFAULT_CATEGORIES = [
    { id: 'culture-heritage', name: 'Culture & Heritage' },
    { id: 'festivals', name: 'Festivals' },
    { id: 'cuisine', name: 'Cuisine' },
    { id: 'art-craft', name: 'Art & Craft' },
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
    onPublish,
    onSaveDraft,
    onPreview,
    wordCount = 0,
    lastSaved,
}) {
    const [tagInput, setTagInput] = useState('')

    const toggleCategory = (categoryId) => {
        if (categories.includes(categoryId)) {
            setCategories(categories.filter((c) => c !== categoryId))
        } else {
            setCategories([...categories, categoryId])
        }
    }

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim().toLowerCase()])
            setTagInput('')
        }
    }

    const removeTag = (tag) => {
        setTags(tags.filter((t) => t !== tag))
    }

    return (
        <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sticky top-[80px] z-30">
                <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex gap-3">
                    <button
                        onClick={onPreview}
                        className="flex-1 h-10 px-4 rounded border border-gray-200 dark:border-gray-700 bg-transparent text-gray-700 dark:text-gray-300 text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        Preview
                    </button>
                    <button
                        onClick={onPublish}
                        className="flex-1 h-10 px-4 rounded border border-transparent bg-blue-600 text-white text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <span>Publish</span>
                        <span className="material-symbols-outlined text-sm">send</span>
                    </button>
                </div>
                <button
                    onClick={onSaveDraft}
                    className="w-full text-center text-sm text-gray-500 hover:text-blue-600 underline decoration-dotted transition-colors"
                >
                    Save as Draft
                </button>
            </div>

            {/* Status */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-4 py-3 flex justify-between text-xs text-gray-400">
                    <span>{lastSaved ? `Last saved ${lastSaved}` : 'Not saved'}</span>
                    <span>{wordCount} words</span>
                </div>
            </div>

            {/* Publish Settings */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Publish Settings</h3>
                </div>
                <div className="p-4 flex flex-col gap-4">
                    <label className="flex flex-col gap-1.5">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Author</span>
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className="w-full h-10 px-3 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Enter author name"
                        />
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Publish Date</span>
                        <input
                            type="date"
                            value={publishDate}
                            onChange={(e) => setPublishDate(e.target.value)}
                            className="w-full h-10 px-3 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </label>
                    <label className="flex items-center justify-between p-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Featured Article</span>
                        <input
                            type="checkbox"
                            checked={isFeatured}
                            onChange={(e) => setIsFeatured(e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                        />
                    </label>
                </div>
            </div>

            {/* Taxonomy */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Taxonomy</h3>
                </div>
                <div className="p-4 flex flex-col gap-4">
                    {/* Categories */}
                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Categories</span>
                        <div className="flex flex-col gap-2">
                            {DEFAULT_CATEGORIES.map((category) => (
                                <label
                                    key={category.id}
                                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded"
                                >
                                    <input
                                        type="checkbox"
                                        checked={categories.includes(category.id)}
                                        onChange={() => toggleCategory(category.id)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{category.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tags</span>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded flex items-center gap-1 border border-gray-200 dark:border-gray-700"
                                >
                                    #{tag}
                                    <button onClick={() => removeTag(tag)} className="hover:text-red-500">
                                        <span className="material-symbols-outlined text-[10px]">close</span>
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        addTag()
                                    }
                                }}
                                className="w-full h-9 px-3 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Add a tag..."
                            />
                            <button onClick={addTag} className="absolute right-1 top-1 bottom-1 text-blue-600 hover:bg-blue-50 rounded px-2">
                                <span className="material-symbols-outlined text-sm">add</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

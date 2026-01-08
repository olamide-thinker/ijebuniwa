'use client'

import { useBlogPosts } from '@/lib/firestore/blog/read'
import { deleteBlogPost } from '@/lib/firestore/blog/write'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function BlogListPage() {
    const { data: blogs, isLoading, error, mutate } = useBlogPosts()
    const router = useRouter()
    const [deleteConfirm, setDeleteConfirm] = useState(null)

    const handleDelete = async (id) => {
        const result = await deleteBlogPost(id)

        if (result.success) {
            toast.success('Blog post deleted')
            mutate()
            setDeleteConfirm(null)
        } else {
            toast.error(result.error || 'Failed to delete')
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-gray-500">Loading...</p>
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

    const blogList = blogs?.data || []

    return (
        <div className="flex-grow w-full max-w-[1200px] mx-auto p-6 lg:p-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-black leading-tight tracking-[-0.033em] text-gray-900 dark:text-white">
                        Blog Posts
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-base font-normal mt-1">
                        Manage articles about Ijebu heritage and events
                    </p>
                </div>
                <button
                    onClick={() => router.push('/admin/blog/create')}
                    className="h-10 px-6 rounded bg-blue-600 text-white text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-sm">add</span>
                    <span>New Article</span>
                </button>
            </div>

            {/* Blog List */}
            {blogList.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                    <div className="size-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-4xl text-gray-400">article</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No blog posts yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Get started by creating your first article</p>
                    <button
                        onClick={() => router.push('/admin/blog/create')}
                        className="inline-flex h-10 px-6 rounded bg-blue-600 text-white text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">add</span>
                        <span>Create First Article</span>
                    </button>
                </div>
            ) : (
                <div className="grid gap-6">
                    {blogList.map((blog) => (
                        <div
                            key={blog.id}
                            className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-grow">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{blog.title}</h3>
                                        {blog.isFeatured && (
                                            <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 text-xs px-2 py-0.5 rounded font-medium">
                                                Featured
                                            </span>
                                        )}
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded font-medium ${blog.status === 'published'
                                                    ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                                }`}
                                        >
                                            {blog.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                                        {blog.excerpt || 'No excerpt available'}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span>{blog.author || 'Unknown Author'}</span>
                                        <span>•</span>
                                        <span>
                                            {blog.publishDate
                                                ? new Date(blog.publishDate.seconds * 1000).toLocaleDateString()
                                                : 'No date'}
                                        </span>
                                        <span>•</span>
                                        <span>{blog.categories?.length || 0} categories</span>
                                        <span>•</span>
                                        <span>{blog.tags?.length || 0} tags</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => router.push(`/admin/blog/edit/${blog.id}`)}
                                        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                                        title="Edit"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                    </button>
                                    {deleteConfirm === blog.id ? (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleDelete(blog.id)}
                                                className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(null)}
                                                className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded hover:bg-gray-300"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setDeleteConfirm(blog.id)}
                                            className="p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                                            title="Delete"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

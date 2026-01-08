'use client'

import { useBlogPosts } from '@/lib/firestore/blog/read'
import { deleteBlogPost } from '@/lib/firestore/blog/write'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import BackBtn from '@/lib/backBtn'
import { Button } from '@nextui-org/react'
import { Edit2, Trash2 } from 'lucide-react'

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
        <main className="flex flex-col gap-4 p-5">
            {/* Header */}
            <div className="flex items-center justify-between w-full">
                <BackBtn pageName="Blog Posts" />
                <button
                    onClick={() => router.push('/admin/blog/create')}
                    className="bg-[#313131] text-sm text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-sm">add</span>
                    <span>New Article</span>
                </button>
            </div>

            {/* Blog Table List */}
            {blogList.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                    <div className="size-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-4xl text-gray-400">article</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No blog posts yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Get started by creating your first article</p>
                    <button
                        onClick={() => router.push('/admin/blog/create')}
                        className="inline-flex h-10 px-6 rounded bg-[#313131] text-white text-sm font-bold shadow-sm items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">add</span>
                        <span>Create First Article</span>
                    </button>
                </div>
            ) : (
                <div className="flex flex-col flex-1 w-full gap-3 overflow-x-auto rounded-xl">
                    <table className="border-separate border-spacing-y-3">
                        <thead>
                            <tr>
                                <th className="px-3 py-2 font-semibold bg-white border-l rounded-l-lg border-y">SN</th>
                                <th className="px-3 py-2 font-semibold bg-white border-y text-left">Image</th>
                                <th className="px-3 py-2 font-semibold text-left bg-white border-y">Title</th>
                                <th className="px-3 py-2 font-semibold text-left bg-white border-y">Author</th>
                                <th className="px-3 py-2 font-semibold text-left bg-white border-y">Date</th>
                                <th className="px-3 py-2 font-semibold text-left bg-white border-y">Status</th>
                                <th className="px-3 py-2 font-semibold text-center bg-white border-r rounded-r-lg border-y">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogList.map((blog, index) => (
                                <tr key={blog.id}>
                                    <td className="px-3 py-2 text-center bg-white border-l rounded-l-lg border-y text-sm">{index + 1}</td>
                                    <td className="px-3 py-2 bg-white border-y">
                                        <div className="flex items-center">
                                            <img
                                                className="object-cover w-10 h-10 rounded-md bg-gray-100"
                                                src={blog?.featureImageURL || 'https://via.placeholder.com/40x40?text=Blog'}
                                                alt=""
                                            />
                                        </div>
                                    </td>
                                    <td className="w-full min-w-[300px] px-3 py-2 bg-white border-y">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-sm text-gray-900 dark:text-white">{blog.title}</span>
                                                {blog.isFeatured && (
                                                    <span className="bg-yellow-100 text-yellow-700 text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                                                        Featured
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-400 truncate max-w-[250px]">{blog.excerpt || 'No excerpt'}</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 bg-white border-y text-sm whitespace-nowrap text-gray-600 font-medium">{blog.author || 'Unknown'}</td>
                                    <td className="px-3 py-2 bg-white border-y text-sm whitespace-nowrap text-gray-500">
                                        {blog.publishDate?.seconds
                                            ? new Date(blog.publishDate.seconds * 1000).toLocaleDateString()
                                            : blog.publishDate
                                                ? new Date(blog.publishDate).toLocaleDateString()
                                                : 'N/A'}
                                    </td>
                                    <td className="px-3 py-2 bg-white border-y text-sm">
                                        <div className="flex">
                                            <span
                                                className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${blog.status === 'published'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-600'
                                                    }`}
                                            >
                                                {blog.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 bg-white border-r rounded-r-lg border-y">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="flat"
                                                onClick={() => router.push(`/admin/blog/edit/${blog.id}`)}
                                            >
                                                <Edit2 size={14} />
                                            </Button>

                                            {deleteConfirm === blog.id ? (
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        size="sm"
                                                        color="danger"
                                                        className="min-w-unit-0 px-2"
                                                        onClick={() => handleDelete(blog.id)}
                                                    >
                                                        Confirm
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="flat"
                                                        className="min-w-unit-0 px-2"
                                                        onClick={() => setDeleteConfirm(null)}
                                                    >
                                                        X
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    color="danger"
                                                    variant="flat"
                                                    onClick={() => setDeleteConfirm(blog.id)}
                                                >
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

            {/* Legacy Card Layout (Commented Out)
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
                                ...
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            */}
        </main>
    )
}

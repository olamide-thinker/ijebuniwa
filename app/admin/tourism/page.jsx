'use client'

import { useTourismPosts } from '@/lib/firestore/tourism/read'
import { useBlogCategories } from '@/lib/firestore/blog/read'
import { deleteTourismPost } from '@/lib/firestore/tourism/write'
import { useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'
import toast from 'react-hot-toast'
import BackBtn from '@/lib/backBtn'
import { Button } from '@nextui-org/react'
import { Edit2, Trash2, MapPin } from 'lucide-react'

export default function TourismListPage() {
    const { data: posts, isLoading: postsLoading, error, mutate } = useTourismPosts()
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

    const handleDelete = async (id) => {
        const result = await deleteTourismPost(id)
        if (result.success) {
            toast.success('Post deleted')
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

    const postList = posts?.data || []

    return (
        <main className="flex flex-col gap-4 p-5">
            <div className="flex items-center justify-between w-full">
                <BackBtn pageName="Tourism Spots" />
                <button
                    onClick={() => router.push('/admin/tourism/create')}
                    className="bg-[#313131] text-sm text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-sm">add</span>
                    <span>New Spot</span>
                </button>
            </div>

            {postList.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                    <div className="size-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                        <MapPin className="text-4xl text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No tourism spots yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Start documenting Ijebu's heritage sites</p>
                    <button
                        onClick={() => router.push('/admin/tourism/create')}
                        className="inline-flex h-10 px-6 rounded bg-[#313131] text-white text-sm font-bold shadow-sm items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">add</span>
                        <span>Add Your First Spot</span>
                    </button>
                </div>
            ) : (
                <div className="flex flex-col flex-1 w-full gap-3 overflow-x-auto rounded-xl">
                    <table className="border-separate border-spacing-y-3">
                        <thead>
                            <tr>
                                <th className="px-3 py-2 font-semibold bg-white border-l rounded-l-lg border-y">SN</th>
                                <th className="px-3 py-2 font-semibold bg-white border-y text-left">Image</th>
                                <th className="px-3 py-2 font-semibold text-left bg-white border-y">Spot Name</th>
                                <th className="px-3 py-2 font-semibold text-left bg-white border-y">Category</th>
                                <th className="px-3 py-2 font-semibold text-center bg-white border-y">Location</th>
                                <th className="px-3 py-2 font-semibold text-left bg-white border-y">Status</th>
                                <th className="px-3 py-2 font-semibold text-center bg-white border-r rounded-r-lg border-y">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {postList.map((post, index) => (
                                <tr key={post.id}>
                                    <td className="px-3 py-2 text-center bg-white border-l rounded-l-lg border-y text-sm">{index + 1}</td>
                                    <td className="px-3 py-2 bg-white border-y">
                                        <div className="flex items-center">
                                            <img
                                                className="object-cover w-10 h-10 rounded-md bg-gray-100"
                                                src={post?.featureImageURL || 'https://via.placeholder.com/40x40?text=Spot'}
                                                alt=""
                                            />
                                        </div>
                                    </td>
                                    <td className="w-full min-w-[200px] px-3 py-2 bg-white border-y">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-sm text-gray-900 dark:text-white">{post.title}</span>
                                                {post.isFeatured && (
                                                    <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                                                        Top Spot
                                                    </span>
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
                                    <td className="px-3 py-2 bg-white border-y text-center">
                                        {post.locationLink ? (
                                            <a href={post.locationLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                                                <MapPin size={18} className="mx-auto" />
                                            </a>
                                        ) : (
                                            <span className="text-gray-300">-</span>
                                        )}
                                    </td>
                                    <td className="px-3 py-2 bg-white border-y text-sm">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 bg-white border-r rounded-r-lg border-y">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button isIconOnly size="sm" variant="flat" onClick={() => router.push(`/admin/tourism/edit/${post.id}`)}>
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
        </main>
    )
}

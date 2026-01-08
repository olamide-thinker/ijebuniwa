'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import BlogToolbar from '../../components/BlogToolbar'
import PublishSettings from '../../components/PublishSettings'
import { updateBlogPost, publishBlogPost, autoSaveBlogPost } from '@/lib/firestore/blog/write'
import { useBlogPost } from '@/lib/firestore/blog/read'
import toast from 'react-hot-toast'
import debounce from 'lodash.debounce'
import BackBtn from '@/lib/backBtn'
import { Button } from '@nextui-org/react'

export default function EditBlogPage() {
    const router = useRouter()
    const params = useParams()
    const blogId = params.blogId

    const { data: blogData, isLoading } = useBlogPost(blogId)

    const [title, setTitle] = useState('')
    const [content, setContent] = useState({})
    const [author, setAuthor] = useState('')
    const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0])
    const [isFeatured, setIsFeatured] = useState(false)
    const [categories, setCategories] = useState([])
    const [tags, setTags] = useState([])
    const [wordCount, setWordCount] = useState(0)
    const [lastSaved, setLastSaved] = useState(null)
    const [isUpdating, setIsUpdating] = useState(false)

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2],
                },
            }),
            Underline,
            Image,
            Link.configure({
                openOnClick: false,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        immediatelyRender: false,
        content: '',
        editorProps: {
            attributes: {
                class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[400px]',
            },
        },
        onUpdate: ({ editor }) => {
            const json = editor.getJSON()
            const text = editor.getText()
            setContent(json)
            setWordCount(text.split(/\s+/).filter((word) => word.length > 0).length)

            // Auto-save
            if (blogId) {
                debouncedAutoSave(blogId, {
                    title,
                    content: json,
                })
            }
        },
    })

    // Load blog data
    useEffect(() => {
        if (blogData?.data) {
            const blog = blogData.data
            setTitle(blog.title || '')
            setAuthor(blog.author || '')
            setIsFeatured(blog.isFeatured || false)
            setCategories(blog.categories || [])
            setTags(blog.tags || [])

            if (blog.publishDate?.seconds) {
                const date = new Date(blog.publishDate.seconds * 1000)
                setPublishDate(date.toISOString().split('T')[0])
            } else if (blog.publishDate) {
                setPublishDate(new Date(blog.publishDate).toISOString().split('T')[0])
            }

            if (blog.content && editor) {
                editor.commands.setContent(blog.content)
                setContent(blog.content)
                const text = editor.getText()
                setWordCount(text.split(/\s+/).filter((word) => word.length > 0).length)
            }
        }
    }, [blogData, editor])

    // Debounced auto-save
    const debouncedAutoSave = useCallback(
        debounce(async (id, data) => {
            const result = await autoSaveBlogPost(id, data)
            if (result.success) {
                const now = new Date()
                setLastSaved(`${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`)
            }
        }, 2000),
        [],
    )

    const handleUpdate = async () => {
        if (!title.trim()) {
            toast.error('Please enter a title')
            return
        }

        setIsUpdating(true)

        try {
            const updateData = {
                title,
                content,
                author,
                publishDate: new Date(publishDate),
                isFeatured,
                categories,
                tags,
            }

            const result = await updateBlogPost(blogId, updateData)

            if (result.success) {
                toast.success('Blog post updated successfully')
            } else {
                toast.error(result.error || 'Failed to update blog post')
            }
        } catch (error) {
            toast.error('An error occurred while updating')
            console.error(error)
        } finally {
            setIsUpdating(false)
        }
    }

    const handlePublish = async () => {
        if (!title.trim()) {
            toast.error('Please enter a title')
            return
        }

        setIsUpdating(true)

        try {
            // Update first
            await updateBlogPost(blogId, {
                title,
                content,
                author,
                publishDate: new Date(publishDate),
                isFeatured,
                categories,
                tags,
            })

            // Then publish
            const publishResult = await publishBlogPost(blogId)

            if (publishResult.success) {
                toast.success('Blog post published successfully!')
                router.push('/admin/blog')
            } else {
                toast.error(publishResult.error || 'Failed to publish')
            }
        } catch (error) {
            toast.error('An error occurred while publishing')
            console.error(error)
        } finally {
            setIsUpdating(false)
        }
    }

    const handlePreview = () => {
        // TODO: Implement preview
        toast('Preview coming soon!')
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-gray-500">Loading...</p>
            </div>
        )
    }

    if (!blogData?.data) {
        return (
            <div className="flex items-center justify-center min-h-[400px] flex-col gap-4">
                <p className="text-red-500 font-bold">Blog post not found</p>
                <button
                    onClick={() => router.push('/admin/blog')}
                    className="text-blue-600 hover:underline"
                >
                    Back to Blog List
                </button>
            </div>
        )
    }

    return (
        <main className="flex flex-col gap-4 p-5">
            {/* Header */}
            <div className="flex items-center justify-between w-full">
                <BackBtn pageName="Edit Article" />
                <div className="flex gap-2">
                    <Button
                        variant="flat"
                        onClick={handleUpdate}
                        isLoading={isUpdating}
                    >
                        Save Changes
                    </Button>
                    <Button
                        className="bg-[#313131] text-white"
                        onClick={handlePublish}
                        isLoading={isUpdating}
                    >
                        Publish
                    </Button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-5 relative h-[80vh] overflow-auto">
                {/* Left Panel: Editor (8 cols equivalent in flex) */}
                <div className="flex-[2] flex flex-col gap-5 h-fit">
                    {/* Editor Card */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex flex-col min-h-[600px]">
                        <h2 className="font-semibold mb-3 text-sm">Article Content</h2>

                        {/* Title Input Standardized */}
                        <div className="flex flex-col gap-1 mb-6">
                            <label className="text-xs text-gray-500 font-medium" htmlFor="article-title">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="article-title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-2xl font-bold placeholder-gray-300 dark:placeholder-gray-600 text-gray-900 dark:text-white focus:border-gray-400 outline-none transition-all"
                                placeholder="Enter a captivating title..."
                            />
                        </div>

                        {/* Toolbar */}
                        <div className="mb-2">
                            <BlogToolbar editor={editor} />
                        </div>

                        {/* Writing Canvas */}
                        <div className="flex-grow p-4 border border-gray-100 dark:border-gray-800 rounded-lg bg-gray-50/30">
                            <EditorContent editor={editor} className="h-full w-full" />
                        </div>

                        {/* Word Count Footer */}
                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 flex justify-between font-medium">
                            <span>{lastSaved ? `Last saved at ${lastSaved}` : 'Not saved yet'}</span>
                            <span>{wordCount} words</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Sidebar (4 cols equivalent in flex) */}
                <div className="flex-1 flex flex-col gap-5">
                    <PublishSettings
                        author={author}
                        setAuthor={setAuthor}
                        publishDate={publishDate}
                        setPublishDate={setPublishDate}
                        isFeatured={isFeatured}
                        setIsFeatured={setIsFeatured}
                        categories={categories}
                        setCategories={setCategories}
                        tags={tags}
                        setTags={setTags}
                        onPublish={handlePublish}
                        onSaveDraft={handleUpdate}
                        onPreview={handlePreview}
                        wordCount={wordCount}
                        lastSaved={lastSaved}
                    />
                </div>
            </div>
        </main>
    )
}

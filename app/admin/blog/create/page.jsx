'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import { EditorContent } from '@tiptap/react'
import BlogToolbar from '../components/BlogToolbar'
import PublishSettings from '../components/PublishSettings'
import { createBlogPost, updateBlogPost, publishBlogPost, autoSaveBlogPost } from '@/lib/firestore/blog/write'
import toast from 'react-hot-toast'
import debounce from 'lodash.debounce'
import BackBtn from '@/lib/backBtn'
import { Button } from '@nextui-org/react'

import { useAuth } from '@/contexts/AuthContext'

export default function CreateBlogPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState({})
    const [author, setAuthor] = useState('')
    const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0])

    // Set default author to current user
    useEffect(() => {
        if (user?.displayName && !author) {
            setAuthor(user.displayName)
        }
    }, [user])
    const [isFeatured, setIsFeatured] = useState(false)
    const [categories, setCategories] = useState([])
    const [tags, setTags] = useState([])
    const [wordCount, setWordCount] = useState(0)
    const [lastSaved, setLastSaved] = useState(null)
    const [currentBlogId, setCurrentBlogId] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

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

            // Auto-save: Create draft if it doesn't exist, otherwise update
            debouncedAutoSave({
                title,
                content: json,
                author,
                publishDate: new Date(publishDate),
                isFeatured,
                categories,
                tags,
                status: 'draft',
            })
        },
    })

    // Debounced auto-save
    const debouncedAutoSave = useCallback(
        debounce(async (data) => {
            if (currentBlogId) {
                // Update existing
                const result = await autoSaveBlogPost(currentBlogId, data)
                if (result.success) {
                    const now = new Date()
                    setLastSaved(`${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`)
                }
            } else if (data.title && data.title.trim().length > 0) {
                // Create first draft
                const result = await createBlogPost(data)
                if (result.success) {
                    setCurrentBlogId(result.id)
                    const now = new Date()
                    setLastSaved(`${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`)
                }
            }
        }, 2000),
        [currentBlogId, title, author, publishDate, isFeatured, categories, tags],
    )

    const handleSaveDraft = async () => {
        if (!title.trim()) {
            toast.error('Please enter a title')
            return
        }

        setIsLoading(true)

        try {
            const blogData = {
                title,
                content,
                author,
                publishDate: new Date(publishDate),
                isFeatured,
                categories,
                tags,
                status: 'draft',
            }

            let result
            if (currentBlogId) {
                result = await updateBlogPost(currentBlogId, blogData)
            } else {
                result = await createBlogPost(blogData)
                if (result.success) {
                    setCurrentBlogId(result.id)
                }
            }

            if (result.success) {
                toast.success('Draft saved successfully')
            } else {
                toast.error(result.error || 'Failed to save draft')
            }
        } catch (error) {
            toast.error('An error occurred while saving')
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handlePublish = async () => {
        if (!title.trim()) {
            toast.error('Please enter a title')
            return
        }

        setIsLoading(true)

        try {
            let blogId = currentBlogId

            // Create draft first if it doesn't exist
            if (!blogId) {
                const blogData = {
                    title,
                    content,
                    author,
                    publishDate: new Date(publishDate),
                    isFeatured,
                    categories,
                    tags,
                    status: 'draft',
                }

                const result = await createBlogPost(blogData)
                if (!result.success) {
                    toast.error(result.error || 'Failed to create blog post')
                    return
                }
                blogId = result.id
                setCurrentBlogId(blogId)
            } else {
                // Save current changes before publishing
                const blogData = {
                    title,
                    content,
                    author,
                    publishDate: new Date(publishDate),
                    isFeatured,
                    categories,
                    tags,
                }
                await updateBlogPost(blogId, blogData)
            }
            // Publish it
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
            setIsLoading(false)
        }
    }

    const handlePreview = () => {
        // TODO: Implement preview
        toast('Preview coming soon!')
    }

    return (
        <main className="flex flex-col gap-4 p-5">
            {/* Header */}
            <div className="flex items-center justify-between w-full">
                <BackBtn pageName="Create New Article" />
                <div className="flex gap-2">
                    <Button
                        variant="flat"
                        onClick={handleSaveDraft}
                        isLoading={isLoading}
                    >
                        Save Draft
                    </Button>
                    <Button
                        className="bg-[#313131] text-white"
                        onClick={handlePublish}
                        isLoading={isLoading}
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
                        onSaveDraft={handleSaveDraft}
                        onPreview={handlePreview}
                        wordCount={wordCount}
                        lastSaved={lastSaved}
                    />
                </div>
            </div>
        </main>
    )
}

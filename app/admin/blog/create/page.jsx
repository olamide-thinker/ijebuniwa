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

export default function CreateBlogPage() {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState({})
    const [author, setAuthor] = useState('')
    const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0])
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

            // Auto-save if blog post exists
            if (currentBlogId) {
                debouncedAutoSave(currentBlogId, {
                    title,
                    content: json,
                })
            }
        },
    })

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
        <div className="flex-grow w-full max-w-[1440px] mx-auto p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Editor (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
                {/* Page Heading */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl lg:text-4xl font-black leading-tight tracking-[-0.033em] text-gray-900 dark:text-white">
                        Create New Article
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-base font-normal">
                        Share the heritage and stories of Ijebu with the world.
                    </p>
                </div>

                {/* Editor Card */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col min-h-[600px] flex-grow">
                    {/* Title Input */}
                    <div className="p-8 pb-4">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-transparent border-none p-0 text-3xl lg:text-5xl font-bold placeholder-gray-300 dark:placeholder-gray-600 text-gray-900 dark:text-white focus:ring-0 leading-tight"
                            placeholder="Enter a captivating title..."
                        />
                    </div>

                    {/* Toolbar */}
                    <BlogToolbar editor={editor} />

                    {/* Writing Canvas */}
                    <div className="flex-grow p-8 relative">
                        <EditorContent editor={editor} className="h-full w-full" />
                    </div>

                    {/* Word Count Footer */}
                    <div className="px-8 py-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-400 flex justify-between">
                        <span>{lastSaved ? `Last saved at ${lastSaved}` : 'Not saved yet'}</span>
                        <span>{wordCount} words</span>
                    </div>
                </div>
            </div>

            {/* Right Column: Sidebar (4 cols) */}
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
    )
}

'use client'

import { useBlogPostBySlug } from '@/lib/firestore/blog/read'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import LinkExt from '@tiptap/extension-link'
import { useEffect } from 'react'

export default function BlogPostPage() {
    const params = useParams()
    const slug = params.slug

    // Find blog by slug
    const { data: blogData, isLoading, error } = useBlogPostBySlug(slug)

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Image,
            LinkExt.configure({
                openOnClick: true,
            }),
        ],
        immediatelyRender: false,
        editable: false,
        content: '',
    })

    useEffect(() => {
        if (blogData?.data?.content && editor) {
            editor.commands.setContent(blogData.data.content)
        }
    }, [blogData, editor])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-gray-500">Loading article...</p>
            </div>
        )
    }

    if (error || !blogData?.data) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Article not found</h2>
                    <Link href="/blog" className="text-blue-600 hover:underline">
                        ← Back to all articles
                    </Link>
                </div>
            </div>
        )
    }

    const blog = blogData.data

    return (
        <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Content Column */}
                <article className="lg:col-span-8 flex flex-col gap-6">
                    {/* Breadcrumbs */}
                    <nav className="flex flex-wrap items-center gap-2 text-sm">
                        <Link href="/" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">
                            Home
                        </Link>
                        <span className="material-symbols-outlined text-gray-500 text-[16px]">chevron_right</span>
                        <Link href="/blog" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">
                            Blog
                        </Link>
                        {blog.categories && blog.categories.length > 0 && (
                            <>
                                <span className="material-symbols-outlined text-gray-500 text-[16px]">chevron_right</span>
                                <span className="text-gray-500 font-medium capitalize">{blog.categories[0].replace(/-/g, ' ')}</span>
                            </>
                        )}
                        <span className="material-symbols-outlined text-gray-500 text-[16px]">chevron_right</span>
                        <span className="text-gray-900 dark:text-gray-300 font-medium truncate max-w-[200px] md:max-w-none">
                            {blog.title}
                        </span>
                    </nav>

                    {/* Page Heading */}
                    <div className="flex flex-col gap-4 mt-2">
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-[-0.033em]">
                            {blog.title}
                        </h1>
                        <div className="flex items-center justify-between border-b border-t border-gray-100 dark:border-gray-800 py-4 mt-2">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                                    {blog.author ? blog.author.charAt(0).toUpperCase() : 'I'}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold">{blog.author || 'Ijebu Stories'}</span>
                                    <span className="text-xs text-gray-500">
                                        {blog.publishDate
                                            ? new Date(blog.publishDate.seconds * 1000).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })
                                            : ''}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500">
                                    <span className="material-symbols-outlined text-[20px]">share</span>
                                </button>
                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500">
                                    <span className="material-symbols-outlined text-[20px]">bookmark</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Featured Image */}
                    {blog.featuredImage && (
                        <div className="w-full relative mt-2 group">
                            <div className="aspect-[16/9] w-full overflow-hidden rounded-lg shadow-sm">
                                <div
                                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                    style={{ backgroundImage: `url(${blog.featuredImage})` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Article Content */}
                    <div className="prose prose-lg prose-slate dark:prose-invert max-w-none leading-relaxed mt-6">
                        <EditorContent editor={editor} />
                    </div>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-8 py-6 border-t border-gray-100 dark:border-gray-800">
                            {blog.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-200 cursor-pointer transition-colors"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Back to Blog */}
                    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-blue-600 hover:underline font-semibold"
                        >
                            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                            Back to all articles
                        </Link>
                    </div>
                </article>

                {/* Sidebar */}
                <aside className="lg:col-span-4 flex flex-col gap-10">
                    {/* Categories */}
                    {blog.categories && blog.categories.length > 0 && (
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Categories</h3>
                            <div className="flex flex-wrap gap-2">
                                {blog.categories.map((category) => (
                                    <span
                                        key={category}
                                        className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-sm font-semibold capitalize"
                                    >
                                        {category.replace(/-/g, ' ')}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Newsletter */}
                    <div className="bg-blue-50 dark:bg-gray-800 rounded-lg p-6">
                        <span className="material-symbols-outlined text-blue-600 text-4xl mb-3">mark_email_unread</span>
                        <h3 className="text-xl font-bold mb-2">Heritage in your inbox</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Get the latest stories and cultural insights delivered weekly.
                        </p>
                        <div className="flex flex-col gap-2">
                            <input
                                className="w-full px-4 py-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-blue-600 focus:ring-0 text-sm"
                                placeholder="Your email address"
                                type="email"
                            />
                            <button className="w-full py-2 bg-blue-600 text-white rounded font-bold text-sm hover:bg-blue-700 transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    )
}

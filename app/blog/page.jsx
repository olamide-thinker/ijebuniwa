'use client'

import { useBlogPosts } from '@/lib/firestore/blog/read'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function BlogListPage() {
    const { data: blogs, isLoading, error } = useBlogPosts()
    const router = useRouter()

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-gray-500">Loading articles...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-red-500">Error loading articles</p>
            </div>
        )
    }

    const publishedBlogs = blogs?.data?.filter((blog) => blog.status === 'published') || []
    const featuredBlog = publishedBlogs.find((blog) => blog.isFeatured)
    const otherBlogs = publishedBlogs.filter((blog) => !blog.isFeatured)

    return (
        <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-8 lg:px-12 py-12">
            {/* Page Header */}
            <div className="mb-12">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-[-0.033em] mb-4">
                    Ijebu Heritage Stories
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                    Discover the rich culture, traditions, and stories that make Ijebu unique.
                </p>
            </div>

            {/* Featured Article */}
            {featuredBlog && (
                <article className="mb-16">
                    <Link href={`/blog/${featuredBlog.slug}`}>
                        <div className="group cursor-pointer">
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                {featuredBlog.featuredImage && (
                                    <div className="aspect-[16/10] rounded-lg overflow-hidden">
                                        <div
                                            className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                            style={{ backgroundImage: `url(${featuredBlog.featuredImage})` }}
                                        />
                                    </div>
                                )}
                                <div className="flex flex-col gap-4">
                                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Featured Story</span>
                                    <h2 className="text-3xl md:text-4xl font-black leading-tight group-hover:text-blue-600 transition-colors">
                                        {featuredBlog.title}
                                    </h2>
                                    {featuredBlog.excerpt && (
                                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{featuredBlog.excerpt}</p>
                                    )}
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span>{featuredBlog.author || 'Ijebu Stories'}</span>
                                        <span>•</span>
                                        <span>
                                            {featuredBlog.publishDate
                                                ? new Date(featuredBlog.publishDate.seconds * 1000).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })
                                                : ''}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </article>
            )}

            {/* Articles Grid */}
            {otherBlogs.length > 0 && (
                <>
                    <h2 className="text-2xl font-bold mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">Latest Articles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {otherBlogs.map((blog) => (
                            <Link key={blog.id} href={`/blog/${blog.slug}`}>
                                <article className="group cursor-pointer">
                                    {blog.featuredImage && (
                                        <div className="aspect-[16/10] rounded-lg overflow-hidden mb-4">
                                            <div
                                                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                                style={{ backgroundImage: `url(${blog.featuredImage})` }}
                                            />
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-2">
                                        {blog.categories && blog.categories.length > 0 && (
                                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                                                {blog.categories[0].replace(/-/g, ' ')}
                                            </span>
                                        )}
                                        <h3 className="text-xl font-bold leading-tight group-hover:text-blue-600 transition-colors">
                                            {blog.title}
                                        </h3>
                                        {blog.excerpt && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{blog.excerpt}</p>
                                        )}
                                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                                            <span>{blog.author || 'Ijebu Stories'}</span>
                                            <span>•</span>
                                            <span>
                                                {blog.publishDate
                                                    ? new Date(blog.publishDate.seconds * 1000).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })
                                                    : ''}
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </>
            )}

            {/* Empty State */}
            {publishedBlogs.length === 0 && (
                <div className="text-center py-20">
                    <h3 className="text-2xl font-bold mb-4">No articles yet</h3>
                    <p className="text-gray-600 dark:text-gray-400">Check back soon for stories about Ijebu heritage!</p>
                </div>
            )}
        </main>
    )
}

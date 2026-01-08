'use client'

export default function BlogToolbar({ editor }) {
    if (!editor) {
        return null
    }

    return (
        <div className="sticky top-[65px] z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-y border-gray-200 dark:border-gray-700 px-6 py-2 flex items-center gap-1 overflow-x-auto">
            {/* Bold */}
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${editor.isActive('bold') ? 'bg-blue-50 dark:bg-blue-900 text-blue-600' : 'text-gray-600 dark:text-gray-300'
                    }`}
                title="Bold (Ctrl+B)"
            >
                <span className="material-symbols-outlined text-[20px]">format_bold</span>
            </button>

            {/* Italic */}
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${editor.isActive('italic') ? 'bg-blue-50 dark:bg-blue-900 text-blue-600' : 'text-gray-600 dark:text-gray-300'
                    }`}
                title="Italic (Ctrl+I)"
            >
                <span className="material-symbols-outlined text-[20px]">format_italic</span>
            </button>

            {/* Underline */}
            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${editor.isActive('underline') ? 'bg-blue-50 dark:bg-blue-900 text-blue-600' : 'text-gray-600 dark:text-gray-300'
                    }`}
                title="Underline (Ctrl+U)"
            >
                <span className="material-symbols-outlined text-[20px]">format_underlined</span>
            </button>

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2"></div>

            {/* Heading 1 */}
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${editor.isActive('heading', { level: 1 })
                        ? 'bg-blue-50 dark:bg-blue-900 text-blue-600'
                        : 'text-gray-600 dark:text-gray-300'
                    }`}
                title="Heading 1"
            >
                <span className="material-symbols-outlined text-[20px]">format_h1</span>
            </button>

            {/* Heading 2 */}
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${editor.isActive('heading', { level: 2 })
                        ? 'bg-blue-50 dark:bg-blue-900 text-blue-600'
                        : 'text-gray-600 dark:text-gray-300'
                    }`}
                title="Heading 2"
            >
                <span className="material-symbols-outlined text-[20px]">format_h2</span>
            </button>

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2"></div>

            {/* Quote */}
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${editor.isActive('blockquote') ? 'bg-blue-50 dark:bg-blue-900 text-blue-600' : 'text-gray-600 dark:text-gray-300'
                    }`}
                title="Quote"
            >
                <span className="material-symbols-outlined text-[20px]">format_quote</span>
            </button>

            {/* Link */}
            <button
                onClick={() => {
                    const url = window.prompt('Enter URL:')
                    if (url) {
                        editor.chain().focus().setLink({ href: url }).run()
                    }
                }}
                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${editor.isActive('link') ? 'bg-blue-50 dark:bg-blue-900 text-blue-600' : 'text-gray-600 dark:text-gray-300'
                    }`}
                title="Link"
            >
                <span className="material-symbols-outlined text-[20px]">link</span>
            </button>

            {/* Image */}
            <button
                onClick={() => {
                    const url = window.prompt('Enter image URL:')
                    if (url) {
                        editor.chain().focus().setImage({ src: url }).run()
                    }
                }}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                title="Image"
            >
                <span className="material-symbols-outlined text-[20px]">image</span>
            </button>
        </div>
    )
}

'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import { useEffect } from 'react'

export default function BlogEditor({ content, onChange, placeholder }) {
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
        content: content || '',
        editorProps: {
            attributes: {
                class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[400px] px-8 py-6',
            },
        },
        onUpdate: ({ editor }) => {
            const json = editor.getJSON()
            const text = editor.getText()
            onChange && onChange({ json, text })
        },
    })

    // Update editor content when prop changes
    useEffect(() => {
        if (editor && content && editor.getHTML() !== content) {
            editor.commands.setContent(content)
        }
    }, [content, editor])

    return (
        <div className="flex-grow relative">
            <EditorContent
                editor={editor}
                className="h-full"
                placeholder={placeholder || 'Tell the story of Ijebu...'}
            />
        </div>
    )
}

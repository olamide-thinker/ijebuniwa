'use client'
import React, { useEffect, useRef, useState } from 'react'
import EditorJS from '@editorjs/editorjs'
import { EDITOR_JS_TOOLS } from './tools'

export default function Editor({ data, onChange, readOnly = false, className }) {
	const editorInstanceRef = useRef(null)
	const holderRef = useRef(null)
	const [initialData, setInitialData] = useState(data) // State to hold initial data

	// Default data if no data is provided
	const defaultData = {
		time: new Date().getTime(),
		blocks: [
			{
				type: 'paragraph',
				data: { text: 'No details provided.' },
			},
		],
	}

	useEffect(() => {}, [data])
	useEffect(() => {
		function st(d) {
			if (!initialData?.blocks[0]) {
				setInitialData(d)
			}
		}
		st(data)
	}, [data])

	console.log(initialData)

	// Function to initialize the EditorJS instance
	const initializeEditor = async (initData) => {
		// if (!editorInstanceRef.current ) {
		if (!editorInstanceRef.current && holderRef.current) {
			// if (!editorInstanceRef.current && holderRef.current) {
			const editor = new EditorJS({
				holder: holderRef.current,
				placeholder: '__No details provided__',
				tools: EDITOR_JS_TOOLS,
				data: initData == null ? undefined : initData,
				readOnly: readOnly,
				onChange: async (api) => {
					const savedData = await api.saver.save()
					onChange(savedData) // Trigger onChange callback with the editor data
				},
			})

			try {
				await editor.isReady
				editorInstanceRef.current = editor
				console.log('Editor initialized:', editor)
			} catch (error) {
				console.error('Editor initialization failed:', error)
			}
		}
	}

	useEffect(() => {
		if (!initialData && holderRef.current && !editorInstanceRef.current) {
			initializeEditor(initialData) // Initialize the editor with initial data
		}
		if (initialData?.blocks && holderRef.current && !editorInstanceRef.current) {
			initializeEditor(initialData) // Initialize the editor with initial data
		}

		// Clean up editor instance when component unmounts
		return () => {
			if (editorInstanceRef.current) {
				editorInstanceRef.current.destroy()
				editorInstanceRef.current = null
			}
		}
	}, [initialData]) // Run only once with initial data

	return (
		<div className="editor-container">
			<div ref={holderRef} className={`p-3 rounded-lg border cdx-input ${className}`} />
		</div>
	)
}

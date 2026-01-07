import SimpleImage from '@editorjs/simple-image'
import Table from '@editorjs/table'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import InlineCode from '@editorjs/inline-code'
import ImageTool from '@editorjs/image'
import Quote from '@editorjs/quote'
import Embed from '@editorjs/embed'

export const EDITOR_JS_TOOLS = {
	header: {
		class: Header,
		inlineToolbar: ['link', 'bold', 'italic'],
		config: {
			placeholder: 'Enter a header...',
			levels: [1, 2, 3, 4, 5, 6], // Allow h1 to h6
			defaultLevel: 3,
		},
	},
	list: {
		class: List,
		inlineToolbar: true,
	},
	inlineCode: InlineCode,
	image: {
		class: ImageTool,
		config: {
			uploader: {
				uploadByFile: async (file) => {
					const formData = new FormData()
					formData.append('file', file)

					const response = await fetch('http://localhost:8008/uploadFile', {
						// Make sure this matches your active endpoint
						method: 'POST',
						body: formData,
					})
					const data = await response.json()

					return {
						success: 1,
						file: {
							url: data.url, // Ensure your server returns the file URL correctly
						},
					}
				},
				uploadByUrl: async (url) => {
					const response = await fetch('http://localhost:8008/fetchUrl', {
						// Ensure this endpoint works
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ url }),
					})

					const data = await response.json()
					return {
						success: 1,
						file: {
							url: data.url,
						},
					}
				},
			},
			// Accept only image file types
			field: 'image',
			types: 'image/*',
		},
	},
	image: SimpleImage,
	quote: {
		class: Quote,
		inlineToolbar: true,
	},
	embed: {
		class: Embed,
		inlineToolbar: true,
		config: {
			services: {
				youtube: true,
			},
		},
	},
	table: {
		class: Table,
		inlineToolbar: true,
		config: {
			rows: 2,
			cols: 3,
			maxRows: 5,
			maxCols: 5,
		},
	},
}

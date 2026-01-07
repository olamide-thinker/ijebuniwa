// "use client";

// import dynamic from "next/dynamic";
// import "react-quill/dist/quill.snow.css";

// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// const modules = {
//   toolbar: {
//     container: [
//       [{ header: [1, 2, false] }],
//       ["bold", "italic", "underline", "strike", "blockquote"],
//       [{ size: ["extra-small", "small", "medium", "large"] }],
//       [{ list: "ordered" }, { list: "bullet" }],
//       ["link"],
//       [{ color: [] }, { background: [] }],
//       ["clean"],
//     ],
//   },
// };

// export default function Description({ data, handleData }) {
//   const handleChange = (value) => {
//     handleData("description", value);
//   };
//   return (
//     <section className="flex flex-col h-full gap-3 p-4 bg-white border rounded-xl">
//       <h1 className="font-semibold">Description</h1>
//       <ReactQuill
//         value={data?.description}
//         onChange={handleChange}
//         modules={modules}
//         placeholder="Enter your description here..."
//       />
//     </section>
//   );
// }

// "use client";

// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import { useEffect } from 'react';

// export default function Description({ data, handleData }) {
//   // Initialize the editor with starter kit options
//   const editor = useEditor({
//     extensions: [StarterKit],
//     content: data?.description || '', // Initial content
//     onUpdate: ({ editor }) => {
//       // Get HTML content similar to react-quill output
//       const html = editor.getHTML();
//       handleData("description", html);
//     },
//   });

//   useEffect(() => {
//     return () => {
//       if (editor) {
//         editor.destroy();
//       }
//     };
//   }, [editor]);

//   return (
//     <section className="flex flex-col h-full gap-3 p-4 bg-white border rounded-xl">
//       <h1 className="font-semibold">Description</h1>
//       <EditorContent editor={editor} placeholder="Enter your description here..." />
//     </section>
//   );
// }

// pages/Description.js

// pages/Description.js
'use client'
import React, { useEffect } from 'react'
import Editor from '../../../../components/editorJs/editorjs'

const Description = ({ data, handleData }) => {
	console.log('data___>s', data)

	return (
		<section className="flex flex-col gap-3 p-4 bg-white border rounded-xl h-fit">
			<h1 className="font-semibold">Description</h1>

			<Editor
				data={data} // Pass the initial description data
				onChange={(content) => handleData(content)}
			/>
		</section>
	)
}

export default Description

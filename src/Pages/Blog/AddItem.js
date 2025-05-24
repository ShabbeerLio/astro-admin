import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import Host from "../../Components/Host/Host";

const AddItem = ({blogToEdit }) => {
  const [title, setTitle] = useState(blogToEdit?.title || "");
  const [description, setDescription] = useState(blogToEdit?.description || "");
  const [image, setImage] = useState(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Underline,
      Link,
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      BulletList,
      OrderedList,
      Blockquote,
      CodeBlock,
    ],
    content: blogToEdit?.content || "<p>Write your blog here...</p>",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editor) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("content", editor.getHTML());
    if (image) formData.append("blogImage", image);

    const url = blogToEdit
      ? `${Host}/api/blogs/${blogToEdit._id}`
      : `${Host}/api/blogs`;
    const method = blogToEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      setTitle("");
      setDescription("");
      setImage(null);
      editor.commands.setContent("<p>Write your blog here...</p>");
    } else {
      alert("Failed to save blog");
    }
  };

  const insertImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "astronivesh_upload");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dxwz7mhdg/image/upload",
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.secure_url) {
        editor.chain().focus().setImage({ src: data.secure_url }).run();
      }
    };
  };

  const setLink = () => {
    const url = window.prompt("Enter the URL");
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  };

  const MenuBar = () => (
    <div style={{ marginBottom: "10px" }}>
      <button
        type="button"
        className={`btn ${editor.isActive("bold") ? "active" : ""}`}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        Bold
      </button>
      <button
        type="button"
        className={`btn ${editor.isActive("italic") ? "active" : ""}`}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        Italic
      </button>
      <button
        type="button"
        className={`btn ${editor.isActive("underline") ? "active" : ""}`}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        Underline
      </button>
      <button
        type="button"
        className={`btn ${
          editor.isActive("heading", { level: 1 }) ? "active" : ""
        }`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        H1
      </button>
      <button
        type="button"
        className={`btn ${
          editor.isActive("heading", { level: 2 }) ? "active" : ""
        }`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </button>
      <button
        type="button"
        className={`btn ${
          editor.isActive("heading", { level: 3 }) ? "active" : ""
        }`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        H3
      </button>

      <button
        type="button"
        className={`btn ${
          editor.isActive("heading", { level: 4 }) ? "active" : ""
        }`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
      >
        H4
      </button>
      <button
        type="button"
        className={`btn ${
          editor.isActive("heading", { level: 5 }) ? "active" : ""
        }`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
      >
        H5
      </button>
      <button
        type="button"
        className={`btn ${
          editor.isActive("heading", { level: 6 }) ? "active" : ""
        }`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
      >
        H6
      </button>
      <button
        type="button"
        className={`btn ${editor.isActive("bulletList") ? "active" : ""}`}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        Bullet List
      </button>
      <button
        type="button"
        className={`btn ${editor.isActive("orderedList") ? "active" : ""}`}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        Ordered List
      </button>
      <button
        type="button"
        className={`btn ${editor.isActive("quote") ? "active" : ""}`}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        Quote
      </button>
      <button
        type="button"
        className={`btn ${editor.isActive("code") ? "active" : ""}`}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        Code
      </button>
      <button
        type="button"
        className={`btn ${editor.isActive("insertImage") ? "active" : ""}`}
        onClick={insertImage}
      >
        Insert Image
      </button>
      <button
        type="button"
        className={`btn ${editor.isActive("insertLink") ? "active" : ""}`}
        onClick={setLink}
      >
        Insert Link
      </button>
      <button
        type="button"
        className={`btn ${editor.isActive("undo") ? "active" : ""}`}
        onClick={() => editor.chain().focus().undo().run()}
      >
        Undo
      </button>
      <button
        type="button"
        className={`btn ${editor.isActive("redo") ? "active" : ""}`}
        onClick={() => editor.chain().focus().redo().run()}
      >
        Redo
      </button>
    </div>
  );

  return (
    <div className="Gochar">
      <h3 className="text-lg font-semibold mb-2">
        {blogToEdit ? "Edit" : "Add"} Blog
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="frm-input-box">
          <label htmlFor="title">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Title"
            required
          />
        </div>
        <div className="frm-input-box">
          <label htmlFor="description">Description</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter short description"
            required
          />
        </div>
        <div className="frm-input-box">
          <label htmlFor="image">Image</label>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>

        {/* {editor && <MenuBar />}
      <div className="product-description long">
        <EditorContent
          editor={editor}
        />
      </div> */}
        <div className="product-description">
          {editor && <MenuBar />}
          <h5>Content</h5>
          <div className="product-description blog">
            <EditorContent editor={editor} />
          </div>
        </div>

        <button className="product-add-btn" type="submit">{blogToEdit ? "Update" : "Add"} Blog</button>
      </form>
    </div>
  );
};

export default AddItem;

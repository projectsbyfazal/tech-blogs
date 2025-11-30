"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import swal from "sweetalert";

export default function AddBlogPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: any) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("subTitle", form.description);
      fd.append("tags", form.tags);

      if (image) fd.append("file", image);

      const res = await fetch(`/api/blogs`, {
        method: "POST",
        body: fd,
      });

      const result = await res.json();
      console.log(result);

      if (result.success) {
        swal("Blog Published", "This blog has been published", "success").then(
          () => {
            router.push("/"); // redirect after success
          }
        );
      } else {
        swal("", result.error || "Something went wrong", "error");
      }
    } catch (error: any) {
      console.log(error);
      swal("", error.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl "
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Add New Blog</h2>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            name="title"
            placeholder="Blog Title"
            value={form.title}
            onChange={handleChange}
            required
            className="px-4 py-3 text-sm border border-blue-950 border-b-blue-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <textarea
            name="description"
            placeholder="Blog Description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            required
            className="px-4 py-3 text-sm border border-blue-950 border-b-blue-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="px-4 py-3 text-sm border border-blue-950 border-b-blue-400 rounded-xl"
            required
          />

          <input
            type="text"
            name="tags"
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={handleChange}
            required
            className="px-4 py-3 text-sm border border-blue-950 border-b-blue-400 rounded-xl"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-blue-600 cursor-pointer text-white py-3 rounded-xl hover:bg-blue-700 transition-all font-medium"
          >
            {loading ? "Wait! Publishing Blog.." : "Publish Blog"}
          </button>
        </div>
      </form>
    </div>
  );
}

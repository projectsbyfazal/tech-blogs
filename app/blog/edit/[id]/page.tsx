// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function EditBlog({ params }: any) {
//   const router = useRouter();
//   const [blogId] = useState(params.id);

//   const [form, setForm] = useState({
//     title: "",
//     subTitle: "",
//     tags: "",
//     imageUrl: "",
//   });

//   const handleChange = (e: any) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // Update blog
//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     try {
//       const res = await fetch(`/api/blog/edit/${blogId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       const result = await res.json();

//       if (result.success) {
//         swal("Blog Updated", "This blog has been updated", "success").then(
//           () => {
//             router.push("/"); // redirect after success
//           }
//         );
//       } else {
//         swal("", result.error || "Something went wrong", "error");
//       }
//     } catch (error: any) {
//       console.log(error);
//       swal("", error.message || "Something went wrong", "error");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 py-10 flex justify-center">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl"
//       >
//         <h2 className="text-2xl font-bold mb-6 text-center">Edit Blog</h2>

//         <div className="flex flex-col gap-4">
//           <input
//             type="text"
//             name="title"
//             value={form.title}
//             onChange={handleChange}
//             className="px-4 py-3 text-sm border border-blue-900 rounded-xl"
//           />

//           <input
//             type="text"
//             name="subTitle"
//             value={form.subTitle}
//             onChange={handleChange}
//             className="px-4 py-3 text-sm border border-blue-900 rounded-xl"
//           />

//           <input
//             type="text"
//             name="tags"
//             value={form.tags}
//             onChange={handleChange}
//             className="px-4 py-3 text-sm border border-blue-900 rounded-xl"
//           />

//           <button
//             type="submit"
//             className="mt-4 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700"
//           >
//             Save Changes
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import swal from "sweetalert";

export default function EditBlogPage({ params }: any) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
  });

  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [blogId, setBlogId] = useState(null);

  const router = useRouter();
  // Load blog by ID
  useEffect(() => {
    (async () => {
      const { id } = await params;
      setBlogId(id);
      const res = await fetch(`/api/blogs/${id}`);
      const data = await res.json();
      if (data.success) {
        setForm({
          title: data.data.title,
          description: data.data.subTitle,
          tags: data.data.tags,
        });
        setImageUrl(data.data.imageUrl);
      }
    })();
  }, [blogId]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: any) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("subTitle", form.description);
      fd.append("tags", form.tags);

      if (image) fd.append("file", image);

      const res = await fetch(`/api/blogs/${blogId}`, {
        method: "PUT",
        body: fd,
      });

      const result = await res.json();
      console.log(result);

      if (result.success) {
        swal("Blog Updated", "This blog has been updated", "success").then(
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
            required={!imageUrl}
          />
          <span className="text-[10px] text-green-900">{imageUrl}</span>

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
            className="mt-4 bg-blue-600 cursor-pointer text-white py-3 rounded-xl hover:bg-blue-700 transition-all font-medium"
          >
            Publish Blog
          </button>
        </div>
      </form>
    </div>
  );
}

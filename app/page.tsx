import Link from "next/link";
import { BlogPostCard } from "./(components)/BlogPostCard";
import { APP_URL } from "@/lib/config";

interface BlogType {
  __v: number;
  _id: string;
  createdAt: string;
  imageUrl: string;
  slug: string;
  subTitle: string;
  tags: string;
  title: string;
  updatedAt: string;
}

// Blog Listing Page
export default async function BlogListPage() {
  const response = await fetch(`${APP_URL}/api/blogs`, {
    method: "GET",
  });
  const blogs = await response.json();
  return (
    <div className="min-h-screen bg-gray-100 py-10 flex justify-center">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-md md:px-10 px-5 py-10">
        <div className="flex justify-between items-center mb-8 border-b-1 pb-5">
          <h1 className="md:text-3xl text-2xl font-bold mb-0">Tech Blogs</h1>
          <div>
            <Link
              href={"/blog/add"}
              type="submit"
              className="bg-blue-600 text-white py-3 px-10 rounded-xl hover:bg-blue-700 transition-all font-medium"
            >
              Add Blog
            </Link>
          </div>
        </div>
        {blogs?.data?.map((blog: BlogType) => (
          <BlogPostCard key={blog._id} blog={blog} />
        ))}
      </div>
    </div>
  );
}

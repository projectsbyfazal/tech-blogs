import Image from "next/image";
import Link from "next/link";

export const BlogPostCard = ({ blog }: any) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 w-full mx-auto mb-6 border border-gray-200 transition-transform hover:scale-[1.01] hover:shadow-xl">
      <div className="relative w-full md:h-98 rounded-xl overflow-hidden">
        <Image
          src={`${blog.imageUrl}`}
          alt={blog.title}
          width="100"
          height="100"
          className=" w-full h-full bg-blue-100 object-contain"
        />
      </div>

      <h2 className="text-xl font-bold mt-3 text-gray-900">{blog.title}</h2>
      <p className="text-gray-600 mt-1 text-sm w-full">{blog.subTitle}</p>

      <div className="flex gap-2 flex-wrap justify-between items-center ">
        <div className="flex gap-2 flex-wrap mt-3">
          {blog.tags.split(",").map((tag: string) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
        <div className="md:mt-0 mt-4">
          <Link
            href={`/blog/edit/${blog._id}`}
            className="border border-blue-300 text-gray-900 px-4 py-1 rounded-2xl hover:bg-blue-100"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

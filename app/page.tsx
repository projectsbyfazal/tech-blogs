import Link from "next/link";
import { BlogPostCard } from "./(components)/BlogPostCard";
import { NEXT_PUBLIC_APP_URL } from "@/lib/config";
import { auth, signOut } from "@/auth";
import Image from "next/image";

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
  const session = await auth();
  const response = await fetch(`${NEXT_PUBLIC_APP_URL}/api/blogs`, {
    cache: "no-store",
  });
  const blogs = await response.json();
  return (
    <div className="min-h-screen bg-gray-100 py-10 flex justify-center">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-md md:px-10 px-5 py-10">
        {/* <div className="md:flex justify-between items-center mb-8 border-b-1 pb-5">
          <h1 className="md:text-3xl text-2xl font-bold mb-0 text-gray-900">
            Tech Blogs
          </h1>
          <div className="flex items-center">
            <Link
              href={"/blog/add"}
              type="submit"
              className="bg-blue-600 text-white py-3 px-10 rounded-xl hover:bg-blue-700 transition-all font-medium"
            >
              Add Blog
            </Link>

            {session && session?.user ? (
              <div className="md:flex ms-5">
                <div className="flex items-center gap-3">
                  <Image
                    src={session?.user?.image || ""}
                    alt={session?.user?.name || ""}
                    width={40}
                    height={40}
                    className="border rounded-3xl border-gray-900 bg-blue-300"
                  />
                  <span>{session?.user?.name}</span>
                </div>
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <button
                    type="submit"
                    className="bg-red-600 text-white py-3 px-10 rounded-xl hover:bg-red-700 ms-3 transition-all font-medium"
                  >
                    <span >Logout</span>
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href={"/sign-in"}
                type="submit"
                className="bg-green-600 text-white py-3 px-10 rounded-xl hover:bg-green-700 ms-3 transition-all font-medium"
              >
                Sign In
              </Link>
            )}
          </div>
        </div> */}
        <div className="mb-8 border-b pb-5">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
            {/* Left Side — Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Tech Blogs
            </h1>

            {/* Right Side — Actions */}
            <div className="flex flex-col sm:flex-row flex-col-reverse items-center gap-4">
              {/* Add Blog Button */}
              <Link
                href="/blog/add"
                className="bg-blue-600 text-white py-2.5 px-8 rounded-xl 
                 hover:bg-blue-700 transition-all font-medium w-full sm:w-auto text-center"
              >
                Add Blog
              </Link>

              {/* Auth Section */}
              {session && session.user ? (
                <div className="flex items-center gap-4">
                  {/* User Avatar + Name */}
                  <div className="flex items-center gap-3">
                    <Image
                      src={session.user.image || ""}
                      alt={session.user.name || ""}
                      width={40}
                      height={40}
                      className="rounded-full border border-gray-300 object-cover"
                    />
                    <span className="font-medium text-gray-800">
                      {session.user.name}
                    </span>
                  </div>

                  {/* Logout Button */}
                  <form
                    action={async () => {
                      "use server";
                      await signOut({ redirectTo: "/" });
                    }}
                  >
                    <button
                      type="submit"
                      className="bg-red-600 text-white py-2.5 px-6 rounded-xl 
                         hover:bg-red-700 transition-all font-medium"
                    >
                      Logout
                    </button>
                  </form>
                </div>
              ) : (
                <Link
                  href="/sign-in"
                  className="bg-green-600 text-white py-2.5 px-8 rounded-xl 
                     hover:bg-green-700 transition-all font-medium w-full sm:w-auto text-center"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>

        {blogs?.data?.map((blog: BlogType) => (
          <BlogPostCard key={blog._id} blog={blog} />
        ))}
      </div>
    </div>
  );
}

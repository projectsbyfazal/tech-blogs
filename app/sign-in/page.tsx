import { auth, signIn, signOut } from "@/auth";
export default async function BlogListPage() {

  async function handleSignIn() {
    "use server";
    await signIn("github", { redirectTo: "/" });
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 flex justify-center">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-md md:px-10 px-5 py-10 flex items-center justify-center">
        <div className=" pb-5">
          <h1 className="md:text-3xl text-2xl text-center font-bold mb-0 text-gray-900">
            Sign In With ?
          </h1>
          <div className="text-center mt-10 flex h">
            <button
              onClick={handleSignIn}
              className="bg-gray-600 text-white py-3 px-10 rounded-xl hover:bg-gray-700 transition-all font-medium cursor-pointer"
            >
              Github
            </button>

            <button className="bg-green-600 text-white py-3 px-10 rounded-xl hover:bg-green-700 ms-4 transition-all font-medium cursor-pointer">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(req: Request, { params }: any) {
  try {
    await connectDB();

    const { id: blogId } = await params;

    const form = await req.formData();

    const title = form.get("title") as string;
    const subTitle = form.get("subTitle") as string;
    const tags = form.get("tags") as string;
    const file = form.get("file") as File | null;

    const oldBlog = await Blog.findById(blogId);

    if (!oldBlog) {
      return NextResponse.json({ success: false, error: "Blog not found" });
    }

    let imageUrl = oldBlog.imageUrl;

    if (file && typeof file === "object") {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload new image to Cloudinary
      const uploadPromise = new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "tech-blogs" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result!.secure_url);
          }
        );
        stream.end(buffer);
      });

      imageUrl = await uploadPromise;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { title, subTitle, tags, imageUrl },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updatedBlog });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Something went wrong",
    });
  }
}

export async function GET(request: Request, { params }: any) {
    try {
        await connectDB();

        const { id: blogId } = await params;

        const blog = await Blog.findById(blogId);

        if (!blog) {
            return NextResponse.json({ success: false, error: "Blog not found" });
        }

        return NextResponse.json({ success: true, data: blog });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message });
    }
}

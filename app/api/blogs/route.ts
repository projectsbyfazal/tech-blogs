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

export async function POST(req: Request) {
  try {
    await connectDB();

    const form = await req.formData();

    const title = form.get("title") as string;
    const subTitle = form.get("subTitle") as string;
    const tags = form.get("tags") as string;
    const file = form.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "File missing" });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploaded = await cloudinary.uploader.upload_stream(
      { folder: "tech-blogs" },
      (error, result) => {
        if (error) throw error;
        return result;
      }
    );

    // Using upload with stream helper
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

    const imageUrl = await uploadPromise;

    const blog = await Blog.create({
      title,
      subTitle,
      tags,
      imageUrl,
      slug: title.replaceAll(" ", "-").toLowerCase(),
    });

    return NextResponse.json({ success: true, data: blog });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Something went wrong",
    });
  }
}

export async function GET() {
  await connectDB();
  const blogs = await Blog.find().sort({ createdAt: -1 });
  return NextResponse.json({
    success: true,
    data: blogs
  });
}

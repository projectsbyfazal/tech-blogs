import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog"; 
import path from "path";
import fs from "fs";

export async function GET() {
  await connectDB();
  const blogs = await Blog.find().sort({ createdAt: -1 });
  return NextResponse.json({
    success: true,
    data: blogs
  });
}

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

    // Save to /public/uploads
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = Date.now() + "-" + file.name.replace(/\s+/g, "_");
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const imageUrl = "/uploads/" + fileName;

    const blog = await Blog.create({
      title,
      subTitle,
      tags,
      imageUrl,
      slug: title.replaceAll(' ', '-').toLowerCase()
    });

    return NextResponse.json({
      success: true,
      data: blog
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Something went wrong"
    });
  }
}
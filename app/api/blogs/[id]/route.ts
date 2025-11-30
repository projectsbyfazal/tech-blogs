import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import fs from "fs";
import path from "path";

export async function PUT(req: Request, { params }: any) {
    try {
        await connectDB();

        const { id: blogId } = await params;

        const form = await req.formData();

        const title = form.get("title") as string;
        const subTitle = form.get("subTitle") as string;
        const tags = form.get("tags") as string;
        const file = form.get("file") as File | null;


        // Fetch existing blog
        const oldBlog = await Blog.findById(blogId);

        if (!oldBlog) {
            return NextResponse.json({
                success: false,
                error: "Blog not found"
            });
        }

        let imageUrl = oldBlog.imageUrl; // default (keep old)

        // 🚀 If new file uploaded → replace old one
        if (file && typeof file === "object") {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadDir = path.join(process.cwd(), "public/uploads");
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const fileName =
                Date.now() + "-" + file.name.replace(/\s+/g, "_");
            const filePath = path.join(uploadDir, fileName);

            fs.writeFileSync(filePath, buffer);

            // delete old image
            if (oldBlog.imageUrl) {
                const oldPath = path.join("public", oldBlog.imageUrl);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            imageUrl = "/uploads/" + fileName;
        }

        // Update blog in MongoDB
        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            {
                title,
                subTitle,
                tags,
                imageUrl
            },
            { new: true }
        );

        return NextResponse.json({
            success: true,
            data: updatedBlog
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message || "Something went wrong"
        });
    }
}

// 🔹 GET SINGLE BLOG (GET)
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

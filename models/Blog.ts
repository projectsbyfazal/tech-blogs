import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        subTitle: { type: String, required: true },
        tags: { type: String, required: true },
        imageUrl: { type: String, required: true },
        slug: { type: String, required: true }
    },
    { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

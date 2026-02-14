import mongoose, { Schema, Document, Model } from "mongoose";

export interface IConfession extends Document {
    confessionId: string;
    pageId: string;
    message: string;
    theme: "romantic" | "minimal" | "aesthetic";
    createdAt: Date;
}

const ConfessionSchema = new Schema<IConfession>({
    confessionId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    pageId: {
        type: String,
        required: true,
        index: true,
    },
    message: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 500,
    },
    theme: {
        type: String,
        enum: ["romantic", "minimal", "aesthetic"],
        default: "romantic",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Confession: Model<IConfession> =
    mongoose.models.Confession ||
    mongoose.model<IConfession>("Confession", ConfessionSchema);

export default Confession;

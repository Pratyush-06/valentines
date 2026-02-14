import mongoose, { Schema, Document, Model } from "mongoose";

export interface IValentinePage extends Document {
    pageId: string;
    displayName: string;
    secretKey: string;
    createdAt: Date;
}

const ValentinePageSchema = new Schema<IValentinePage>({
    pageId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    displayName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50,
    },
    secretKey: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const ValentinePage: Model<IValentinePage> =
    mongoose.models.ValentinePage ||
    mongoose.model<IValentinePage>("ValentinePage", ValentinePageSchema);

export default ValentinePage;

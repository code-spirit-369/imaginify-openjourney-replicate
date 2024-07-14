import { model, models, Schema } from "mongoose";

interface IImage {
  imageUrl: string;
  prompt: string;
}

const ImageSchema = new Schema<IImage>(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const ImageModel = models.Image || model<IImage>("Image", ImageSchema);

import mongoose, { Document, Model } from "mongoose";

export interface MessageDocument extends Document {
  salutation: string;
  message: string;
  email: string;
  month: string;
  day: string;
  year: string;
}

const MessageSchema = new mongoose.Schema(
  {
    salutation: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    day: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Message: Model<MessageDocument> =
  mongoose.models.Message ||
  mongoose.model<MessageDocument>("Message", MessageSchema);

export default Message;

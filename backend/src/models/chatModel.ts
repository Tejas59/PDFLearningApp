import mongoose from "mongoose";


const chatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModal",
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
    },
}, { timestamps: true });

export const chatModal = mongoose.model("ChatModal", chatSchema);
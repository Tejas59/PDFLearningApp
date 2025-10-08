import mongoose from "mongoose";


const MessageSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            required: true,
            enum: ["user", "assistant", "system"]
        },
        content: {
            type: String,
            required: true,
        }
        ,
        comment: {
            type: String,
        }
    },
    { _id: false }
)

const ConversationSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatModel",
        required: true,
    },
    messages: [MessageSchema]
}, { timestamps: true })

export const conversationModel = mongoose.model("ConversationModel", ConversationSchema)
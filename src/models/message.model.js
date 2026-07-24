import { urlencoded } from "express";
import mongoose, {Schema} from 'mongoose'

const messageSchema = new Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        content: {
            type: String,
            trim: true,
            required: true
        }
    },
    {
        timestamps: true
    }
)
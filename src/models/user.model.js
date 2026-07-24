import mongoose, { Schema } from 'mongoose'
import { urlencoded } from 'express'

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
            minlength: 3,
            maxlength: 20,
            sparse: true //allows many docs to have 'null' username (verified but not entered username yet state)
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase:true
        },
        googleId: {
            type: String,
            required: true,
            unique: true
        },
        avatar: {
            type: String
        }
    },
    {
        timestamps: true
    }
)
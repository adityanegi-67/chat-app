import { OAuth2Client } from "google-auth-library"
import jwt from 'jsonwebtoken'
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/api-error.js"
import { ApiResponse } from "../utils/api-response.js"
import { asyncHandler } from "../utils/async-handler.js"

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const googleLogin = asyncHandler(async (req, res) => {
        const {idToken} = req.body
        if(!idToken){
            throw new ApiError(400, "ID Token from Google is required for verification.")
        }

        //1. Verify the token is from google
        const ticket = await client.verifyIdToken({ //returns obj that lets you access user's info
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        })
        const payLoad = ticket.getPayload() //you use ticket to get info
        if(!payLoad){
            throw new ApiError(401, "Invalid Google ID Token.")
        }
        if(!payLoad.email_verified){
            throw new ApiError(401, "Your Google email not verified.")
        }

        //2. find or create user in my DB
        let user = await User.findOne({googleId: payLoad.sub})
        if(!user){
            user = await User.create({
               googleId: payLoad.sub,
               email: payLoad.email,
               avatar: payLoad.picture
            })
        }

        //3. issue my own app jwt
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '3d'})

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        token,
                        user: {
                            _id: user._id,
                            username: user.username,
                            email: user.email,
                            avatar: user.avatar
                        },
                        needsUsername: !user.username
                    },
                    "Google login successful."
                )
            )
        
})

export {
    googleLogin
}
import jwt from 'jsonwebtoken'
import {User} from '../models/user.model.js'
import {ApiError} from '../utils/api-error.js'
import {asyncHandler} from '../utils/async-handler.js'

const verifyJwt = asyncHandler(async (req, res, next) => {
    try{
        const token = req.header("Authorization")?.replace("Bearer ", "")
        if(!token){
            throw new ApiError(401, "Unauthorized request.")
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        if(!user){
            throw new ApiError(401, "Invalid access token.")
        }
        req.user = user
        next()
    }
    catch(error){
        throw new ApiError(401, "Unauthorized request.")
    }
})

export {verifyJwt}
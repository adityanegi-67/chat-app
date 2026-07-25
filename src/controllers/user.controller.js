import { User } from "../models/user.model.js"
import { ApiError } from "../utils/api-error.js"
import { ApiResponse } from "../utils/api-response.js"
import { asyncHandler } from "../utils/async-handler.js"

const setUsername = asyncHandler(async (req, res) => {
    const {username} = req.body
    const userExists = await User.findOne({ username , _id: {$ne: req.user.id}}) //username: username --> dono same hai toh aise bhi chalega
    if(userExists){
        return res
            .status(409)
            .json(
                new ApiResponse(
                    409,
                    null,
                    "Username already taken. Try another."
                )
            )
    }

    const user = await User.findByIdAndUpdate(
        req.user.id,
        {username: username},
        {new: true}
    )

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "Username set successfully."
            )
        )
})
import {Message} from '../models/message.model.js'
import { asyncHandler } from '../utils/async-handler.js'
import { ApiError } from '../utils/api-error.js'
import { ApiResponse } from '../utils/api-response.js'

const getMessages = asyncHandler(async (req, res) => {
    const {userId} = req.params
    const myId = req.user._id
    
    const messages = await Message.find({
        $or: [
            {sender: myId, receiver: userId},
            {sender: userId, receiver: myId}
        ],
    }).sort({createdAt: 1})

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                messages,
                "Messages fetched successfully."
            )
        )
})

export {
    getMessages
}
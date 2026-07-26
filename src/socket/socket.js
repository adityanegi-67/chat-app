import { Server } from "socket.io"
import jwt from 'jsonwebtoken'
import { User } from "../models/user.model.js"
import {Message} from "../models/message.model.js"

const userSocketMap = {} //{userId : socketId}

const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    })

    io.use(async (socket, next) => {
        try{
            const token = socket.handshake.auth?.token
            if(!token){
                return next(new Error("No token provided."))
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const user = await User.findById(decoded.id)
            if(!user){
                return next(new Error("User no lobger exists."))
            }

            socket.user = user
            next()
        }
        catch(err){
            next (new Error("Authentication failed."))
        }
    })

    io.on('connection', (socket) => {
        console.log("Socket connected : ", socket.id, "user : ", socket.username)
        userSocketMap[socket.user._id] = socket.id

        socket.on("sendMessage", async({receiverId, content}) => {
            try{
                const message = await Message.create({
                    sender: socket.user._id,
                    receiver: receiverId,
                    content
                })

                //always send back to the sender, so their own UI updates
                socket.emit("receiveMessage", message)

                //push to receiver if they are online
                const receiverSocketId = userSocketMap[receiverId]
                if(receiverSocketId){
                    io.to(receiverSocketId).emit("receiveMessage", message)
                }
            }
            catch(err){
                socket.emit("messageError", {message: "Failed to send the message."})
            }
        })

        socket.on('disconnect', () => {
            console.log("Socket disconnected : ", socket.id)
            delete userSocketMap[socket.user._id]
        })
    })

    return io
}

export {
    initSocket,
    userSocketMap
}
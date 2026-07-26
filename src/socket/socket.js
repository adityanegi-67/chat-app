import { Server } from "socket.io"
import jwt from 'jsonwebtoken'
import { User } from "../models/user.model.js"

const userSocketMap = {}

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
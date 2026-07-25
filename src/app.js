import express from 'express'
import cors from 'cors'

const app = express()

app.use(express.json({ //to accept json
    limit: "16kb"
}))

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}))

import authRouter from './routes/auth.routes.js'
import userRouter from './routes/user.routes.js'
import messageRouter from './routes/message.routes.js'

app.use("/api/auth", authRouter)
app.use("/api/users", userRouter)
app.use("/api/messages", messageRouter)

app.get("/", (req, res) => {
    res.send("<h1>Welcome to Chatting App.</h1>")
})

export { app }
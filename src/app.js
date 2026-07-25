import express from 'express'

const app = express()

app.use(express.json({ //to accept json
    limit: "16kb"
}))

import authRouter from './routes/auth.routes.js'
import userRouter from './routes/user.routes.js'

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)

app.get("/", (req, res) => {
    res.send("<h1>Welcome to Chatting App.</h1>")
})

export { app }
import dotenv from  'dotenv'
import connectDB from './config/db.js'
import { app } from './app.js'
import http from 'http'
import { initSocket } from './socket/socket.js'

dotenv.config({
    path: "./.env" //always gets the correct path
}
)

const port = process.env.PORT || 8000

const httpServer = http.createServer(app)
initSocket(httpServer)


connectDB()
    .then(() => {
        httpServer.listen(port, () => {
            console.log(`Listening on port ${port} : http://localhost:${port}`)
        })
    })
    .catch((err) => {
        console.error("MongoDB connection error.", err)
        process.exit(1)
    })
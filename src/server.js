import express from 'express'
import dotenv from  'dotenv'
import connectDB from './config/db.js'

dotenv.config({
    path: "./.env" //always gets the correct path
}
)

const app = express()
const PORT = process.env.PORT || 8000


connectDB()
    .then( () => {
        console.log(`Listening on port ${PORT} : http://localhost:${PORT}`)
    })
    .catch( (err) => {
        console.error("MongoDB connection error. ", err)
        process.exit(1)
    })
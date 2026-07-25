import express from 'express'
import dotenv from  'dotenv'
import connectDB from './config/db.js'
import { app } from './app.js'

dotenv.config({
    path: "./.env" //always gets the correct path
}
)

const port = process.env.PORT || 8000


connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Listening on port ${port} : http://localhost:${port}`)
        })
    })
    .catch((err) => {
        console.error("MongoDB connection error.", err)
        process.exit(1)
    })
import { Router } from "express"
import { getMessages } from "../controllers/message.controller.js"
import {verifyJwt} from '../middlewares/auth.middleware.js'

const router = Router()

router.route("/:userId").get(verifyJwt, getMessages) // :userId is in params (id = req.params.userId)

export default router
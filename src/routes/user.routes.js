import { Router } from 'express'
import { getAllUsers, setUsername } from '../controllers/user.controller.js'
import { verifyJwt } from '../middlewares/auth.middleware.js'

const router = Router()

router.route("/username").patch(verifyJwt, setUsername)
router.route("/").get(verifyJwt, getAllUsers)

export default router
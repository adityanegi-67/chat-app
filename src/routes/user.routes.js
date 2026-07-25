import { Router } from 'express'
import { setUsername } from '../controllers/user.controller.js'
import { verifyJwt } from '../middlewares/auth.middleware.js'

const router = Router()

router.route("/username").patch(verifyJwt, setUsername)

export default router
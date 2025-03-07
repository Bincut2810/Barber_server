import express from "express"
import AccountController from "../controllers/account.controller"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"

const AccountRoute = express.Router()

AccountRoute.post("/register",
  AccountController.register
)
AccountRoute.post("/login",
  AccountController.login
)
AccountRoute.get("/checkAuth",
  AccountController.checkAuth
)
AccountRoute.get("/logout",
  AccountController.logout
)
AccountRoute.post("/changePassword",
  authMiddleware([Roles.ROLE_USER, Roles.ROLE_BARBER]),
  AccountController.changePassword
)
AccountRoute.post("/forgotPassword",
  AccountController.forgotPassword
)

export default AccountRoute

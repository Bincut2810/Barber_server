import express from "express"
import PaymentController from "../controllers/payment.controller"
import authMiddleware from "../middlewares/auth.middleware"
import { Roles } from "../utils/constant"

const PaymentRoute = express.Router()

PaymentRoute.post("/createPayment",
  authMiddleware([Roles.ROLE_USER]),
  PaymentController.createPayment
)
PaymentRoute.get("/getListPayment",
  authMiddleware([Roles.ROLE_ADMIN]),
  PaymentController.getListPayment
)

export default PaymentRoute

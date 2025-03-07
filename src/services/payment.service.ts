import { Request } from "express"
import response from "../utils/response"
import Payment from "../models/payment"
import { CreatePaymentDTO } from "../dtos/payment.dto"
import User from "../models/user"

const fncCreatePayment = async (req: Request) => {
  try {
    await Payment.create(req.body as CreatePaymentDTO)
    return response({}, false, "Thanh toán thành công", 201)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListPayment = async () => {
  try {
    const payments = await Payment
      .find()
      .populate("Customer", ["_id", "FullName"])
    return response(payments, false, "Thanh toán thành công", 201)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const PaymentService = {
  fncCreatePayment,
  fncGetListPayment
}

export default PaymentService

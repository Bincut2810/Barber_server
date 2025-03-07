import { ObjectId } from "mongoose"

export interface CreatePaymentDTO {
  Customer: ObjectId,
  Booking: ObjectId,
  TotalFee: number,
  Description: string,
  Percent: number
}
import { ObjectId } from "mongoose"

export interface CreateBookingDTO {
  Barber: ObjectId,
  Services: {
    ServiceName: string,
    ServicePrice: number,
    ExpensePrice: number,
  }[],
  DateAt: Date,
  TotalPrice: number,
  TotalExpensePrice: number,
}
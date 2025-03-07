import { ObjectId } from "mongoose"

export interface CreateBookingDTO {
  BarberID: ObjectId,
  BarberEmail: string,
  BarberName: string,
  CustomerAddress: string,
  CustomerPhone: string,
  Services: {
    ServiceName: string,
    ServicePrice: number,
    ExpensePrice: number,
    ServiceTime: number
  }[],
  DateAt: Date,
  TotalPrice: number,
  TotalExpensePrice: number,
}

export interface ChangeBookingStatusDTO {
  BookingID: ObjectId,
  BookingStatus: number,
  CustomerName: string,
  CustomerEmail: string,
  BarberName: string,
  BarberEmail: string
}

export interface ChangeBookingPaidStatusDTO {
  BookingID: ObjectId,
  CustomerName: string,
  BarberName: string,
  BarberEmail: string
}
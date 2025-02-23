import { Request } from "express"
import response from "../utils/response"
import Booking from "../models/booking"
import { CreateBookingDTO } from "../dtos/booking.dto"
import { Roles, SuccessMessage } from "../utils/constant"
import User from "../models/user"

const fncCreateBooking = async (req: Request) => {
  try {
    const UserID = req.user.ID
    await Booking.create({
      ...req.body as CreateBookingDTO,
      Customer: UserID
    })
    return response({}, false, "Bạn đã booking thành công. Chờ phản hồi từ barber", 201)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListMyBooking = async (req: Request) => {
  try {
    const { ID, RoleID } = req.user
    const bookings = await Booking
      .find({
        [
          RoleID === Roles.ROLE_BARBER
            ? "Barber"
            : "Customer"
        ]: ID
      })
      .populate("Customer", ["_id", "FullName"])
      .populate("Barber", ["_id", "FullName"])
    return response(bookings, false, SuccessMessage.GET_DATA_SUCCESS, 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const BookingService = {
  fncCreateBooking,
  fncGetListMyBooking
}

export default BookingService

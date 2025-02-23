import { Request, Response } from "express"
import BookingService from "../services/booking.service"

const createBooking = async (req: Request, res: Response) => {
  try {
    const response = await BookingService.fncCreateBooking(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const getListMyBooking = async (req: Request, res: Response) => {
  try {
    const response = await BookingService.fncGetListMyBooking(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const BookingController = {
  createBooking,
  getListMyBooking
}

export default BookingController

import { Application } from "express"
import AccountRoute from "./account.route"
import CommonRoute from "./common.route"
import UserRoute from "./user.route"
import FileRoute from "./file.route"
import BookingRoute from "./booking.route"

const routes = (app: Application) => {
  app.use("/account", AccountRoute)
  app.use("/common", CommonRoute)
  app.use("/user", UserRoute)
  app.use("/file", FileRoute)
  app.use("/booking", BookingRoute)
}

export default routes

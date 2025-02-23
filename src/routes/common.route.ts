import express from "express"
import CommonController from "../controllers/common.controller"

const CommonRoute = express.Router()

CommonRoute.get("/getListSystemkey",
  CommonController.getListSystemKey
)
CommonRoute.post("/createSystemKey",
  CommonController.createSystemKey
)
CommonRoute.post("/insertParentKey",
  CommonController.insertParentKey
)

export default CommonRoute

import { Request, Response } from "express"
import CommonService from "../services/common.service"

const getListSystemKey = async (req: Request, res: Response) => {
  try {
    const response = await CommonService.fncGetListSystemKey()
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const createSystemKey = async (req: Request, res: Response) => {
  try {
    const response = await CommonService.fncCreateSystemKey(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const insertParentKey = async (req: Request, res: Response) => {
  try {
    const response = await CommonService.fncInsertParentKey(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const getListTabs = async (req: Request, res: Response) => {
  try {
    const response = await CommonService.fncGetListTabs(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const CommonController = {
  getListSystemKey,
  createSystemKey,
  insertParentKey,
  getListTabs,
}

export default CommonController

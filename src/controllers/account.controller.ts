import { Request, Response } from "express"
import AccountService from "../services/account.service"

const register = async (req: Request, res: Response) => {
  try {
    const response = await AccountService.fncRegister(req, res)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const checkAuth = async (req: Request, res: Response) => {
  try {
    const response = await AccountService.fncCheckAuth(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}


const login = async (req: Request, res: Response) => {
  try {
    const response = await AccountService.fncLogin(req, res)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const logout = async (req: Request, res: Response) => {
  res.clearCookie("token")
  res.status(200).json({ data: {}, isError: false, msg: "Đăng xuất thành công" })
}

const changePassword = async (req: Request, res: Response) => {
  try {
    const response = await AccountService.fncChangePassword(req)
    res.status(response.statusCode).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const response = await AccountService.fncForgotPassword(req)
    res.status(!!response ? response.statusCode : 200).json(response)
  } catch (error: any) {
    res.status(500).json(error.toString())
  }
}

const AccountController = {
  register,
  login,
  checkAuth,
  logout,
  changePassword,
  forgotPassword
}

export default AccountController

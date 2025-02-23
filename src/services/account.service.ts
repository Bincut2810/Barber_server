import { Request, Response } from "express"
import Account from "../models/account"
import User from "../models/user"
import { ErrorMessage, Roles } from "../utils/constant"
import { getOneDocument } from "../utils/queryFunction"
import response from "../utils/response"
import {
  LoginDTO,
  RegisterDTO
} from "../dtos/account.dto"
import { signAccessToken } from "../utils/tokenUtils"
import bcrypt from "bcrypt"

const saltRounds = 10

const fncRegister = async (req: Request, res: Response) => {
  try {
    const { Email, RoleID, Password } = req.body as RegisterDTO
    const checkExist = await getOneDocument(Account, "Email", Email)
    if (!!checkExist) return response({}, true, ErrorMessage.EMAIL_EXIST, 200)
    const user = await User.create({
      ...req.body,
      RegisterStatus: RoleID === Roles.ROLE_USER ? 3 : 1,
      IsFirstLogin: RoleID === Roles.ROLE_USER ? false : true
    })
    const hashPassword = bcrypt.hashSync(Password, saltRounds)
    await Account.create({
      UserID: user._id,
      Email,
      RoleID: RoleID,
      Password: hashPassword
    })
    return response({}, false, "Đăng ký tài khoản thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncCheckAuth = async (req: Request) => {
  try {
    return response(
      !!req.cookies.token ? req.cookies.token : false,
      false,
      `${!!req.cookies.token ? "Có token" : "Không có token"}`,
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncLogin = async (req: Request, res: Response) => {
  try {
    const { Password, Email } = req.body as LoginDTO
    const getAccount = await getOneDocument(Account, "Email", Email)
    if (!getAccount) return response({}, true, ErrorMessage.EMAIL_NOT_EXIST, 200)
    if (!getAccount.IsActive) return response({}, true, ErrorMessage.ACCOUNT_INACTIVE, 200)
    const check = bcrypt.compareSync(Password, getAccount.Password)
    if (!check) return response({}, true, ErrorMessage.PASSWORD_INCORRECT, 200)
    const token = signAccessToken({
      ID: getAccount.UserID,
      RoleID: getAccount.RoleID,
    })
    res.cookie("token", token, {
      httpOnly: true, // cookie chỉ được truy cập bới server
      secure: true, // cookie chỉ được sử dụng với https
      sameSite: "none",
      maxAge: 6 * 60 * 60 * 1000 // 8h
    })
    return response(token, false, "Login thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

// const fncChangePassword = async (req: Request) => {
//   try {
//     const UserID = req.user.ID
//     const { OldPassword, NewPassword } = req.body as ChangePasswordDTO
//     const account = await getOneDocument(Account, "UserID", UserID)
//     if (!account) return response({}, true, "Có lỗi xảy ra", 200)
//     const check = bcrypt.compareSync(OldPassword, account.Password)
//     if (!check) return response({}, true, ErrorMessage.PASSWORD_INCORRECT, 200)
//     const hashPassword = bcrypt.hashSync(NewPassword, saltRounds)
//     await Account.updateOne({ UserID: UserID }, { Password: hashPassword })
//     return response({}, false, "Cập nhật mật khẩu thành công", 200)
//   } catch (error: any) {
//     return response({}, true, error.toString(), 500)
//   }
// }

// const fncForgotPassword = async (req: Request) => {
//   try {
//     const { Email, Step, Password } = req.body as { Email: string, Step: number, Password: string }
//     if (Step === 0) {
//       const getAccount = await getOneDocument(Account, "Email", Email)
//       if (!getAccount) return response({}, true, ErrorMessage.EMAIL_NOT_EXIST, 200)
//       return response({ Email }, false, "Kiểm tra email thành công", 200)
//     }
//     if (Step === 2) {
//       const hashPassword = bcrypt.hashSync(Password, saltRounds)
//       await Account.updateOne(
//         { Email },
//         { Password: hashPassword },
//         { new: true }
//       )
//       return response({}, false, "Mật khẩu đã được cập nhật", 200)
//     }
//   } catch (error: any) {
//     return response({}, true, error.toString(), 500)
//   }
// }

const AccountService = {
  fncRegister,
  fncLogin,
  fncCheckAuth,
  // fncChangePassword,
  // fncForgotPassword
}

export default AccountService

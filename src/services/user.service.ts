import { Request } from "express"
import { ErrorMessage, Roles, SuccessMessage } from "../utils/constant"
import User from "../models/user"
import response from "../utils/response"
import {
  GetListUserDTO,
  ChangeProfileDTO,
  ResponseRequestRegisterDTO,
  UpdateSchedulesDTO,
  UpdateServiceDTO
} from "../dtos/user.dto"
import mongoose from "mongoose"

const fncGetDetailProfile = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const user = await User.findOne({ _id: UserID })
    if (!user) return response({}, true, ErrorMessage.HAVE_AN_ERROR, 200)
    return response(user, false, SuccessMessage.GET_DATA_SUCCESS, 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncChangeProfile = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const user = await User
      .findOneAndUpdate(
        { _id: UserID },
        {
          ...req.body as ChangeProfileDTO,
          IsFirstLogin: false
        },
        { new: true }
      )
    if (!user) return response({}, true, ErrorMessage.HAVE_AN_ERROR, 200)
    return response(user, false, "Bạn đã cập nhật thông tin thành công. Hãy bổ sung về dịch vụ và thời gian làm việc để quản trị viên duyệt!", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListUser = async (req: Request) => {
  try {
    const { TextSearch, PageSize, CurrentPage, RoleID, RegisterStatus, IsActive } = req.body as GetListUserDTO
    let query = {
      FullName: { $regex: TextSearch, $options: "i" },
      RoleID: {
        $ne: Roles.ROLE_ADMIN
      }
    } as any
    if (!!RoleID) {
      query.RoleID = RoleID
    }
    if (!!RegisterStatus) {
      query.RegisterStatus = RegisterStatus
    }
    if (IsActive === true || IsActive === false) {
      query.IsActive = IsActive
    }
    const users = User.aggregate([
      {
        $lookup: {
          from: "accounts",
          localField: "_id",
          foreignField: "UserID",
          as: "Account"
        }
      },
      { $unwind: '$Account' },
      {
        $addFields: {
          IsActive: "$Account.IsActive",
          Email: "$Account.Email"
        }
      },
      {
        $match: query
      },
      {
        $project: {
          Account: 0
        }
      },
      { $skip: (CurrentPage - 1) * PageSize },
      { $limit: PageSize }
    ])
    const total = User.countDocuments(query)
    const result = await Promise.all([users, total])
    const data = result[0].map((i: any) => ({
      ...i,
      IsConfirm: i.RegisterStatus === 2 || !i.IsActive ? false : true,
      IsReject: i.RegisterStatus === 2 || !i.IsActive ? false : true,
    }))
    return response(
      { List: data, Total: result[1] },
      false,
      SuccessMessage.GET_DATA_SUCCESS,
      200
    )
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncRequestConfirmRegister = async (req: Request) => {
  try {
    const UserID = req.user.ID
    const user = await User.findOneAndUpdate({ _id: UserID }, { RegisterStatus: 2 }, { new: true })
    if (!user) return response({}, true, ErrorMessage.HAVE_AN_ERROR, 200)
    return response(user, false, "Yêu cầu của bạn đã được gửi. Hệ thống sẽ phản hồi yêu cầu của bạn trong 48h!", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncResponseRequestRegister = async (req: Request) => {
  try {
    const { UserID, RegisterStatus } = req.body as ResponseRequestRegisterDTO
    const updateUser = await User.findOneAndUpdate(
      { _id: UserID },
      { RegisterStatus }
    )
    if (!updateUser) return response({}, true, ErrorMessage.HAVE_AN_ERROR, 200)
    return response({}, false, "Duyệt tài khoản thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncUpdateSchedule = async (req: Request) => {
  try {
    const { ID } = req.user
    const { Schedules } = req.body as UpdateSchedulesDTO
    const updateUser = await User
      .findOneAndUpdate(
        { _id: ID },
        { Schedules: Schedules },
        { new: true }
      )
      .lean()
    if (!updateUser) return response({}, true, ErrorMessage.HAVE_AN_ERROR, 200)
    return response(updateUser, false, "Chỉnh sửa lịch thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncUpdateService = async (req: Request) => {
  try {
    const { ID } = req.user
    const { Services } = req.body as UpdateServiceDTO
    const updateUser = await User
      .findOneAndUpdate(
        { _id: ID },
        { Services: Services },
        { new: true }
      )
      .lean()
    if (!updateUser) return response({}, true, ErrorMessage.HAVE_AN_ERROR, 200)
    return response(updateUser, false, "Chỉnh sửa dịch vụ thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListBarber = async (req: Request) => {
  try {
    const barbers = await User.aggregate([
      {
        $match: {
          RoleID: Roles.ROLE_BARBER,
          RegisterStatus: 3
        }
      },
      // {
      //   $unwind: {
      //     path: "$Stars",
      //     preserveNullAndEmptyArrays: true
      //   }
      // },
      // {
      //   $group: {
      //     _id: "$_id",
      //     TotalVotes: { $sum: "$Stars" },
      //     Votes: { $push: "$Votes" },
      //   }
      // },
      {
        $project: {
          _id: 1,
          FullName: 1,
          Gender: 1,
          AvatarPath: 1,
          Stars: 1,
          TotalStars: { $sum: "$Stars" },
          Address: 1
        }
      },
      {
        $sort: { TotalStars: -1 }
      }
    ])
    return response(barbers, false, SuccessMessage.GET_DATA_SUCCESS, 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

export const fncGetDetailBarber = async (req: Request) => {
  try {
    const { BarberID } = req.params
    if (!mongoose.Types.ObjectId.isValid(`${BarberID}`)) {
      return response({}, true, "ID barber không tồn tại", 200)
    }
    const barber = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(`${BarberID}`)
        }
      },
      {
        $project: {
          _id: 1,
          FullName: 1,
          Address: 1,
          Phone: 1,
          DateOfBirth: 1,
          Gender: 1,
          Certificates: 1,
          Experiences: 1,
          Services: 1,
          Schedules: 1,
          AvatarPath: 1,
          Stars: 1,
          TotalStars: { $sum: "$Stars" },
        }
      },
    ])
    if (!barber[0]) return response({}, true, ErrorMessage.HAVE_AN_ERROR, 200)
    return response(barber[0], false, SuccessMessage.GET_DATA_SUCCESS, 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const UserService = {
  fncGetDetailProfile,
  fncChangeProfile,
  fncGetListUser,
  fncRequestConfirmRegister,
  fncResponseRequestRegister,
  fncUpdateSchedule,
  fncUpdateService,
  fncGetListBarber,
  fncGetDetailBarber,
}

export default UserService

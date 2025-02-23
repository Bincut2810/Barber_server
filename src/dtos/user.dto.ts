import { ObjectId } from "mongoose"
import { CommonDTO } from "./common.dto"

export interface ChangeProfileDTO {
  Address: string,
  Phone: string,
  DateOfBirth: Date,
  Gender: number,
  Experiences: string,
  Certificates: string[],
  AvatarPath: string
}

export interface GetListUserDTO extends CommonDTO {
  RoleID: number,
  RegisterStatus: number,
  IsActive: boolean
}

export interface ResponseRequestRegisterDTO {
  UserID: ObjectId,
  RegisterStatus: number
}

export interface UpdateSchedulesDTO {
  Schedules: {
    DateAt: string,
    StartTime: Date,
    EndTime: Date
  }[]
}

export interface UpdateServiceDTO {
  Services: {
    ServiceName: string,
    ServicePrice: number,
    ExpensePrice: number
  }[]
}

export interface GetListBarberDTO extends CommonDTO {

}
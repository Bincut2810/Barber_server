export interface RegisterDTO {
  Email: string,
  RoleID: number,
  FullName: string,
  Password: string
}

export interface LoginDTO {
  Email: string,
  Password: string
}

export interface ChangePasswordDTO {
  OldPassword: string,
  NewPassword: string
}

export interface ForgotPasswordDTO {
  Email: string,
  Step: number,
  Password: string
}
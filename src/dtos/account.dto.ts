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
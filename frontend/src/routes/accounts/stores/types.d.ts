interface ILoginRequest {
  username: string
  password: string
}

interface ILoginResponse {
  email: string
  first_name: string
  last_name: string
  date_joined: string
  admin: boolean
  permissions: string[]
}

interface IUser extends ILoginResponse {
  authenticated: boolean
}

interface IRegisterRequest {
  email: string
  first_name: string
  last_name: string
  password: string
  captcha: string
}

interface IRegisterData extends IRegisterRequest {
  confirmPassword: string
}

interface IProfileRequest {
  email: string
  first_name: string
  last_name: string
  old_password?: string
  password?: string
}

interface IProfileData extends IProfileRequest {
  confirmPassword: string
  changePassword: boolean
}

interface IResetPasswordStep1Request {
  captcha: string
  email: string
}

interface IResetPasswordStep2Request {
  token: string
  password: string
}

interface IResetPasswordStep2Data extends IResetPasswordStep2Request {
  confirmPassword: string
}

interface IPasswordValidation {
  password?: string
  confirmPassword?: string
}


interface IUserStore extends IChildStore<IRootStore> {
  loginForm: ILoginFormStore
  registerForm: IRegisterFormStore
  profileForm: IProfileFormStore
  resetPasswordStep1Form: IResetPasswordStep1Store
  resetPasswordStep2Form: IResetPasswordStep2Store
  user: IUser

  hasPermision(...perm: string[]): boolean
  login(data: ILoginRequest): Promise<void>
  register(data: IRegisterRequest): Promise<void>
  updateProfile(data: IProfileRequest): Promise<void>
  resetPasswordStep1(data: IResetPasswordStep1Request): Promise<void>
  resetPasswordStep2(data: IResetPasswordStep2Request): Promise<void>
  logout(): Promise<void>
  validatePassword(password: string): boolean
}

interface IRegisterFormStore extends IFormStore<IUserStore, IRegisterData> {
  captchaId?: number
  validation: IPasswordValidation
  validatePassword(): void
}

interface IProfileFormStore extends IFormStore<IUserStore, IProfileData> {
  validation: IPasswordValidation
  validatePassword(): void
}

interface IResetPasswordStep1Store extends IFormStore<IUserStore, IResetPasswordStep1Request> {
  captchaId?: number
}

interface IResetPasswordStep2Store extends IFormStore<IUserStore, IResetPasswordStep2Data> {
  validation: IPasswordValidation
  validatePassword(): void
}

type ILoginFormStore = IFormStore<IUserStore, ILoginRequest>

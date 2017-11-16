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

interface IPasswordValidation {
  password?: string
  confirmPassword?: string
}


interface IUserStore extends IChildStore<IRootStore> {
  loginForm: ILoginFormStore
  registerForm: IRegisterFormStore
  profileForm: IProfileFormStore
  user: IUser

  hasPermision(...perm: string[]): boolean
  login(data: ILoginRequest): Promise<void>
  register(data: IRegisterRequest): Promise<void>
  updateProfile(data: IProfileRequest): Promise<void>
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

type ILoginFormStore = IFormStore<IUserStore, ILoginRequest>

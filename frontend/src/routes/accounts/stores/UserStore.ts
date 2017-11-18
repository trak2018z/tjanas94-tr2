import ChildStore from "stores/ChildStore"
import LoginFormStore from "./LoginFormStore"
import RegisterFormStore from "./RegisterFormStore"
import ProfileFormStore from "./ProfileFormStore"
import ResetPasswordStep1Store from "./ResetPasswordStep1Store"
import ResetPasswordStep2Store from "./ResetPasswordStep2Store"
import { toJS, action, observable } from "mobx"
import request from "utils/request"
import history from "utils/history"
import ErrorHandler from "utils/ErrorHandler"

export default class UserStore extends ChildStore<IRootStore>
  implements IUserStore {
  public loginForm: ILoginFormStore = new LoginFormStore(this.rootStore, this)
  public registerForm: IRegisterFormStore = new RegisterFormStore(
    this.rootStore,
    this
  )
  public profileForm: IProfileFormStore = new ProfileFormStore(
    this.rootStore,
    this
  )
  public resetPasswordStep1Form: IResetPasswordStep1Store = new ResetPasswordStep1Store(
    this.rootStore,
    this
  )
  public resetPasswordStep2Form: IResetPasswordStep2Store = new ResetPasswordStep2Store(
    this.rootStore,
    this
  )
  @observable public user: IUser

  constructor(rootStore: IRootStore, parentStore: IRootStore) {
    super(rootStore, parentStore)
    this.loadUser()
  }

  public hasPermision(...perm: string[]) {
    return this.user.admin || perm.some(p => this.user.permissions.includes(p))
  }

  public login = async (data: ILoginRequest) => {
    try {
      const response = await request.post("accounts/login", data)
      this.setUser(this.getLoggedUser(response.data.user))
      this.cacheUser()
    } catch (err) {
      ErrorHandler.formError(err)
    }
  }

  public register = async (data: IRegisterRequest) => {
    try {
      await request.post("accounts/register", data)
    } catch (err) {
      ErrorHandler.formError(err)
    }
  }

  public updateProfile = async (data: IProfileRequest) => {
    try {
      const response = await request.post("accounts/profile/edit", data)
      this.setUser(this.getLoggedUser(response.data.user))
      this.cacheUser()
    } catch (err) {
      ErrorHandler.formError(err)
    }
  }

  public resetPasswordStep1 = async (data: IResetPasswordStep1Request) => {
    try {
      await request.post("accounts/reset_password_step1", data)
    } catch (err) {
      ErrorHandler.formError(err)
    }
  }

  public resetPasswordStep2 = async (data: IResetPasswordStep2Request) => {
    try {
      await request.post("accounts/reset_password_step2", data)
    } catch (err) {
      ErrorHandler.formError(err)
    }
  }

  public logout = async () => {
    try {
      this.setUser(this.getDefaultUser())
      this.cacheUser()
      this.rootStore.clear()
      this.rootStore.messageStore.showMessage("Wylogowano pomyślnie")
      history.push("/")
      await request.post("accounts/logout")
    } catch (err) {
      ErrorHandler.globalError(err, true)
    }
  }

  public clear() {
    this.clearChildStores()
  }

  public validatePassword(password: string) {
    const rules = [
      /(?=[0-9]+)/,
      /(?=[A-Z]+)/,
      /(?=[a-z]+)/,
      /(?=[^a-zA-Z0-9]+)/,
      /(?=.{8,})/,
    ]
    return rules.every(r => r.test(password))
  }

  private async fetchUserProfile() {
    try {
      const response = await request.get("accounts/profile")
      if (response.data.user) {
        if (this.user.authenticated) {
          return this.setUser(this.getLoggedUser(response.data.user))
        }
        await request.post("accounts/logout")
      }

      return this.setUser(this.getDefaultUser())
    } catch (err) {
      ErrorHandler.globalError(err, true)
    }
  }

  private cacheUser() {
    localStorage.setItem("user", JSON.stringify(toJS(this.user)))
  }

  private async loadUser() {
    const cached = localStorage.getItem("user")
    this.setUser(cached ? JSON.parse(cached) : this.getDefaultUser())
    await this.fetchUserProfile()
    this.cacheUser()
  }

  private getDefaultUser() {
    return {
      email: "",
      first_name: "",
      last_name: "",
      date_joined: "",
      admin: false,
      permissions: [],
      authenticated: false,
    }
  }

  private getLoggedUser(userData: ILoginResponse) {
    return {
      ...userData,
      authenticated: true,
    }
  }

  @action.bound
  private setUser(user: IUser) {
    this.user = user
  }
}

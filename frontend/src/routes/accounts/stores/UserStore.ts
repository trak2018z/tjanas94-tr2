import ChildStore from "stores/ChildStore"
import LoginFormStore from "./LoginFormStore"
import RegisterFormStore from "./RegisterFormStore"
import ProfileFormStore from "./ProfileFormStore"
import { toJS, action, observable } from "mobx"
import request from "utils/request"
import logger from "utils/logger"
import history from "utils/history"

export default class UserStore extends ChildStore<IRootStore>
  implements IUserStore {
  public loginForm: ILoginFormStore = new LoginFormStore(this.rootStore, this)
  public registerForm: IRegisterFormStore = new RegisterFormStore(this.rootStore, this)
  public profileForm: IProfileFormStore = new ProfileFormStore(this.rootStore, this)
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
      if (err.response && err.response.data.detail) {
        throw new Error(err.response.data.detail)
      }
      logger.error(err)
      throw new Error("Napotkano błąd. Spróbuj ponownie.")
    }
  }

  public register = async (data: IRegisterRequest) => {
    try {
      await request.post("accounts/register", data)
    } catch (err) {
      if (err.response && err.response.data.detail) {
        throw new Error(err.response.data.detail)
      }
      logger.error(err)
      throw new Error('Napotkano błąd. Spróbuj ponownie.')
    }
  }

  public updateProfile = async (data: IProfileRequest) => {
    try {
      const response = await request.post("accounts/profile/edit", data)
      this.setUser(this.getLoggedUser(response.data.user))
      this.cacheUser()
    } catch (err) {
      if (err.response && err.response.data.detail) {
        throw new Error(err.response.data.detail)
      }
      logger.error(err)
      throw new Error("Napotkano błąd. Spróbuj ponownie.")
    }
  }

  public logout = async () => {
    try {
      await request.post("accounts/logout")
      this.rootStore.clear()
      history.push("/")
      this.rootStore.messageStore.showMessage("Wylogowano pomyślnie")
    } catch (err) {
      logger.error(err)
    }
  }

  public clear() {
    this.setUser(this.getDefaultUser())
    this.cacheUser()
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
        this.setUser(this.getLoggedUser(response.data.user))
      } else {
        this.setUser(this.getDefaultUser())
      }
    } catch (err) {
      logger.error(err)
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

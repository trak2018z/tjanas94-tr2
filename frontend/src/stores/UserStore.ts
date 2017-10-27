import ChildStore from "stores/ChildStore"
import LoginForm from "stores/LoginForm"
import { toJS, action, observable } from "mobx"
import request from "utils/request"
import logger from "utils/logger"

export default class UserStore extends ChildStore<IRootStore>
  implements IUserStore {
  public loginForm: ILoginForm
  @observable public user: IUser

  constructor(rootStore: IRootStore, parentStore: IRootStore) {
    super(rootStore, parentStore)
    this.loginForm = new LoginForm(this.rootStore, this)
    this.loadUser()
  }

  public hasPermision(perm: string | string[]) {
    if (perm instanceof Array) {
      return perm.some(p => this.user.permissions.includes(p))
    }
    return this.user.permissions.includes(perm)
  }

  public async login(data: ILoginRequest) {
    try {
      const response = await request.post("accounts/login", data)
      this.setUser(this.getLoggedUser(response!.data.user))
      this.cacheUser()
    } catch (err) {
      if (err.response.status === 401) {
        throw new Error(err.response.data.detail)
      }
      logger.error(err)
    }
  }

  public async logout() {
    try {
      this.setUser(this.getDefaultUser())
      this.cacheUser()
      await request.post("accounts/logout")
    } catch (err) {
      logger.error(err)
    }
  }

  private async fetchUserProfile() {
    try {
      const response = await request.get("accounts/profile")
      this.setUser(this.getLoggedUser(response!.data.user))
    } catch (err) {
      if (err.response.status === 401) {
        this.setUser(this.getDefaultUser())
      } else {
        logger.error(err)
      }
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
      firstname: "",
      lastname: "",
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

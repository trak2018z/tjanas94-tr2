import React, { Component } from "react"
import { Link } from "react-router-dom"
import { observer, inject } from "mobx-react"
import Notification from "components/Notification"
import config from "config"

interface ILoginProps {
  loginForm?: ILoginForm
}

@inject("loginForm")
@observer
export default class Login extends Component<ILoginProps, {}> {
  public componentDidMount() {
    this.props.loginForm!.clear()
  }

  public render() {
    const loginForm = this.props.loginForm!
    return (
      <div className="box">
        <form action="#" onSubmit={loginForm.submit}>
          <div className="is-size-3 has-text-grey-darker has-text-centered">
            Logowanie
          </div>
          <hr />
          <Notification message={loginForm.error} />
          <div className="field">
            <label className="label">Email</label>
            <div className="control has-icons-left">
              <input
                className="input"
                type="email"
                required={true}
                value={loginForm.data.username}
                onChange={loginForm.updateField("username")}
              />
              <span className="icon is-small is-left">
                <i className="fa fa-envelope" />
              </span>
            </div>
          </div>
          <div className="field">
            <label className="label">Hasło</label>
            <div className="control has-icons-left">
              <input
                className="input"
                type="password"
                required={true}
                value={loginForm.data.password}
                onChange={loginForm.updateField("password")}
              />
              <span className="icon is-small is-left">
                <i className="fa fa-lock" />
              </span>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button
                className="button is-info is-fullwidth is-size-4"
                disabled={loginForm.pending}
              >
                Zaloguj się
              </button>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <Link to="/register" className="button is-link">
                Zarejestruj się
              </Link>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <Link to="/password-reset" className="button is-link">
                Zapomniałeś hasła?
              </Link>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <a
                href={`mailto:${config.adminEmail}`}
                className="button is-link"
              >
                Napotkałeś na problem? Skontaktuj się z administratorem.
              </a>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

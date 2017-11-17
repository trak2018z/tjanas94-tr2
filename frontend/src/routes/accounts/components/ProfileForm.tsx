import React, { Component } from "react"
import { Link } from "react-router-dom"
import { observer, inject } from "mobx-react"
import Notification from "components/Notification"

interface IProfileProps {
  profileForm?: IProfileFormStore
}

@inject("profileForm")
@observer
export default class ProfileForm extends Component<IProfileProps, {}> {
  public componentDidMount() {
    this.props.profileForm!.clear()
  }

  public render() {
    const profileForm = this.props.profileForm!
    return (
      <div className="box">
        <form action="#" onSubmit={profileForm.submit}>
          <Notification message={profileForm.error} />
          <div className="field">
            <label className="label">Email</label>
            <div className="control has-icons-left">
              <input
                className="input"
                type="email"
                required={true}
                value={profileForm.data.email}
                onChange={profileForm.updateField("email")}
              />
              <span className="icon is-small is-left">
                <i className="fa fa-envelope" />
              </span>
            </div>
          </div>
          <div className="field">
            <label className="label">Imię</label>
            <div className="control">
              <input
                className="input"
                type="text"
                required={true}
                value={profileForm.data.first_name}
                onChange={profileForm.updateField("first_name")}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Nazwisko</label>
            <div className="control">
              <input
                className="input"
                type="text"
                required={true}
                value={profileForm.data.last_name}
                onChange={profileForm.updateField("last_name")}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Obecne hasło</label>
            <div className="control has-icons-left">
              <input
                className="input"
                type="password"
                required={true}
                value={profileForm.data.old_password}
                onChange={profileForm.updateField("old_password")}
              />
              <span className="icon is-small is-left">
                <i className="fa fa-lock" />
              </span>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={profileForm.data.changePassword}
                  onChange={profileForm.updateField("changePassword")}
                />&nbsp; Zmiana hasła
              </label>
            </div>
          </div>
          {profileForm.data.changePassword && (
            <div className="field">
              <label className="label">Nowe hasło</label>
              <div className="control has-icons-left">
                <input
                  className={`input ${profileForm.validation.password &&
                    "is-danger"}`}
                  type="password"
                  required={true}
                  value={profileForm.data.password}
                  onBlur={profileForm.validatePassword}
                  onChange={profileForm.updateField("password")}
                />
                <span className="icon is-small is-left">
                  <i className="fa fa-lock" />
                </span>
              </div>
              {profileForm.validation.password && (
                <p className="help is-danger">
                  {profileForm.validation.password}
                </p>
              )}
            </div>
          )}
          {profileForm.data.changePassword && (
            <div className="field">
              <label className="label">Powtórz hasło</label>
              <div className="control has-icons-left">
                <input
                  className={`input ${profileForm.validation.confirmPassword &&
                    "is-danger"}`}
                  type="password"
                  required={true}
                  value={profileForm.data.confirmPassword}
                  onBlur={profileForm.validatePassword}
                  onChange={profileForm.updateField("confirmPassword")}
                />
                <span className="icon is-small is-left">
                  <i className="fa fa-lock" />
                </span>
              </div>
              {profileForm.validation.confirmPassword && (
                <p className="help is-danger">
                  {profileForm.validation.confirmPassword}
                </p>
              )}
            </div>
          )}
          <div className="field is-grouped is-grouped-multiline">
            <div className="control">
              <button className="button is-link" disabled={profileForm.pending}>
                Zapisz
              </button>
            </div>
            <div className="control">
              <Link className="button" to="/profile">
                Anuluj
              </Link>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

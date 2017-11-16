import React from "react"
import { Link } from "react-router-dom"
import { observer, inject } from "mobx-react"
import moment from "moment"

interface IProfileViewProps {
  userStore?: IUserStore
}

const ProfileView = ({ userStore }: IProfileViewProps) => (
  <div className="box">
    <div className="field">
      <label className="label">Email</label>
      <div className="control">{userStore!.user.email}</div>
    </div>
    <div className="field">
      <label className="label">Imię</label>
      <div className="control">{userStore!.user.first_name}</div>
    </div>
    <div className="field">
      <label className="label">Nazwisko</label>
      <div className="control">{userStore!.user.last_name}</div>
    </div>
    <div className="field">
      <label className="label">Data rejestracji</label>
      <div className="control">{moment(userStore!.user.date_joined).format('YYYY-MM-DD')}</div>
    </div>
    <div className="field">
      <div className="control">
        <Link className="button is-link" to="/profile/edit">
          Edytuj
        </Link>
      </div>
    </div>
  </div>
)

export default inject("userStore")(observer(ProfileView))

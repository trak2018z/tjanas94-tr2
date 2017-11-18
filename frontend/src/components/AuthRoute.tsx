import React from "react"
import { Route, Redirect, RouteProps } from "react-router-dom"
import { observer, inject } from "mobx-react"

interface IAuthRouteProps extends RouteProps {
  userStore?: IUserStore
  permissions?: string[]
  redirect?: string
}

const AuthWrapper = (
  Component: any,
  userStore: IUserStore,
  redirect = "/",
  permissions?: string[]
) => (props: any) => {
  if (permissions) {
    if (userStore!.hasPermision(...permissions)) {
      return <Component {...props} />
    }
  } else if (userStore!.user.authenticated) {
    return <Component {...props} />
  }
  return <Redirect to={redirect} />
}

const AuthRoute = inject("userStore")(
  observer(
    ({
      component,
      userStore,
      redirect,
      permissions,
      ...props,
    }: IAuthRouteProps) => (
      <Route
        render={AuthWrapper(component, userStore!, redirect, permissions)}
        {...props}
      />
    )
  )
)

export default AuthRoute

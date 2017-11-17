import React from "react"
import { Route, Redirect, RouteProps } from "react-router-dom"
import { observer, inject } from "mobx-react"

interface IAuthRouteProps extends RouteProps {
  permissions?: string[]
  redirect?: string
}

interface IAuthWrapperProps {
  userStore?: IUserStore
}

const AuthWrapper = (Component: any, redirect = "/", permissions?: string[]) =>
  inject("userStore")(
    observer(({ userStore, ...props }: IAuthWrapperProps) => {
      if (permissions) {
        if (userStore!.hasPermision(...permissions)) {
          return <Component {...props} />
        }
      } else if (userStore!.user.authenticated) {
        return <Component {...props} />
      }
      return <Redirect to={redirect} />
    })
  )

const AuthRoute = observer(
  ({ component, redirect, permissions, ...props }: IAuthRouteProps) => (
    <Route
      component={AuthWrapper(component, redirect, permissions)}
      {...props}
    />
  )
)

export default AuthRoute

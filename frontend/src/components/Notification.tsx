import React from "react"
import { observer } from "mobx-react"

interface INotificationProps {
  message: IMessage
}

const Notification = ({ message }: INotificationProps) => {
  if (message.visible) {
    return (
      <article className="message is-danger">
        <div className="message-body">{message.message}</div>
      </article>
    )
  }

  return null
}

export default observer(Notification)

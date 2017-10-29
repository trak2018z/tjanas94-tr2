import React from "react"
import { observer, inject } from "mobx-react"

interface IGlobalNotificationProps {
  messageStore?: IMessageStore
}

const GlobalNotification = ({ messageStore }: IGlobalNotificationProps) => {
  if (messageStore!.message.visible) {
    return (
      <div className="container">
        <div className="columns">
          <div className="column is-6 is-offset-3">
            <article
              className="message is-dark"
              onClick={messageStore!.hideMessage}
            >
              <div className="message-body">
                {messageStore!.message.message}
              </div>
            </article>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default inject("messageStore")(observer(GlobalNotification))

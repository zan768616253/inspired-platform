import React from 'react'

import FileInput from './FileInput'
import ChatStore from "../../store/ChatStore";
import UserStore from "../../store/UserStore";
import UIStore from '../../store/UIStore'

export default class CreateMessageForm extends React.Component {

    sendMessage(message) {
        const roomId = ChatStore.groupId;

        const d = {
            user_name: UserStore.obj.name,
            message: message,
            roomId: roomId,
            picture: UserStore.obj.picture,
            avatar: UserStore.obj.avatar,
            sendTo: ChatStore.groupname
        }

        socket.emit("send message", d);
    }

    runCommand(message) {
    }

    handleShowFavouriteListButtonOnClick () {
        UIStore.showInvites = false
        UIStore.showParticipants = false
        UIStore.showFavourite = !UIStore.showFavourite
    }

    render () {
        return (
            <form
                className='create-message-form'
                onSubmit={e => {
                    e.preventDefault()
                    const message = e.target[0].value
                    e.target[0].value = ''
                    message.startsWith('/')
                        ? runCommand(message.slice(1))
                        : message.length > 0 &&
                        this.sendMessage(message)
                }}>

                <input
                    placeholder="Type a Message.."
                    ref="messageInput"
                />
                <button className='favourite-message' onClick={() => this.handleShowFavouriteListButtonOnClick()}>
                    <img src='favourite-message.svg' />
                </button>
                <FileInput />
                <button type="submit">
                    <svg>
                        <use xlinkHref="index.svg#send" />
                    </svg>
                </button>
            </form>
        )
    }
}
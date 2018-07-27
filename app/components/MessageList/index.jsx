import React from 'react'
import {observer} from "mobx-react/index";

import Message from './Message'
import ChatStore from "../../store/ChatStore";
import UserStore from "../../store/ChatStore";


const emptyList = (
    <div className='empty'>
    <span role="img" aria-label="post">
      📝
    </span>
        <h2>No Messages Yet</h2>
        <p>Be the first to post in this room or invite someone to join the room</p>
    </div>
)

@observer
export default class MessageList extends React.Component {

    render() {
        let items = [], read, unread
        if (ChatStore.msgs[ChatStore.groupId]) {
            read = ChatStore.msgs[ChatStore.groupId].read
            unread = ChatStore.msgs[ChatStore.groupId].unread
            items = read.concat(unread)
            ChatStore.msgs[ChatStore.groupId].unread = []
        }

        const updateTime = ChatStore.updateTime
        const messages = items
        const user = (UserStore && UserStore.obj) ? UserStore.obj.user_id : ''
        const createConvo = this.props.createConvo

        return (
            <ul id="messages" className='message-list'>
                {messages.length > 0 ? (
                    <wrapper->
                        {messages.reverse().map(message => {
                            return (
                                <Message message={message} />
                            )
                        })}
                    </wrapper->
                ) : (
                    emptyList
                )}
            </ul>
        )
    }
}
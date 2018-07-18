import React from 'react'
import { Message } from './Message'
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

export default class MessageList extends React.Component {

    componentDidMount() {
        const d = {
            roomId: ChatStore.groupId
        };
        socket.emit("retrieve msgs", d);

        socket.on("chat msgs", data => {
            ChatStore.msgs = data[0].conversation;
        })
    }

    render() {
        const messages = ChatStore.msgs
        const user = (UserStore && UserStore.obj) ? UserStore.obj.user_id : ''
        const createConvo = this.props.createConvo

        return (
            <ul id="messages" className='message-list'>
                {Object.keys(messages).length > 0 ? (
                    <wrapper->
                        {Object.keys(messages)
                            .reverse()
                            .map(k => Message({user, createConvo})(messages[k]))}
                    </wrapper->
                ) : (
                    emptyList
                )}
            </ul>
        )
    }
}
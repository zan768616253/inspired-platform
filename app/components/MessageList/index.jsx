import React from 'react'
import {observer} from "mobx-react/index";
import _ from 'lodash'

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

    componentDidMount() {
        const d = {
            roomId: ChatStore.groupId
        };
        socket.emit("retrieve msgs", d);

        socket.on("chat msgs", data => {
            ChatStore.msgs = data[0].conversation;
        })

        socket.on("chat message", function(messages) {
            const result = _.find(ChatStore.msgs, msg => {
                return msg.roomId = messages.roomId
            })

            if (messages.roomId === ChatStore.groupId) {
                if (result) {
                    console.log(ChatStore.msgs)
                    const index = ChatStore.msgs.indexOf(result)
                    ChatStore.msgs[index].read.push(msg)
                } else {
                    ChatStore.msgs[messages.roomId] = {
                        read:[msg],
                        unread:[]
                    }
                }
            } else {
                if (result) {
                    ChatStore.msgs[messages.roomId].unread.push(msg)
                } else {
                    ChatStore.msgs[messages.roomId] = {
                        read:[],
                        unread:[msg]
                    }
                }
            }

        });
    }

    render() {
        let read = []
        if (ChatStore.msgs[ChatStore.groupId]) {
            read = ChatStore.msgs[ChatStore.groupId].read.push(...ChatStore.msgs[ChatStore.groupId].unread)
            ChatStore.msgs[ChatStore.groupId].unread = []
        }

        const messages = read
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
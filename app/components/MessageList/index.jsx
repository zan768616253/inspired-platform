import React from 'react'
import {observer} from "mobx-react/index";
import _ from 'lodash'
import moment from 'moment'

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
            const result = _.find(ChatStore.msgs, msg => {
                return msg.roomId = ChatStore.groupId
            })

            if (result) {
                ChatStore.msgs[ChatStore.groupId].read = data.conversation
            } else {
                ChatStore.msgs[ChatStore.groupId] = {
                    read: data.conversation,
                    unread: []
                }
            }

            ChatStore.updateTime = moment()
        })

        socket.on("chat message", function(message) {
            const result = ChatStore.msgs[message.roomId]

            if (message.roomId === ChatStore.groupId) {

                if (result) {
                    ChatStore.msgs[ChatStore.groupId].read.push(message)
                } else {
                    ChatStore.msgs[ChatStore.groupId] = {
                        read:[message],
                        unread:[]
                    }
                }
            } else {
                if (result) {
                    ChatStore.msgs[message.roomId].unread.push(message)
                } else {
                    ChatStore.msgs[message.roomId] = {
                        read:[],
                        unread:[message]
                    }
                }
            }

            ChatStore.updateTime = moment()
        });
    }

    render() {
        let items = [], read, unread
        if (ChatStore.msgs[ChatStore.groupId]) {
            read = ChatStore.msgs[ChatStore.groupId].read
            unread = ChatStore.msgs[ChatStore.groupId].unread
            items = read.concat(unread)
            ChatStore.msgs[ChatStore.groupId].unread = []
            console.log(ChatStore.msgs[ChatStore.groupId])
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
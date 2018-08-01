import React from "react";
import {observer} from "mobx-react/index"

import UserHeader from '../../components/UserHeader/userHeader'
import RoomList from '../../components/RoomList/roomList'
import CreateRoomForm from '../../components/CreateRoomForm'
import Roomheader from '../../components/RoomHeader'
import MessageList from "../../components/MessageList";
import CreateMessageForm from '../../components/CreateMessageForm'
import ExistingUserList from '../../components/UserList/ExistingUserList'
import InvitingUserList from '../../components/UserList/InvitingUserList'
import FavouriteList from "../../components/FavouriteList";

import UserStore from '../../store/UserStore'
import ChatStore from "../../store/ChatStore"
import UIStore from '../../store/UIStore'
import moment from "moment/moment";
import _ from "lodash";

@observer
export default class MainContainer extends React.Component {

    componentDidMount() {
        socket.on("returning participants", data => {
            ChatStore.remainparticipants = data.remainparticipants;
            ChatStore.participants = data.participants;
        });
        socket.on("returning message group", data => {
            const result = ChatStore.msgs[ChatStore.groupId]

            if (result) {
                ChatStore.msgs[ChatStore.groupId].read = data.conversation || []
            } else {
                ChatStore.msgs[ChatStore.groupId] = {
                    read: data.msg,
                    unread: []
                }
            }
        })
        socket.on("returning message group for target", data => {
            if (data.user_id) {
                UserStore.obj.rooms = data.rooms
            }
        })
        socket.on("refresh group list", data => {
            UserStore.obj.rooms = data.rooms
        })
        socket.on("msgs", function(data) {
            const groupId = ChatStore.groupId

            if (ChatStore.msgs[groupId]) {
                ChatStore.msgs[ChatStore.groupId].read = data.conversation
            } else {
                ChatStore.msgs[ChatStore.groupId] = {
                    read: data.conversation,
                    unread: []
                }
            }
            ChatStore.updateTime = moment()
        });
        socket.on("chat msgs", data => {
            const result = _.find(ChatStore.msgs, msg => {
                return msg.roomId = ChatStore.groupId
            })

            if (result) {
                ChatStore.msgs[ChatStore.groupId].read = data.conversation || []
            } else {
                ChatStore.msgs[ChatStore.groupId] = {
                    read: data.conversation || [],
                    unread: []
                }
            }

            ChatStore.updateTime = moment()
        })

        socket.on("chat message", message => {
            const result = ChatStore.msgs[message.roomId]

            console.log(ChatStore.groupId)
            console.log(message.roomId)

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
        })

        socket.on('favourite messages', data => {
            ChatStore.favourites = data.reverse()
        })
    }

    render() {
        const role = UserStore.obj.role
        const isOwner = role === 1

        const userList = ChatStore.participants ? ChatStore.participants : []
        const user_id = UserStore.obj.user_id
        const participant = _.find(userList, _.matchesProperty('user_id', user_id))
        const groupRole = participant ? participant.role : 99

        return (
            <main>
                <aside data-open={UIStore.sidebarOpen}>
                    <UserHeader />
                    <RoomList />
                    {isOwner && <CreateRoomForm />}
                </aside>
                <section>
                    <Roomheader role = {groupRole}/>
                    {ChatStore.groupId && <row->
                        <col->
                            <MessageList createConvo={this.createConvo}/>
                            <CreateMessageForm />
                        </col->
                        {UIStore.showParticipants && <ExistingUserList role = {groupRole} />}
                        {UIStore.showInvites && <InvitingUserList />}
                        {UIStore.showFavourite && <FavouriteList />}
                    </row->
                    }
                </section>
            </main>
        )
    }
}

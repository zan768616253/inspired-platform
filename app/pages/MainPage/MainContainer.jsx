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

import UserStore from '../../store/UserStore'
import ChatStore from "../../store/ChatStore"
import UIStore from '../../store/UIstore'
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
        });
        // socket.on("dbnotes", function(data) {
        //     ChatStore.notes = data.notes;
        // });
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
        })
    }

    createConvo(options) {
    }

    render() {


        return (
            <main>
                <aside data-open={UIStore.sidebarOpen}>
                    <UserHeader />
                    <RoomList />
                    <CreateRoomForm />
                </aside>
                <section>
                    <Roomheader />
                    {ChatStore.groupId && <row->
                        <col->
                            <MessageList createConvo={this.createConvo}/>
                            <CreateMessageForm />
                        </col->
                        {UIStore.showParticipants && <ExistingUserList createConvo={this.createConvo} />}
                        {UIStore.showInvites && <InvitingUserList createConvo={this.createConvo} />}
                    </row->
                    }
                </section>
            </main>
        )
    }
}

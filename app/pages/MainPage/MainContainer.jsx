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
                ChatStore.msgs[ChatStore.groupId].read = data.conversation
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
        socket.on("dbnotes", function(data) {
            ChatStore.notes = data.notes;
        });
    }

    createConvo(options) {
        // if (options.user.id !== this.state.user.id) {
        //     const exists = this.state.user.rooms.find(
        //         x =>
        //             x.name === options.user.id + this.state.user.id ||
        //             x.name === this.state.user.id + options.user.id
        //     )
        //     exists
        //         ? this.actions.joinRoom(exists)
        //         : this.actions.createRoom({
        //             name: this.state.user.id + options.user.id,
        //             addUserIds: [options.user.id],
        //             private: true,
        //         })
        // }
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

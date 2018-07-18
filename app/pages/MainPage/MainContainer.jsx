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


@observer
export default class MainContainer extends React.Component {

    createConvo(options) {
        if (options.user.id !== this.state.user.id) {
            const exists = this.state.user.rooms.find(
                x =>
                    x.name === options.user.id + this.state.user.id ||
                    x.name === this.state.user.id + options.user.id
            )
            exists
                ? this.actions.joinRoom(exists)
                : this.actions.createRoom({
                    name: this.state.user.id + options.user.id,
                    addUserIds: [options.user.id],
                    private: true,
                })
        }
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

import React from 'react'
import {observer} from "mobx-react/index";
import moment from 'moment'

import UserStore from "../../store/UserStore.js";
import ChatStore from "../../store/ChatStore.js";
import FriendshipStore from "../../store/FriendshipsStore";

const Icon = () => (
    <svg>
        <use xlinkHref={`index.svg#public`} />
    </svg>
)

@observer
export default class RoomList extends React.Component {

    constructor(props) {
        super(props);
        this.handleRoomOnClick = this.handleRoomOnClick.bind(this);
    }

    componentDidMount() {
        this.getNotification()
    }

    getNotification(user_id) {
        $.ajax({
            type: "GET",
            url: "/api/notification"
        })
        .done(function(data) {
            // ChatStore.initialNotification = data
            data.forEach(notification => {
                const roomId = notification.roomId
                ChatStore.msgs[roomId] = {}
                ChatStore.msgs[roomId].read = notification.read
                ChatStore.msgs[roomId].unread = notification.unread

                ChatStore.updateTime = moment()
            })


        })
        .fail(function(jqXhr) {
        })
    }

    handleRoomOnClick = (Users) => {
        if (ChatStore.groupId !== Users.roomId) {

            if (ChatStore.groupId.trim()) {
                this.leaveCurrentRoomSession()
            }

            const roomId = ChatStore.groupId = Users.roomId;
            ChatStore.groupname = Users.roomName;
            ChatStore.groupavatar = Users.pic;
            ChatStore.totalmsgscount = Users.total_count;
            ChatStore.totalnotescount = Users.total_notes_count;

            socket.emit("Join room", ChatStore.groupname)
            socket.emit("note map", roomId)

            socket.on('recieving listchat rooms', (data) => {
                ChatStore.participants = data.participants;
                ChatStore.remainparticipants = data.remainparticipants;
                const remain = ChatStore.remainparticipants;
                const mappedlength = FriendshipStore.mappedFriends.length;

                remain.forEach(function(a) {
                    for (let i = 0; i < mappedlength; i++) {
                        if (a.user_id === FriendshipStore.mappedFriends[i].user_id) {
                            FriendshipStore.mappedFriends[i].present = true;
                        }
                    }
                });

                ChatStore.readcount = Object.keys(data.conversation).length;
                ChatStore.notescount = Object.keys(data.notes).length;
                ChatStore.admin_id = data.admin_id;
                ChatStore.created_on = data.created_on;
            })
        }
    }

    leaveCurrentRoomSession = () => {
        const user_id = UserStore.obj.user_id
        const room_id = ChatStore.groupId
        const d = {
            user_id: user_id,
            room_id: room_id
        }
        socket.emit("Leave room session", d);
    }

    render() {
        const updateTime = ChatStore.updateTime
        let rooms = UserStore.obj && UserStore.obj.rooms && UserStore.obj.rooms.length ? UserStore.obj.rooms : []

        return (
            <ul className='room-list'>
                {rooms.map(room => {
                    const unread_number = ChatStore.msgs[room.roomId] ? ChatStore.msgs[room.roomId].unread.length : 0
                    return (
                        <li
                            key={room.roomId}
                            disabled={room.roomId === ChatStore.groupId}
                            onClick={() => this.handleRoomOnClick(room)}
                        >
                            {Icon()}
                            <col->
                                <p>{room.roomName}</p>
                                <span>{'this is the last message'}</span>
                            </col->
                            {room.roomId !== ChatStore.groupId ? (
                                <label>{unread_number ? unread_number : ''}</label>
                            ) : null}
                        </li>
                    )
                })}
            </ul>
        )
    }
}
import React from 'react'
import {observer} from "mobx-react/index";
import moment from 'moment'

import UserStore from "../../store/UserStore.js";
import ChatStore from "../../store/ChatStore.js";
import FriendshipStore from "../../store/FriendshipsStore";
import _ from "lodash";

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
        this.state = {
            data: [],
            openDelete: false
        };
    }

    componentDidMount() {

    }

    handleRoomOnClick = (Users) => {
        if (ChatStore.groupId !== Users.roomId) {

            if (ChatStore.groupId.trim()) {
                this.leaveCurrentRoomSession()
            }

            ChatStore.btnClick = true;
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

                socket.emit("read sync", UserStore.obj.user_id);

                socket.on("sync success", function(data) {
                    UserStore.obj.rooms = data[0].rooms;
                });

                remain.forEach(function(a) {
                    for (let i = 0; i < mappedlength; i++) {
                        if (a.user_id == FriendshipStore.mappedFriends[i].user_id) {
                            FriendshipStore.mappedFriends[i].present = true;
                        }
                    }
                });

                ChatStore.readcount = Object.keys(data.conversation).length;
                ChatStore.notescount = Object.keys(data.notes).length;
                ChatStore.admin_id = data.admin_id;
                ChatStore.created_on = data.created_on;

                const d = {
                    user_id: UserStore.obj.user_id,
                    _id: Users._id,
                    count: ChatStore.readcount.toString(),
                    notescount: ChatStore.notescount.toString()
                };

                socket.emit("readcountmsg", d);
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
        let rooms = UserStore.obj && UserStore.obj.rooms && UserStore.obj.rooms.length ? UserStore.obj.rooms : []

        return (
            <ul className='room-list'>
                {rooms.map(Users => {
                    return (
                        <li
                            key={Users._id}
                            disabled={Users._id === ChatStore.groupId}
                            onClick={e => this.handleRoomOnClick(Users)}
                        >
                            {Icon()}
                            <col->
                                <p>{Users.roomName}</p>
                                <span>{'this is the last message'}</span>
                            </col->
                            {Users._id !== ChatStore.groupId ? (
                                <label>99</label>
                            ) : null}
                        </li>
                    )
                })}
            </ul>
        )
    }
}
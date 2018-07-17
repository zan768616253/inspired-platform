import React from 'react'
import {observer} from "mobx-react/index";

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
        this.state = {
            data: [],
            openDelete: false
        };
    }

    componentDidMount() {
        socket.on("msgs", function(data) {
            ChatStore.msgs = data.msg;
        });
        socket.on("dbnotes", function(data) {
            ChatStore.notes = data.dbnotes;
        });
        socket.on('refresh group list', data => {
            UserStore.obj.rooms = data.rooms
            console.log(UserStore.obj.rooms)
        })
    }

    handleRoomOnClick = (Users) => {
        ChatStore.btnClick = true;
        const roomId = ChatStore.groupId = Users.roomId;
        ChatStore.groupname = Users.roomName;
        ChatStore.groupavatar = Users.pic;
        ChatStore.totalmsgscount = Users.total_count;
        ChatStore.totalnotescount = Users.total_notes_count;

        socket.emit("Join room", ChatStore.groupname)
        socket.emit("note map", roomId)

        socket.on('recieving listchat rooms', (data) => {
            ChatStore.participants = data[0].participants;
            ChatStore.remainparticipants = data[0].remainparticipants;
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

            ChatStore.readcount = Object.keys(data[0].conversation).length;
            ChatStore.notescount = Object.keys(data[0].notes).length;
            ChatStore.admin_id = data[0].admin_id;
            ChatStore.created_on = data[0].created_on;

            const d = {
                user_id: UserStore.obj.user_id,
                _id: Users._id,
                count: ChatStore.readcount.toString(),
                notescount: ChatStore.notescount.toString()
            };

            socket.emit("readcountmsg", d);
        })
    }

    handleLeaveRoomSession = (Users) => {
        this.setState({
            openDelete: true
        });
        const data = {
            user_id: UserStore.obj.user_id,
            roomId: Users._id
        };
        ChatStore.leaveinfo = data;
        ChatStore.leavegroupname = Users.roomName;
    }

    handleLeaveRoom = () => {
        const data = ChatStore.leaveinfo;
        socket.emit("room leave", ChatStore.leaveinfo);
        socket.on("remaininggroups", function(data) {
            UserStore.obj.rooms = data[0].rooms;
        });
        const d = new Date(); // for now
        d.getHours(); // => 9
        d.getMinutes(); // =>  30
        d.getSeconds(); // => 51
        //console.log(d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds());
        const time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        const today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1; //January is 0!
        let yyyy = today.getFullYear();

        dd = dd < 10 ? "0" + dd : dd;
        mm = mm < 10 ? "0" + mm : mm;

        const date = mm + "/" + dd + "/" + yyyy;

        socket.emit("manipulate group", {
            from: UserStore.userrealname,
            message: "HAS LEFT THE GROUP",
            date: date,
            time: time,
            roomId: ChatStore.groupId,
            user_name: UserStore.userrealname,
            user_id: UserStore.obj.user_id
        })

        this.setState({
            openDelete: false
        })
    }

    handleDeleteClose = () => {
        this.setState({ openDelete: false });
    };

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
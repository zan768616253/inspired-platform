import React from 'react'
import {observer} from "mobx-react/index";

import ChatStore from "../../store/ChatStore.js";
import UserStore from "../../store/UserStore";


@observer
export default class InvitingUserList extends React.Component {

    componentDidMount() {
        socket.on('find users', users => {
            ChatStore.findUsers = users
            console.log(ChatStore.findUsers)
        })
    }

    handleSearchInputKeypress(e) {
        if (e.key === 'Enter') {
            const email = this.refs.queryInput.value.trim()
            socket.emit('search users', email)
        }
    }

    handleAddButtOnClick(user) {
        var data = {
            user_id: user.user_id,
            name: user.name,
            picture: user.picture,
            avatar: user.avatar,
            roomId: ChatStore.groupId,
            roomName: ChatStore.groupname,
            pic: ChatStore.groupavatar, //GROUP PIC
            notes_count: ChatStore.totalmsgscount,
            msgs_count: ChatStore.totalnotescount,
            from: UserStore.userrealname,
            message: "HAS BEEN ADDED TO THE GROUP"
        }

        socket.emit("add User to Group", data)
    }

    render() {
        const userList = ChatStore.findUsers

        return (
            <ul className='user-list'>
                <li className='search-bar'>
                    <input
                        placeholder="search for..."
                        ref='queryInput'
                        onKeyPress={e => {this.handleSearchInputKeypress(e)}}
                    />

                </li>
                {userList.map(user => {
                    console.log(ChatStore.participants)
                    const isInGroup = !!ChatStore.participants.find(participant => participant.user_id === user.user_id)
                    return (
                        <li
                            key={user.user_id}
                            className={user.state === 'online' ? 'online' : null}
                            onClick={() => this.props.createConvo({ user })}
                            style={{ order: user.state === 'online' && -1 }}
                        >
                            <img src={user.picture} alt={user.name} />
                            <p>{user.name}</p>

                            {!isInGroup && <a onClick={() => {
                                    this.handleAddButtOnClick(user)
                                }}>
                                    <i className="fa fa-plus-square" aria-hidden="true" />
                                </a>
                            }
                        </li>
                    )}
                )}
            </ul>
        )
    }
}
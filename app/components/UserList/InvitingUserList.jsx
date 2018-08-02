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

    goSearch() {
        const email = this.refs.queryInput.value.trim()
        if (email) {
            socket.emit('search users', email)
        }
    }

    handleSearchInputKeypress(e) {
        if (e.key === 'Enter') {
            this.goSearch()
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
                    <span onClick={() => this.goSearch()}>
                        <i className="fa fa-search" aria-hidden="true"></i>
                    </span>
                </li>
                {userList.map(user => {
                    const isInGroup = !!ChatStore.participants.find(participant => participant.user_id === user.user_id)
                    const avatar = user.avatar ? '/api/user/avatar/' + user.avatar : user.picture
                    return (
                        <li
                            key={user.user_id}
                            className={user.state === 'online' ? 'online' : null}
                            style={{ order: user.state === 'online' && -1 }}
                        >
                            <img src={avatar} />
                            <p>{user.name}</p>

                            <a className='assign'>
                                <i className="fa fa-id-card" aria-hidden="true" />
                            </a>
                            {!isInGroup && <a className='delete' onClick={() => {
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
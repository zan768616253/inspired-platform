import React from 'react'
import {observer} from "mobx-react/index";

import ChatStore from "../../store/ChatStore.js";


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

    render() {
        const userList = ChatStore.findUsers

        return (
            <ul className='user-list'>
                <li className='search-bar'>
                    <input
                        placeholder="search for..."
                        ref='queryInput'
                        onKeyPress={e => {this.handleSearchInputKeypress(e)}}
                        value='768616253@qq.com'
                    />

                </li>
                {userList.map(user => {
                    return (
                        <li
                            key={user.user_id}
                            className={user.state === 'online' ? 'online' : null}
                            onClick={e => this.props.createConvo({ user })}
                            style={{ order: user.state === 'online' && -1 }}
                        >
                            <img src={user.picture} alt={user.name} />
                            <p>{user.name}</p>
                            <a >
                                <i className="fa fa-plus-square" aria-hidden="true"></i>
                            </a>
                        </li>
                    )}
                )}
            </ul>
        )
    }
}
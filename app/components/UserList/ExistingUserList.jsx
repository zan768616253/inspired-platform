import React from 'react'

import ChatStore from "../../store/ChatStore.js";

export default class ExistingUserList extends React.Component {

    render() {
        const userList = ChatStore.participants ? ChatStore.participants : []

        return (
            <ul className='user-list'>
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
                                <i className="fa fa-minus-square" aria-hidden="true"></i>
                            </a>
                        </li>
                    )}
                )}
            </ul>
        )
    }
}
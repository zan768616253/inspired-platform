import React from 'react'
import {observer} from "mobx-react/index";

import ChatStore from "../../store/ChatStore.js";
import UserStore from "../../store/UserStore";


@observer
export default class ExistingUserList extends React.Component {

    handleRemoveButtOnClick(user) {
        const data = {
            user_id: user.user_id,
            roomId: ChatStore.groupId,
            message: "HAS BEEN REMOVED FROM THE GROUP",
            from: user.name,
            picture: user.picture
        }
        socket.emit("remove User from Group", data);
    }

    render() {
        const userList = ChatStore.participants ? ChatStore.participants : []

        return (
            <ul className='user-list'>
                {userList.map(user => {
                    const isAdmin = user.user_id === UserStore.obj.user_id
                    const avatar = user.avatar ? '/api/user/avatar/' + user.avatar : user.picture
                    return (
                        <li
                            key={user.user_id}
                            className={user.state === 'online' ? 'online' : null}
                            onClick={e => this.props.createConvo({ user })}
                            style={{ order: user.state === 'online' && -1 }}
                        >
                            <img src={avatar} />
                            <p>{user.name}</p>
                            <a onClick={() => {
                                this.handleRemoveButtOnClick(user)
                            }}>
                                <i className="fa fa-minus-square" aria-hidden="true" />
                            </a>
                        </li>
                    )}
                )}
            </ul>
        )
    }
}
import React from 'react'
import {observer} from "mobx-react/index";

import ChatStore from "../../store/ChatStore.js";

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

    handleAssignButtOnClick(user) {
        const role = user.role === 2 ? 3 : 2
        const data = {
            user_id: user.user_id,
            roomId: ChatStore.groupId,
            role: role
        }
        socket.emit('assign administrator', data)
    }

    render() {
        const userList = ChatStore.participants ? ChatStore.participants : []
        // const user_id = UserStore.obj.user_id
        // const participant = _.find(userList, _.matchesProperty('user_id', user_id))
        // const role = participant.role

        const role = this.props.role
        return (
            <ul className='user-list'>
                {userList.map(user => {
                    const showRemove = (user.role !== 1) && (role < (user.role || 3))
                    const showAssign = (role < 3) && (role < (user.role || 3))
                    const avatar = user.avatar ? '/api/user/avatar/' + user.avatar : user.picture
                    const adminClass = user.role < 3 ? 'admin' : ''
                    return (
                        <li
                            key={user.user_id}
                            className={user.state === 'online' ? 'online' : null}
                            style={{ order: user.state === 'online' && -1 }}
                        >
                            <img src={avatar} />
                            <p>{user.name}</p>
                            {showAssign && <a className={'assign ' + adminClass} onClick={() => {
                                this.handleAssignButtOnClick(user)
                            }}>
                                <i className="fa fa-user-circle" aria-hidden="true" />
                            </a>}
                            {showRemove && <a className='delete' onClick={() => {
                                this.handleRemoveButtOnClick(user)
                            }}>
                                <i className="fa fa-minus-square" aria-hidden="true" />
                            </a>}
                        </li>
                    )}
                )}
            </ul>
        )
    }
}
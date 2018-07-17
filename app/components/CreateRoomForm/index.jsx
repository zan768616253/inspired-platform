import React from 'react'
import UserStore from "../../store/UserStore";

let mapping = [];

export default class CreateRoomForm extends React.Component {

    constructor(props) {
        super(props);
    }

    handleCreateButtonOnClick = () => {
        const ownerInfo = {
            name: UserStore.userrealname,
            picture: UserStore.obj.avatar ? '/api/user/avatar/' + UserStore.obj.avatar : UserStore.obj.picture,
            user_id: UserStore.obj.user_id
        }

        mapping.push(ownerInfo);

        const groupName = this.refs.groupname.value

        const today = new Date()
        const yyyy = today.getFullYear()
        let dd = today.getDate()
        let mm = today.getMonth() + 1; //January is 0!

        dd = dd < 10 ? "0" + dd : dd;
        mm = mm < 10 ? "0" + mm : mm;

        const date = dd + "-" + mm + "-" + yyyy
        const d = {
            id: UserStore.obj.user_id,
            groupname: groupName,
            avatarletter: 'E',
            mapping: JSON.stringify(mapping),
            created_on: date
        }
        this.refs.groupname.value = ''
        socket.emit("create group event", d)
    }

    render () {
        return (
            <form className='create-room-form'
                onSubmit={e => {
                    e.preventDefault()
                    this.handleCreateButtonOnClick()
                }}>
                <input placeholder="Create a Room" ref="groupname"/>
                <button>
                    <input type="checkbox" />
                    <svg>
                        <use xlinkHref="index.svg#lock" />
                    </svg>
                </button>
                <button type="submit">
                    <svg>
                        <use xlinkHref="index.svg#add" />
                    </svg>
                </button>
            </form>
        )
    }
}
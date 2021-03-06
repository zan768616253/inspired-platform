import React from 'react'
import UserStore from "../../store/UserStore";



export default class CreateRoomForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            create_room: true
        }
    }

    componentDidMount() {
        socket.on('group exist', () => {
            this.setState({
                create_room: false
            })
        })
    }

    handleCreateButtonOnClick = () => {

        const groupName = this.refs.groupname.value.trim()

        if (groupName) {
            const ownerInfo = {
                name: UserStore.userrealname,
                picture: UserStore.obj.avatar ? '/api/user/avatar/' + UserStore.obj.avatar : UserStore.obj.picture,
                user_id: UserStore.obj.user_id,
                role: 1
            }

            let mapping = [ownerInfo];

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
    }

    render () {
        const svgClassName = this.state.create_room ? '' : 'fail'
        return (
            <form className='create-room-form'
                onSubmit={e => {
                    e.preventDefault()
                    this.handleCreateButtonOnClick()
                }}>
                <input placeholder="Create a Room" ref="groupname" onClick={e => {
                    if (e.key === 'Enter') {
                        return null
                    }
                    this.setState({
                        create_room: true
                    })
                }}/>
                {/*<button>*/}
                    {/*<input type="checkbox" />*/}
                    {/*<svg>*/}
                        {/*<use xlinkHref="index.svg#lock" />*/}
                    {/*</svg>*/}
                {/*</button>*/}
                <button type="submit" title='create'>
                    {/*<svg className={svgClassName}>*/}
                        {/*<use xlinkHref="index.svg#add" />*/}
                    {/*</svg>*/}
                    <img src='inspired_create_icon.png' />
                </button>
            </form>
        )
    }
}
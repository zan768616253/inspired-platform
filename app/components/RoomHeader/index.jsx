import React from 'react'
import {observer} from "mobx-react/index";

import ChatStore from "../../store/ChatStore.js";
import UIStore from '../../store/UIStore'

@observer
export default class RoomHeader extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    handleShowParticipantsButtonOnClick () {
        UIStore.showInvites = false
        UIStore.showFavourite = false
        UIStore.showParticipants = !UIStore.showParticipants
    }

    handleShowInvitesButtonOnClick () {
        ChatStore.findUsers = []
        UIStore.showParticipants = false
        UIStore.showFavourite = false
        UIStore.showInvites = !UIStore.showInvites
    }

    render() {
        const roomName = ChatStore.groupname.trim()
        const participants = ChatStore.participants

        return (
            <header className='room-header'>
                <button onClick={() => {
                    UIStore.sidebarOpen = !UIStore.sidebarOpen
                }}>
                    <svg>
                        <use xlinkHref="index.svg#menu" />
                    </svg>
                </button>
                {(roomName && participants) && (
                    <div onClick={() => this.handleShowParticipantsButtonOnClick()}>
                        <span>{participants.length}</span>
                        <svg>
                            <use xlinkHref="index.svg#members" />
                        </svg>
                    </div>
                )}
                {roomName && <div className='room-title'>
                    <img src='inspired_group_icon.png' />
                    <h1>{roomName}</h1>
                </div>}
                {(roomName && participants && this.props.role < 3) && (
                    <div className='room-invite-container' onClick={() => this.handleShowInvitesButtonOnClick()}>
                        {/*<i className="fa fa-plus" aria-hidden="true" />*/}
                        <img src='inspired_add_member_icon.png' />
                    </div>
                )}
                {/*{(roomName && participants) && (*/}
                    {/*<div className='room-delete-container'>*/}
                        {/*<span>DELETE</span>*/}
                    {/*</div>*/}
                {/*)}*/}

            </header>
        )
    }

}
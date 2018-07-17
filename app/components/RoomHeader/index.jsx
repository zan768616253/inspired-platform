import React from 'react'
import {observer} from "mobx-react/index";

import ChatStore from "../../store/ChatStore.js";
import UIStore from '../../store/UIstore'

@observer
export default class RoomHeader extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    handleShowParticipantsButtonOnClick () {
        UIStore.showParticipants = !UIStore.showParticipants
    }

    render() {
        const roomName = ChatStore.groupname.trim()
        const participants = ChatStore.participants

        return (
            <header className='room-header'>
                <button>
                    <svg>
                        <use xlinkHref="index.svg#menu" />
                    </svg>
                </button>
                <h1>{roomName}</h1>
                {(roomName && participants) && (
                    <div onClick={() => this.handleShowParticipantsButtonOnClick()}>
                        <span>{participants.length}</span>
                        <svg>
                            <use xlinkHref="index.svg#members" />
                        </svg>
                    </div>
                )}
            </header>
        )
    }

}
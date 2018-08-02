import React from 'react'
import ChatStore from "../../store/ChatStore";
import UIStore from "../../store/UIStore";
import UserStore from "../../store/UserStore";

export default class Gallery extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isEdit: false
        }
        this.titleInput = null
        this._id = null
    }

    handleEditButtonOnClick() {
        if (this.state.isEdit) {
            const d = {
                _id: this._id,
                title: this.titleInput.textContent
            }
            socket.emit('change gallery title', d)
            this.setState({
                isEdit: false
            })
        } else {
            this.setState({
                isEdit: true
            })
        }
    }

    handleSendButtonOnClick() {
        const roomId = ChatStore.groupId;
        const d = {
            user_name: UserStore.obj.name,
            roomId: roomId,
            picture: UserStore.obj.picture,
            avatar: UserStore.obj.avatar,
            sendTo: ChatStore.groupname,
            gallery: this._id
        }

        socket.emit('send gallery message', d)
    }

    handleThumbnailOnClick(ps) {
        ChatStore.images = ps
        UIStore.openLightbox = true
    }

    handleDeleteButtonOnClick() {
        socket.emit('disable gallery message', {
            gallery: this._id
        })
    }

    render () {
        const galleryToolClass = this.state.isEdit ? ' display' : ''
        const {pictures, title, _id} = this.props.data
        const ps = _.map(pictures, p => {
            return '/api/message/image/' + p
        })
        const previewPicture = ps.length ? ps[0] : ''
        this._id = _id
        const userRole = this.props.userRole
        return (
            <li>
                <div className='gallery-container' key={_id}>
                    <div className={'gallery-tools' + galleryToolClass}>
                        <a className='gallery-tool send' onClick={() => this.handleSendButtonOnClick()}>
                            <i className="fa fa-envelope" aria-hidden="true" />
                        </a>
                        {userRole === 1 &&  <a className='gallery-tool edit' onClick={() =>
                            this.handleEditButtonOnClick()}>
                            {this.state.isEdit ?
                                <i className="fa fa-floppy-o" aria-hidden="true"/>:
                                <i className="fa fa-pencil" aria-hidden="true"/>
                            }
                        </a>}
                        {userRole === 1 && <a className='gallery-tool delete' onClick={() => this.handleDeleteButtonOnClick()}>
                            <i className="fa fa-minus-circle" aria-hidden="true" />
                        </a>}
                    </div>
                    <div className='gallery-thumbnail' onClick={() => this.handleThumbnailOnClick(ps)}>
                        <img src={previewPicture} />
                    </div>
                    <div ref={e => this.titleInput = e}
                         contentEditable={this.state.isEdit}
                         className='gallery-title'>
                        {title}
                    </div>
                </div>
            </li>
        )
    }
}
import React from 'react'

import EventProxy from 'eventproxy'

import ChatStore from "../../store/ChatStore";
import UserStore from "../../store/UserStore";

const fileTypes = ['image/jpeg', 'image/png']

export default class FileInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isAttachmentValid: true
        }
    }

    sendImageMessage(data) {
        const file = data.attachment.file
        if (file.size < 700000 && fileTypes.includes(file.type)) {
            const ep = new EventProxy()

            ep.all('image_upload', filename => {
                const src = '/api/message/image/' + filename

                const roomId = ChatStore.groupId;

                const d = {
                    user_name: UserStore.obj.name,
                    roomId: roomId,
                    picture: UserStore.obj.picture,
                    avatar: UserStore.obj.avatar,
                    sendTo: ChatStore.groupname,
                    attachment: src,
                }

                socket.emit("send message", d);
            })

            const formData = new FormData();
            formData.append('file', file);

            $.ajax({
                url: '/api/chat/uploadimage',
                type: 'POST',
                data: formData,
                cache: false,
                processData: false,
                contentType: false,
                success: (data, textStatus, jqXHR) => {
                    ep.emit('image_upload', data.filename)
                },
                error: (jqXHR, textStatus, errorThrown) => {
                    console.log('ERRORS: ' + textStatus);
                }
            })

            this.setState({isAttachmentValid: true})
        } else {
            this.setState({isAttachmentValid: false})
        }
    }

    render() {
        const attachmentIconClass = this.state.isAttachmentValid ? '' : 'fail'
        return(
            <div className='file-input-container' title='attachment'>
                {/*<svg className={attachmentIconClass}>*/}
                    {/*<use xlinkHref="index.svg#attach" />*/}
                {/*</svg>*/}
                <img src='inspired_attach_icon.png' />
                <input
                    className='file-input' type="file"
                    onChange={e => {
                        const file = e.target.files[0]
                        file && this.sendImageMessage({
                            text: file.name,
                            roomId: ChatStore.groupId,
                            attachment: {
                                name: file.name,
                                file,
                            },
                        })
                    }}
                />
            </div>
        )
    }
}
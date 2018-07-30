import _ from 'lodash'
import React from 'react'
import Dropzone from '../Dropzone'

import Gallery from './Gallery'

import ChatStore from "../../store/ChatStore";
import EventProxy from "eventproxy/index";
import UserStore from "../../store/UserStore";

export default class FavouriteList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            dropzoneActive: false
        }
        this.dropzoneRef = null
    }

    onDrop(accepted, rejected){
        const ep = new EventProxy()
        const formData = new FormData();
        accepted.forEach(a => {
            formData.append('files', a);
        })
        formData.append('user_id', UserStore.obj.user_id)

        $.ajax({
            url: '/api/gallery/uploadimage',
            type: 'POST',
            data: formData,
            cache: false,
            processData: false,
            contentType: false,
            success: (data, textStatus, jqXHR) => {
                ep.emit('gallery_upload', data)
            },
            error: (jqXHR, textStatus, errorThrown) => {
                console.log('ERRORS: ' + textStatus);
            }
        })

        ep.all('gallery_upload', gallery => {
            console.log(gallery)
        })
    }

    render() {
        const favouriteList = ChatStore.favourites ? ChatStore.favourites : []
        const plusContainerClass = 'standby'
        return (
            <ul className='favourite-list'>
                <li className='favourite-item'>
                    {/*<div className={'favourite-item-plus-container standby'}>*/}
                        {/*<i className="fa fa-plus" />*/}
                    {/*</div>*/}
                    <Dropzone
                        accept="image/jpeg, image/png"
                        className={'favourite-item-plus-container standby'}
                        ref={(node) => { this.dropzoneRef = node; }}
                        onDrop={this.onDrop.bind(this)}>
                        <i className="fa fa-plus" />
                    </Dropzone>
                </li>
                <li>
                    <Gallery />
                    <Gallery />
                    <Gallery />
                    <Gallery />
                    <Gallery />
                    <Gallery />
                </li>
                {/*{*/}
                    {/*favouriteList.map(favourite => {*/}

                    {/*})*/}
                {/*}*/}
            </ul>
        )
    }
}
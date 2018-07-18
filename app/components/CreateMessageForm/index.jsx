import React from 'react'

import FileInput from './FileInput'

export default class CreateMessageForm extends React.Component {

    render () {
        return (
            <form
                className='create-message-form'
                onSubmit={e => {
                    e.preventDefault()
                    const message = e.target[0].value
                    e.target[0].value = ''
                }}>
                <input
                    placeholder="Type a Message.."
                    onInput={e => user.isTypingIn({ roomId: room.id })}
                />
                <FileInput />
                <button type="submit">
                    <svg>
                        <use xlinkHref="index.svg#send" />
                    </svg>
                </button>
            </form>
        )
    }
}
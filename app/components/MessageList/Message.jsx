import React from 'react'
import Linkify from 'react-linkify'

const time = string => {
    const date = new Date(string)
    const minutes = date.getMinutes()
    return `${date.getHours()}:${minutes < 10 ? '0' + minutes : minutes}`
}

class Attachment extends React.Component {
}

export const Message = ({ user, createConvo }) => message =>
    (
        <li className='message'>
            <img
                onClick={e => createConvo({ user: message.sender })}
                src={message.sender.avatarURL}
                alt={message.sender.name}
            />
            <div>
        <span className='online'>{`${message.sender.name} | ${time(message.createdAt)}`}</span>
                <p>
                    <Linkify properties={{ target: '_blank' }}>{message.text}</Linkify>
                </p>
                {message.attachment ? (
                    <Attachment
                        user={user}
                        link={message.attachment.link}
                        type={message.attachment.type}
                    />
                ) : null}
            </div>
        </li>
    )
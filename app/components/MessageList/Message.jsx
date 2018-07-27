import React from 'react'
import Linkify from 'react-linkify'
import moment from 'moment'

const time = string => {
    console.log(moment(string))
    const date = moment(string).format('YYYY-MM-DD HH:mm:ss')
    return date
}

class Attachment extends React.Component {

    render() {
        return (
            <img src={this.props.src} />
        )
    }
}

export default class Message extends React.Component {

    render () {
        const message = this.props.message
        const avatar = message.avatar ? '/api/user/avatar/' + message.avatar : message.picture

        return (
            <li className='message'>
                <img
                    onClick={e => {}}
                    src={avatar}
                    alt={message.user_name}
                />
                <div>
                    <span className=''>{`${message.user_name} | ${time(message.time)}`}</span>
                    {message.attachment ? (
                        <Attachment
                            src={message.attachment}
                        />
                    ) : <p>
                        <Linkify properties={{ target: '_blank' }}>{this.props.message.message}</Linkify>
                    </p>}
                </div>
            </li>
        )
    }

}
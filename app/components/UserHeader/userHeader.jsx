import React from 'react'

import UserStore from "../../store/UserStore.js";
import {observer} from "mobx-react/index";

@observer
export default class UserHeader extends React.Component {
    render() {
        return (
            <header className='user-header'>
                <img src={UserStore.obj.avatar ? '/api/user/avatar/' + UserStore.obj.avatar : UserStore.obj.picture} alt={UserStore.obj.name} />
                <div>
                    <h3>{UserStore.obj.name}</h3>
                    <h5>{UserStore.obj.nickname}</h5>
                </div>
            </header>
        )

    }
}

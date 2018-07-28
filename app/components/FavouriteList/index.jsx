import React from 'react'
import ChatStore from "../../store/ChatStore";

export default class FavouriteList extends React.Component {
    render() {
        const favouriteList = ChatStore.favourites ? ChatStore.favourites : []

        return (
            <ul className='favourite-list'>
                {
                    favouriteList.map(favourite => {

                    })
                }
            </ul>
        )
    }
}
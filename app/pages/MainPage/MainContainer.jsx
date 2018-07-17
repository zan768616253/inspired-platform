import React from "react";
import Chat from "../../components/chat.jsx";
import Board from "../../components/board.jsx";
import ListChatContainer from "../../components/chat/ListChatContainer.jsx";
import NewChatDrawer from "../../components/drawer/newchatdrawer.jsx";

import UserHeader from '../../components/UserHeader/userHeader'
import RoomList from '../../components/RoomList/roomList'
import CreateRoomForm from '../../components/CreateRoomForm'
import Roomheader from '../../components/RoomHeader'

import UserStore from '../../store/UserStore'
import ChatStore from "../../store/ChatStore"

export default class MainContainer extends React.Component {
  //
  // render() {
  //   return (
  //     <div className="fullWidth fullheight row expanded">
  //       <NewChatDrawer />
  //       <div className="columns medium-3 large-3 padding " style={{height: "100%"}}>
  //         <ListChatContainer />
  //       </div>
  //
  //       <div className="columns medium-4 large-4 padding" style={{height: "100%"}}>
  //         <Chat />
  //       </div>
  //
  //       <div className="columns medium-5 large-5 padding" style={{height: "100%"}}>
  //         <Board />
  //       </div>
  //     </div>
  //   );
  // }

  render() {
    return (
        <main>
            <aside>
                <UserHeader />
                <RoomList />
                <CreateRoomForm />
            </aside>
            <section>
                <Roomheader />
                {ChatStore.groupId && <row->
                    <col->
                    </col->
                </row->
                }
            </section>
        </main>
    )
  }
}

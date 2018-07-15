import React from "react";
import Drawer from "material-ui/Drawer";
import MenuItem from "material-ui/MenuItem";
import RaisedButton from "material-ui/RaisedButton";
import muiThemeable from "material-ui/styles/muiThemeable";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";
import IconMenu from "material-ui/IconMenu";
import Toolbar from "../toolbar.jsx";
import Boards from "../Note.jsx";
import {greenA400, orange500} from "material-ui/styles/colors";
import { lightBlue500, blue500 } from "material-ui/styles/colors";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import { Tabs, Tab } from "material-ui/Tabs";
import FontIcon from "material-ui/FontIcon";
import MapsPersonPin from "material-ui/svg-icons/maps/person-pin";
import FindFriends from "../dashboard/FindFriends.jsx";
import AcceptRequests from "../dashboard/AcceptRequests.jsx";
import FriendList from "../dashboard/FriendList.jsx";
import UserStore from "../../store/UserStore.js";
import Badge from "material-ui/Badge";
import FriendshipsStore from "../../store/FriendshipsStore.js";
import { observer } from "mobx-react";
import UIStore from "../../store/UIstore.js";
const muiTheme = getMuiTheme({
  palette: {
    primary1Color: orange500,
    primary2Color: lightBlue500,
    secondary1Color: lightBlue500,
    accent1Color: blue500
  },
  toggle: {
    thumbOnColor: "yellow",
    trackOnColor: "red",
    backgroundColor: "red"
  },
  appBar: {
    height: 50
  }
});
@observer
export default class Invites extends React.Component {
  constructor(props) {
    super(props);
  }

  _handleClick = () => {
    if (UIStore.tabChange == true) {
      UIStore.tabChange = false;
    } else UIStore.tabChange = true;
  };

  componentDidMount() {
    var data = { id: UserStore.obj.user_id };
    $.ajax({
      type: "POST",
      url: "/api/user/myuserid",
      data: data
    })
      .done(function(data) {})
      .fail(function(jqXhr) {});
  }
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Toolbar />

          <Tabs onChange={() => this._handleClick()}>
            <Tab
              icon={
                <FontIcon className="material-icons">Find Friends </FontIcon>
              }
              label="."
            >
              <FindFriends />
            </Tab>
            <Tab
              icon={
                <FontIcon className="material-icons">
                  {" "}
                  Accept / Reject Requests<Badge
                    badgeContent={FriendshipsStore.acceptrequestscount}
                    secondary={true}
                  />
                </FontIcon>
              }
              label="accept"
            >
              <AcceptRequests />
            </Tab>
            <Tab
              icon={
                <FontIcon className="material-icons">
                  {" "}
                  Friend List<Badge
                    badgeContent={FriendshipsStore.friendlistcount}
                    secondary={true}
                  />
                </FontIcon>
              }
              label="."
            >
              <FriendList />
            </Tab>
          </Tabs>
        </div>
      </MuiThemeProvider>
    );
  }
}

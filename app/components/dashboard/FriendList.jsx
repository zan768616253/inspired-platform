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
import List from "material-ui/List/List";
import Avatar from "material-ui/Avatar";
import FriendshipStore from "../../store/FriendshipsStore.js";
import Dialog from "material-ui/Dialog";
import Snackbar from "material-ui/Snackbar";
import ListItem from "material-ui/List/ListItem";
import Badge from "material-ui/Badge";
import {greenA400, orange500, red500} from "material-ui/styles/colors";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import Store from "../../store/UIstore.js";
import FriendshipsStore from "../../store/FriendshipsStore.js";
import UserStore from "../../store/UserStore.js";
import { observer } from "mobx-react";
import { Scrollbars } from "react-custom-scrollbars";

import SearchInput, { createFilter } from "react-search-input";

const KEYS_TO_FILTERS = [
  "email",
  "name",
  "nickname",
  "other_id_name",
  "user_id_name"
];

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: orange500,
    accent1Color: red500
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

const header = {
  textAlign: "center"
};

let friendlist = [];
let friendlistcount;
const style = {
  margin: 12
};

@observer
export default class FriendList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      yay: true,
      snackbarsendreq: false,
      openDelete: false
    };
  }

  componentDidMount() {
    $.ajax({
      type: "GET",
      url: "/api/user/friendlist"
    })
      .done(function(data) {
        friendlist = data;
        FriendshipsStore.mylist = data;
        friendlistcount = Object.keys(friendlist).length;
        FriendshipsStore.friendlistcount = friendlistcount;
      })
      .fail(function(jqXhr) {});
  }
  searchUpdated(term) {
    this.setState({ searchTerm: term });
  }

  _handleClick = Friendship => {
    var data = {
      user_id: UserStore.obj.user_id,
      other_id: Friendship.other_id
    };
    this.setState({ openDelete: true });

    FriendshipStore.removefriendlistfriend = data;
  };
  handleUnfriend = () => {
    var data = FriendshipStore.removefriendlistfriend;
    socket.emit("unfriend friendlist", data);

    $.ajax({
      type: "GET",
      url: "/api/user/friendlist"
    })
      .done(function(data) {
        friendlist = data;
        FriendshipsStore.mylist = data;
        friendlistcount = Object.keys(friendlist).length;
        FriendshipsStore.friendlistcount = friendlistcount;
      })
      .fail(function(jqXhr) {});
    this.setState({ snackbarsendreq: true });

    this.setState({ openDelete: false });
  };
  handleDeleteClose = () => {
    this.setState({ openDelete: false });
  };
  handleRequestClose = () => {
    this.setState({ snackbarsendreq: false });
  };

  render() {
    const actionsDelete = [
      <RaisedButton
        label="Cancel"
        onTouchTap={this.handleDeleteClose}
        style={style}
      />,
      <RaisedButton
        label="Unfriend the User"
        secondary={true}
        onTouchTap={this.handleUnfriend}
      />
    ];
    const filteredEmails = FriendshipsStore.mylist.filter(
      createFilter(this.state.searchTerm, KEYS_TO_FILTERS)
    );

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <br />
          <div className="row">
            <div className="columns medium-8 large-8 small-centered">
              <div>
                <h3 style={header}>
                  Friendlist{" "}
                  <Badge
                    badgeContent={FriendshipsStore.friendlistcount}
                    primary={true}
                  />
                </h3>
              </div>
              <br />

              <SearchInput
                className="search-input"
                onChange={this.searchUpdated.bind(this)}
              />
              <br />
              <Dialog
                title="Unfriend the User"
                actions={actionsDelete}
                modal={false}
                open={this.state.openDelete}
                onRequestClose={this.handleDeleteClose}
              >
                Are you sure you want to Unfriend? This action cannot be
                reversed.
              </Dialog>
              <Snackbar
                open={this.state.snackbarsendreq}
                message="Friend has been removed"
                autoHideDuration={2500}
                onRequestClose={this.handleRequestClose}
              />

              <Scrollbars
                style={{ height: 380 }}
                renderTrackHorizontal={props => (
                  <div
                    {...props}
                    className="track-horizontal"
                    style={{ display: "none" }}
                  />
                )}
                renderThumbHorizontal={props => (
                  <div
                    {...props}
                    className="thumb-horizontal"
                    style={{ display: "none" }}
                  />
                )}
              >
                {filteredEmails.map(Friendlist => {
                  var id;
                  if (Friendlist.user_id == UserStore.obj.user_id) {
                    id = Friendlist.other_id;

                    return (
                      <div className="mail" key={Friendlist.other_id}>
                        <List key={Friendlist.other_id}>
                          <ListItem
                            key={Friendlist.other_id}
                            disabled={true}
                            leftAvatar={
                              <Avatar
                                size={80}
                                key={Friendlist.other_id}
                                src={Friendlist.picture}
                              />
                            }
                            rightIconButton={
                              <RaisedButton
                                label={"Remove Friend"}
                                secondary={true}
                                onTouchTap={() => this._handleClick(Friendlist)}
                                style={style}
                              />
                            }
                          >
                            <div
                              className="searchContent"
                              key={Friendlist.other_id}
                            >
                              <div className="subject">
                                {Friendlist.other_id_name}
                              </div>
                              <br />
                              <div className="from">{}</div>
                              <br />
                              <div className="subject">{}</div>
                            </div>
                          </ListItem>
                        </List>
                      </div>
                    );
                  } else {
                    id = Friendlist.user_id;

                    return (
                      <div className="mail" key={Friendlist.user_id}>
                        <List key={Friendlist.user_id}>
                          <ListItem
                            key={Friendlist.user_id}
                            disabled={true}
                            leftAvatar={
                              <Avatar
                                size={80}
                                key={Friendlist.user_id}
                                src={Friendlist.user_picture}
                              />
                            }
                            rightIconButton={
                              <RaisedButton
                                label={"Remove Friend"}
                                secondary={true}
                                onTouchTap={() => this._handleClick(id)}
                                style={style}
                              />
                            }
                          >
                            <div
                              className="searchContent"
                              key={Friendlist.user_id}
                            >
                              <div className="subject">
                                {Friendlist.user_id_name}
                              </div>
                              <br />
                              <div className="from">{}</div>
                              <br />
                              <div className="subject">{}</div>
                            </div>
                          </ListItem>
                        </List>
                      </div>
                    );
                  }
                })}
              </Scrollbars>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

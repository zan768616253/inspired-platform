import React from "react";
import IconMenu from "material-ui/IconMenu";
import { List, ListItem } from "material-ui/List";
import Avatar from "material-ui/Avatar";
import IconButton from "material-ui/IconButton";
import NavigationExpandMoreIcon from "material-ui/svg-icons/navigation/expand-more";
import SocialPeople from "material-ui/svg-icons/social/person-add";
import { MenuItem } from "material-ui/Menu";
import RaisedButton from "material-ui/RaisedButton";
import EventStore from "../store/EventStore.js";
import {
  Toolbar,
  ToolbarGroup
} from "material-ui/Toolbar";
import { browserHistory } from "react-router";
import { logout, userProfile } from "../../auth.js";
import { AppBar, Drawer } from "material-ui";
import UserStore from "../store/UserStore.js";
import Store from "../store/UIstore.js";
import { observer } from "mobx-react";
import NavigationClose from "material-ui/svg-icons/navigation/close";
import Dialog from "material-ui/Dialog";
import FriendshipsStore from "../store/FriendshipsStore.js";
let user_id;
let friendlist = [];
let friendlistcount;
let localprofileparse;

const materialbackground = {
  backgroundImage: 'url("assets/images/materialpic.png")',
  width: "256px",
  height: "180px"
};

const buttonMargin = {
  margin: 12
};
const leftmost = {
  marginLeft: 0
};
const avatar = {
  marginLeft: "auto",
  marginRight: "auto",
  display: "block"
};
const userRealName = {
  fontSize: "18px",
  textAlign: "center"
};
const wordwrap = {
  wordWrap: "breakWord",
  overflow: "hidden"
};

const savebtn = {
  bottom: "1px"
};
const pinstyle = {
  width: "22px",
  height: "22px",
  margin: "0 50px",
  display: "inline-block",
  transform: "rotate(330deg)"
};
const customContentStyle = {
  width: "30%",
  maxWidth: "none"
};

const paddingIcon = {
  paddingBottom: "48px"
};

const menuStyle = {
  height: "20px",
  width: "20px"
};
@observer
export default class ToolbarExamplesSimple extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 3,
      yum: true,
      open: false,
      openDialog: false,
      obj: {},
      openInvites: false,
      yay: true
    };
    this.showApp = this.showApp.bind(this);
    this.showEvents = this.showEvents.bind(this);
    this.showTimetable = this.showTimetable.bind(this);
    this.showDashboard = this.showDashboard.bind(this);
    this.showPrivateNotes = this.showPrivateNotes.bind(this);
    this.showInvites = this.showInvites.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.profile = this.profile.bind(this);
    this.settings = this.settings.bind(this);
    this.logmeout = this.logmeout.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
  }
  handleToggle = () => this.setState({ open: !this.state.open });
  logmeout = () => this.setState({ openDialog: !this.state.openDialog });

  handleDialogClose = () => {
    this.setState({ openDialog: false });
  };
  handleDialogInvitesClose = () => {
    Store.goToInvites = false;
  };
  goToInvites = () => {
    Store.goToInvites = false;

    Store.app = false;
    Store.events = false;
    Store.timetable = false;
    Store.privatenote = false;
    Store.dashboard = false;
    Store.invites = true;
    browserHistory.replace("/invites");
  };

  profile() {
    Store.app = false;
    Store.events = false;
    Store.timetable = false;
    Store.invites = false;

    Store.privatenote = false;
    Store.dashboard = false;
    browserHistory.replace("/profile");
  }
  settings() {
    Store.app = false;
    Store.events = false;
    Store.timetable = false;
    Store.privatenote = false;
    Store.invites = false;

    Store.dashboard = false;
    browserHistory.replace("/settings");
  }

  showApp() {
    Store.app = true;
    Store.events = false;
    Store.invites = false;

    Store.timetable = false;
    Store.privatenote = false;
    Store.dashboard = false;
    browserHistory.replace("/app");
  }
  showTimetable() {
    Store.app = false;
    Store.events = false;
    Store.timetable = true;
    Store.privatenote = false;
    Store.invites = false;

    Store.dashboard = false;
    browserHistory.replace("/timetable");
  }
  showEvents() {
    Store.app = false;
    Store.events = true;
    Store.timetable = false;
    Store.privatenote = false;
    Store.invites = false;

    Store.dashboard = false;
    browserHistory.replace("/events");
  }
  showDashboard() {
    Store.app = false;
    Store.events = false;
    Store.timetable = false;
    Store.privatenote = false;
    Store.invites = false;

    Store.dashboard = true;
    browserHistory.replace("/dashboard");
  }
  showInvites() {
    Store.app = false;
    Store.events = false;
    Store.timetable = false;
    Store.privatenote = false;
    Store.dashboard = false;
    Store.invites = true;
    browserHistory.replace("/invites");
  }
  showPrivateNotes() {
    Store.app = false;
    Store.events = false;
    Store.timetable = false;
    Store.privatenote = true;
    Store.invites = false;

    Store.dashboard = false;
    browserHistory.replace("/notes");
  }

  newfunc() {
    if (UserStore.email == "") {
      UserStore.picture = "http://lorempixel.com/g/400/200";
    } else {
    }
    user_id = localStorage.getItem("userid");

    var location = "api/user/" + user_id;

    $.ajax({
      url: location,
      type: "GET",
      data: {
        format: "json"
      },
      dataType: "json",

      success: function(data) {
        UserStore.obj = data[0];

        localprofileparse = UserStore.obj.identities[0].provider;
        UserStore.created_at = UserStore.obj.created_at;
        UserStore.created_at_day = UserStore.obj.created_at.substring(0, 10);
        UserStore.emailverified = UserStore.obj.email_verified;
        UserStore.emailnotif = UserStore.obj.emailnotif;

        if (
          localprofileparse == "facebook" ||
          localprofileparse == "google-oauth2"
        )
          UserStore.userrealname = UserStore.obj.name;
        else UserStore.userrealname = UserStore.obj.nickname;

        if (localprofileparse == "facebook") {
          UserStore.useraccount = "Facebook";
        } else if (localprofileparse == "google-oauth2") {
          {
            UserStore.useraccount = "Google";
          }
        } else UserStore.useraccount = "Email Account";
      },

      error: function() {}
    });
  }

  componentDidMount() {
    var profile = localStorage.getItem("profile");
    var newprofile = JSON.parse(profile);

    $.ajax({
      type: "POST",
      url: "/api/user",
      data: newprofile
    })
      .done(function(data) {})
      .fail(function(jqXhr) {});

    $.ajax({
      type: "GET",
      url: "/api/user/friendlist"
    })
      .done(function(data) {
        friendlist = data;
        FriendshipsStore.myfriendslist = data;

        friendlistcount = Object.keys(friendlist).length;
        FriendshipsStore.friendlistcount = friendlistcount;
        setTimeout(
          function() {
            if (Store.invitescount < 1) {
              if (FriendshipsStore.friendlistcount == 0) {
                Store.goToInvites = true;
                Store.invitescount++;
              }
            }
          }.bind(this),
          2500
        );
      })
      .fail(function(jqXhr) {});

    $.ajax({
      type: "GET",
      url: "/api/getEvents"
    })
      .done(function(data) {
        EventStore.event = data;
      })
      .fail(function(jqXhr) {});
    this.newfunc();

    if (Store.yum) {
      setTimeout(
        function() {
          this.newfunc();
          Store.yum = false;
        }.bind(this),
        4000
      );
    }
  }

  render() {
    const actions = [
      <RaisedButton
        label="Cancel"
        onTouchTap={this.handleDialogClose}
        style={buttonMargin}
      />,
      <RaisedButton label="Log Out" onTouchTap={logout} />
    ];

    // APP ROUTE

    if (Store.app == true) {
      var backgroundhover = {
        backgroundColor: "#E8E8E8"
      };
    } else if (Store.app == false) {
      var backgroundhover = {
        backgroundColor: "#FFFFFF"
      };
    }

    // EVENTS ROUTE

    if (Store.events == true) {
      var backgroundhoverevents = {
        backgroundColor: "#E8E8E8"
      };
    } else if (Store.events == false) {
      var backgroundhoverevents = {
        backgroundColor: "#FFFFFF"
      };
    }

    // TimeTable ROUTE

    if (Store.timetable == true) {
      var backgroundhovertimetable = {
        backgroundColor: "#E8E8E8"
      };
    } else if (Store.timetable == false) {
      var backgroundhovertimetable = {
        backgroundColor: "#FFFFFF"
      };
    }
    // Private Notes ROUTE

    if (Store.privatenote == true) {
      var backgroundhoverprivatenote = {
        backgroundColor: "#E8E8E8"
      };
    } else if (Store.privatenote == false) {
      var backgroundhoverprivatenote = {
        backgroundColor: "#FFFFFF"
      };
    }
    // Dashboard ROUTE

    if (Store.dashboard == true) {
      var backgroundhoverdashboard = {
        backgroundColor: "#E8E8E8"
      };
    } else if (Store.dashboard == false) {
      var backgroundhoverdashboard = {
        backgroundColor: "#FFFFFF"
      };
    }

    if (Store.invites == true) {
      var backgroundhoverinvites = {
        backgroundColor: "#E8E8E8"
      };
    } else if (Store.invites == false) {
      var backgroundhoverinvites = {
        backgroundColor: "#FFFFFF"
      };
    }

    return (
      <div>
        <Toolbar className='homeNavBar'>
          <ToolbarGroup>
            <IconButton
              touch={true}
              tooltipPosition="bottom-center"
              onClick={this.handleToggle}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 18 18"
              >
                <path d="M2 13.5h14V12H2v1.5zm0-4h14V8H2v1.5zM2 4v1.5h14V4H2z" />
              </svg>
            </IconButton>
          </ToolbarGroup>
          <ToolbarGroup>
            <img
              src="logo-placeholder.png"
              style={{
                height: "45px",
                width: "235px"
              }}
            />
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarGroup firstChild={true}>
              <List>
                <ListItem
                  disabled={true}
                  leftAvatar={<Avatar src={UserStore.obj.picture} />}
                  primaryText={UserStore.userrealname}
                />
              </List>
              <div className="leftmostlogout">
                <IconMenu
                  style={leftmost}
                  iconButtonElement={
                    <IconButton touch={true}>
                      <NavigationExpandMoreIcon />
                    </IconButton>
                  }
                >
                  <MenuItem primaryText="Profile" onClick={this.profile} />
                  <MenuItem primaryText="Log Out" onClick={this.logmeout} />
                </IconMenu>
              </div>
            </ToolbarGroup>
          </ToolbarGroup>
        </Toolbar>
        <Dialog
          title="Log Out"
          actions={actions}
          modal={false}
          open={this.state.openDialog}
          onRequestClose={this.handleDialogClose}
        >
          Are you sure you want to Log Out?
        </Dialog>
        <Dialog
          title="Welcome to InspirEd"
          modal={false}
          open={Store.goToInvites}
          onRequestClose={this.handleDialogInvitesClose}
        >
          Since you have no friends, Lets head over to Invites to find and add
          new friends
          <br />
          <br />
          <br />
          <RaisedButton
            label="Go to Invites"
            primary={true}
            onTouchTap={this.goToInvites}
            style={buttonMargin}
          />
        </Dialog>

        <Drawer open={this.state.open} containerStyle={{ height: "100%" }}>
          <AppBar
            title="kolaboard"
            iconElementRight={
              <IconButton onTouchTap={this.handleToggle}>
                <NavigationClose />
              </IconButton>
            }
          />
          <div style={materialbackground}>
            <br />
            <br />
            <div className="materialimage">
              <Avatar size={60} style={avatar} src={UserStore.obj.picture} />
              <span style={userRealName}>{UserStore.userrealname} </span>{" "}
            </div>
          </div>

          <MenuItem
            style={backgroundhover}
            onClick={this.showApp}
            primaryText="Chat"
            leftIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
              </svg>
            }
          >
            {" "}
          </MenuItem>

          <MenuItem
            style={backgroundhovertimetable}
            onTouchTap={this.showTimetable}
            primaryText="Timetable"
            leftIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
              </svg>
            }
          >
            {" "}
          </MenuItem>
          <MenuItem
            style={backgroundhoverprivatenote}
            onClick={this.showPrivateNotes}
            primaryText="Private Notes"
            leftIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
              </svg>
            }
          >
            {" "}
          </MenuItem>
          <MenuItem
            style={backgroundhoverinvites}
            onClick={this.showInvites}
            primaryText="Invites"
            leftIcon={<SocialPeople />}
          >
            {" "}
          </MenuItem>
        </Drawer>
      </div>
    );
  }
}

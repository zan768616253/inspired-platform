import React from "react";
import IconMenu from "material-ui/IconMenu";
import { List } from "material-ui/List";
import IconButton from "material-ui/IconButton";
import NavigationExpandMoreIcon from "material-ui/svg-icons/navigation/expand-more";
import { MenuItem } from "material-ui/Menu";
import RaisedButton from "material-ui/RaisedButton";
import EventStore from "../../store/EventStore.js";
import {
    Toolbar,
    ToolbarGroup
} from "material-ui/Toolbar";
import { browserHistory } from "react-router";
import { logout, userProfile } from "../../../auth.js";
import UserStore from "../../store/UserStore.js";
import Store from "../../store/UIstore.js";
import { observer } from "mobx-react";
import Dialog from "material-ui/Dialog";
let user_id;
let localprofileparse;

const buttonMargin = {
    margin: 12
};
const leftmost = {
    marginLeft: 0
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

    profile() {
        Store.app = false;
        Store.events = false;
        Store.timetable = false;
        Store.invites = false;

        Store.privatenote = false;
        Store.dashboard = false;
        browserHistory.replace("/profile");
    }
    platform() {
        Store.app = false;
        Store.events = false;
        Store.timetable = false;
        Store.invites = false;

        Store.privatenote = false;
        Store.dashboard = false;
        browserHistory.replace("/app");
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

        return (
            <div>
                <Toolbar className='homeNavBar'>
                    <ToolbarGroup>
                        <img
                            src="inspired_logo_big.png"
                            className='main-logo'
                        />
                        <img
                            src="inspired_logo_small.png"
                            className='small-logo'
                        />
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <ToolbarGroup firstChild={true}>
                            <div className='tootlebar-right-container'>
                                <a className='tootlebar-right-link' onClick={this.platform}>
                                    <img src='/icons-home.png' />
                                </a>
                                <a className='tootlebar-right-link' onClick={this.profile} >
                                    <img src='/icons-user.png' />
                                </a>
                                <a className='tootlebar-right-link' onClick={this.logmeout}>
                                    <img src='/icons-exit.png' className='exit'/>
                                </a>
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
            </div>
        );
    }
}
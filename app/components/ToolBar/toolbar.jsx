import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import {
    Toolbar,
    ToolbarGroup
} from "material-ui/Toolbar";
import { browserHistory } from "react-router";
import { logout, userProfile } from "../../../auth.js";
import UserStore from "../../store/UserStore.js";
import Store from "../../store/UIStore";
import { observer } from "mobx-react";
import Dialog from "material-ui/Dialog";

@observer
export default class ToolbarExamplesSimple extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            yum: true,
            open: false,
            openDialog: false,
        };
        this.handleToggle = this.handleToggle.bind(this);
        this.profile = this.profile.bind(this);
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

    componentDidMount() {
        const profile = JSON.parse(localStorage.getItem("profile"))

        $.ajax({
            type: "POST",
            url: "/api/user",
            data: profile
        })
        .done(function(data) {
            UserStore.obj = data

            const localprofileparse = UserStore.obj.identities[0].provider;
            UserStore.created_at = UserStore.obj.created_at;
            UserStore.created_at_day = UserStore.obj.created_at.substring(0, 10);
            UserStore.emailverified = UserStore.obj.email_verified;
            UserStore.emailnotif = UserStore.obj.emailnotif;

            if (localprofileparse === "facebook" || localprofileparse === "google-oauth2")
                UserStore.userrealname = UserStore.obj.name;
            else UserStore.userrealname = UserStore.obj.nickname;

            if (localprofileparse === "facebook") {
                UserStore.useraccount = "Facebook"
            } else if (localprofileparse === "google-oauth2") {
                UserStore.useraccount = "Google"
            } else UserStore.useraccount = "Email Account"
        })
        .fail(function(jqXhr) {

        });
    }

    render() {
        const actions = [
            <RaisedButton
                label="Cancel"
                onTouchTap={this.handleDialogClose}
            />,
            <RaisedButton label="Log Out" onTouchTap={logout} />
        ];

        return (
            <div>
                <Toolbar className='homeNavBar'>
                    <ToolbarGroup>
                        <img
                            src="inspired_logo_zone.png"
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
                                    <img src='/inspired_message_icon.png' />
                                </a>
                                <a className='tootlebar-right-link' onClick={this.profile} >
                                    <img src='/inspired_profile_icon.png' />
                                </a>
                                <a className='tootlebar-right-link' onClick={this.logmeout}>
                                    <img src='/inspired_logout_icon.png' className='exit'/>
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
import React from "react";
import Avatar from "material-ui/Avatar";
import IconButton from "material-ui/IconButton";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import IconMenu from "material-ui/IconMenu";
import {
  grey400,
  darkBlack,
  lightBlack,
  blue300
} from "material-ui/styles/colors";
import { List, ListItem } from "material-ui/List";
import RaisedButton from "material-ui/RaisedButton";
import NavigationExpandMoreIcon from "material-ui/svg-icons/navigation/expand-more";
import MenuItem from "material-ui/MenuItem";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarTitle
} from "material-ui/Toolbar";
import FontIcon from "material-ui/FontIcon";
import Store from "../../store/UIstore.js";
import ChatStore from "../../store/ChatStore.js";
import { observer } from "mobx-react";

const bottomPadding = {
  paddingBottom: "12px"
};

const iconButtonElement = (
  <IconButton touch={true} tooltip="more" tooltipPosition="bottom-left">
    <MoreVertIcon color={darkBlack} />
  </IconButton>
);

const rightIconMenu = (
  <IconMenu iconButtonElement={iconButtonElement}>
    <MenuItem>Settings</MenuItem>
  </IconMenu>
);

@observer
export default class Boardbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false
    };

    this.handleFullscreen = this.handleFullscreen.bind(this);
  }
  handleFullscreen() {
    if (Store.full == "fullScreen") Store.full = "";
    else Store.full = "fullScreen";
  }

  render() {
    return (
      <Toolbar>
        <ToolbarGroup>
          <ToolbarTitle text={"Noteboard | " + ChatStore.groupname} />
        </ToolbarGroup>
        <ToolbarGroup lastChild={true}>
          <IconButton
            tooltip="expand"
            touch={true}
            tooltipPosition="bottom-center"
            onClick={this.handleFullscreen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 18 18"
            >
              <path d="M4.5 11H3v4h4v-1.5H4.5V11zM3 7h1.5V4.5H7V3H3v4zm10.5 6.5H11V15h4v-4h-1.5v2.5zM11 3v1.5h2.5V7H15V3h-4z" />
            </svg>
          </IconButton>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

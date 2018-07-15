var React = require("react");
var { Link, IndexLink } = require("react-router");
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import RaisedButton from "material-ui/RaisedButton";
import FirstPage from "./firstpage.jsx";
import LoginDialog from "./loginmodal.jsx";
import Nav from "./nav.jsx";
import Toolbar from "./toolbar.jsx";
import Chat from "./chat.jsx";
import Board from "./board.jsx";
import MainContainer from "./MainContainer.jsx";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import {cyan500, orange500, red500} from "material-ui/styles/colors";
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

const style = {
  height: "100%"
};

var Main = () => {
  return (
    <MuiThemeProvider muiTheme={muiTheme}>
      <div style={style}>
        <Toolbar />
        <MainContainer />
      </div>
    </MuiThemeProvider>
  );
};

module.exports = Main;

var React = require("react");
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Toolbar from "../../components/ToolBar/toolbar.jsx";
import MainContainer from "./MainContainer";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import {orange500, red500} from "material-ui/styles/colors";
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

const Main = () => {
  return (
    <MuiThemeProvider muiTheme={muiTheme}>
      <div style={style}>
        <Toolbar />
        <div className='main-body'>
          <MainContainer />
        </div>
      </div>
    </MuiThemeProvider>
  );
};

module.exports = Main;

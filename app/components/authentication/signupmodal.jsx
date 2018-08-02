import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

const muiTheme = getMuiTheme({
});

export default class SignupDialog extends React.Component {
  constructor(props) {
    super(props);
  }

  handleOpen = () => {
    this.props.lock.show();
  };

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <RaisedButton
            label={this.props.title}
            primary={true}
            onTouchTap={this.handleOpen}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

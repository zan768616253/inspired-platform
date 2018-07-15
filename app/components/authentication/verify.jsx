import React from "react";
var { Link, IndexLink } = require("react-router");
import { Card, CardHeader, CardTitle, CardText } from "material-ui/Card";
import getMuiTheme from "material-ui/styles/getMuiTheme";

import muiThemeable from "material-ui/styles/muiThemeable";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
const style = {
  height: "100%"
};
const style2 = {
  margin: 12,
  width: "160px",
  height: "40px"
};
import {cyan500, orange500} from "material-ui/styles/colors";

const header = {
  textAlign: "center"
};
const tableDisplay = {
  display: "table"
};
const muiTheme = getMuiTheme({
  palette: {
    primary1Color: orange500
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

export default class Verify extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {};

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <br />
          <div className="row fullwidth">
            <div className="columns medium-12 large-12">
              <Card>
                <CardTitle title="Verify Your Email Address" />
                <br />
                <div className="center-block" style={{ display: "table" }}>
                  <img src="logo-placeholder.png" style={style2} />
                </div>
                <br />
                <CardText>
                  <h4>
                    Visit your Email to verify you account and then logout and
                    sign in again.
                  </h4>
                  <br />

                  <br />
                  <div
                    className="center-block"
                    style={{ display: "table", height: "50px" }}
                  >
                    {" "}
                    <IndexLink
                      to="/app"
                      activeClassName="active"
                      activeStyle={{
                        fontWeight: "bold"
                      }}
                    >
                      Go to App
                    </IndexLink>
                    <br />
                  </div>
                </CardText>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
              </Card>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

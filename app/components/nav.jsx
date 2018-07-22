import React from 'react'
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import LoginDialog from "./loginmodal.jsx";
import SignupDialog from "./signupmodal.jsx";
import {orange500} from "material-ui/styles/colors";

export default class NewNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const optionsLogin = {
      languageDictionary: {
        emailInputPlaceholder: "something@youremail.com",
        title: "Log In"
      },
      allowSignUp: false,
      theme: {
        logo: "cropped-logo-120.png",
        primaryColor: orange500
      },
        auth: {
            params: {
                scope: 'openid profile email'
            }
        }
    };

    const optionsSignup = {
      languageDictionary: {
        emailInputPlaceholder: "something@youremail.com",
        title: "Sign Up"
      },
      allowLogin: false,

      theme: {
        logo: "cropped-logo-120.png",
        primaryColor: orange500
      },
        auth: {
            params: {
                scope: 'openid profile email'
            }
        }
    };

    this.lockLogin = new Auth0Lock(
        "g0q1IC0FNMWQRnoT2KoRB6k4prFoKY4S",
        "inspireducation.auth0.com",
      optionsLogin
    );
    this.lockSignup = new Auth0Lock(
        "g0q1IC0FNMWQRnoT2KoRB6k4prFoKY4S",
        "inspireducation.auth0.com",
      optionsSignup
    );
  }
  render() {
    const style = {
      margin: 12,
      width: "275px",
      height: "45px"
    };

    const colormodal = {
      backgroundColor: "#00E676"
    };

    return (
      <MuiThemeProvider>
        <div className="top-bar">
          <div className="top-bar-left">
            <ul className="menu">
              <li>
                <img src="logo-placeholder.png" style={style} />
              </li>
            </ul>
          </div>
          <div className="top-bar-right">
            <ul className="menu">
              <li>
                <LoginDialog title="Log In" lock={this.lockLogin} />
              </li>

              <li>
                <SignupDialog title="Sign Up" lock={this.lockSignup} />
              </li>
            </ul>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

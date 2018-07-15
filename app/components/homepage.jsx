import React from "react";
var { Link, IndexLink } = require("react-router");
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import RaisedButton from "material-ui/RaisedButton";
import LoginDialog from "./loginmodal.jsx";
import SignupDialog from "./signupmodal.jsx";
import muiThemeable from "material-ui/styles/muiThemeable";
import { Scrollbars } from "react-custom-scrollbars";
import {orange500} from "material-ui/styles/colors";
import getMuiTheme from "material-ui/styles/getMuiTheme";

const styleimg = {
  width: "30%",
  height: "350px"
};
const scrollx = {
  overflowX: "hidden"
};
const style = {
  textAlign: "center",
  letterSpacing: "2px"
};

const aligncenter = {
  textAlign: "center",
  fontSize: "18px",
  wordSpacing: "0.5px"
};
const aligncentercollaborate = {
  textAlign: "center",
  wordSpacing: "0.5px"
};

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: orange500
  }
});

export default class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };

    this.openLogin = this.openLogin.bind(this);
  }

  componentDidMount() {
    this.myFunc();
  }

  componentWillMount() {
    var options = {
      languageDictionary: {
        emailInputPlaceholder: "something@youremail.com",
        title: "Signup / Login"
      },

      theme: {
        logo: "https://image.ibb.co/mMtqJF/Klogo_Original_Green_K.png",
        primaryColor: "#00E676"
      }
    };
    var optionsLogin = {
      languageDictionary: {
        emailInputPlaceholder: "something@youremail.com",
        title: "Login"
      },
      allowSignUp: false,

      theme: {
        logo: "https://image.ibb.co/mMtqJF/Klogo_Original_Green_K.png",
        primaryColor: "#00E676"
      }
    };

    this.lock = new Auth0Lock(
      "xDe229e1uR9PPKZMutFVk4QZYpAVU9l6",
      "kolaboard.auth0.com",
      options
    );
    this.lockLogin = new Auth0Lock(
      "xDe229e1uR9PPKZMutFVk4QZYpAVU9l6",
      "kolaboard.auth0.com",
      optionsLogin
    );
  }

  myFunc() {
    document.addEventListener("DOMContentLoaded", function() {
      Typed.new(".element", {
        strings: [
          "<em> for thriving children.</em>",
          "<em> for building community.</em>",
          "<em> for better education.</em>"
        ],
        typeSpeed: 30, // typing speed
        loop: !0, // here
        backSpeed: 20,
        startDelay: 60,
        backDelay: 1200,
        showCursor: true
      });
    });
  }
  openLogin() {
    return <LoginDialog lock={this.lockLogin.show()} />;
  }

  render() {
    this.myFunc();

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={scrollx}>
          <div className="firstPage">
            <h2 style={style}>
              {" "}
              A Collaboration platform <strong className="element typewriteColor" />
            </h2>
            <br />
            <br />
            <p style={aligncenter}>
              Parents’ education for thriving children <br />{" "}
            </p>
            <br />

            <SignupDialog
              title="Sign Up now! It's free"
              primary1Color={true}
              lock={this.lock}
            />
            <br />
            <br />
            <p style={aligncenter}>
              Already using Inspired Platform? <a onClick={this.openLogin}>Login</a>
            </p>
          </div>
          <br />
          <br />
          <br />

          <div className="secondPage">
            <h4 style={aligncentercollaborate}>
              Easier to communicate and collaborate<br />
            </h4>
            <br />
            <br />
            <img src="noticeboard2.png" alt="Mountain View" style={styleimg} />
          </div>

          <div className="fourthPage">
            <h2 style={style}>What are you waiting for?</h2>

            <br />
            <br />
            <br />
            <p style={aligncenter}>
              Sign Up for free and enjoy all the exclusive features<br />of
              InsiprEd
            </p>
            <br />
            <br />
            <SignupDialog
              title="Sign Up now! It's free"
              primary1Color={true}
              lock={this.lock}
            />
            <br />
            <br />
            <br />
            <p style={aligncenter}>
              Already using InspirEd? <a onClick={this.openLogin}>Login</a>
            </p>
            <br />
            <br />
            <div>
              <a>&nbsp; Tour &nbsp;</a>
              <a>&nbsp; Blog &nbsp;</a>
              <a>&nbsp; About &nbsp;</a>
              <a>&nbsp; Help &nbsp;</a>
            </div>
            <br />
            <br />
            <p>&copy; copyright 2018 Inspired</p>
          </div>

          {/*</Scrollbars>*/}
        </div>
      </MuiThemeProvider>
    );
  }
}
//  <RaisedButton onTouchTap={this.openLogin} />
//           <div className="thirdPage">
//             <br />
//             <h1>How it works?</h1>
//             <br />
//             <p style={aligncenter}>
//               Watch the simple one minute explainer for<br /> kolaboard{" "}
//             </p>
//             <br />
//             {/*<video width="450" controls>
//   <source src="test.mp4" type="video/mp4"/>
// </video>*/}
//             {/*
//   <object data="https://youtu.be/M1kz70Vgm94"
//    width="450" height="315"></object>*/}

//             <iframe
//               width="600"
//               height="315"
//               src="https://www.youtube.com/embed/xky48zyL9iA"
//               frameborder="0"
//               allowfullscreen
//             />
//             <br />
//             <br />
//           </div>

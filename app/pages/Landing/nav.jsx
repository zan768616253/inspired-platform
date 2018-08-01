import React from 'react'
import {orange500} from "material-ui/styles/colors";

export default class NewNav extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const optionsLogin = {
      languageDictionary: {
        emailInputPlaceholder: "something@youremail.com",
        title: "Log In"
      },
      allowSignUp: false,
      theme: {
        logo: "inspired_logo_big.png",
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
        logo: "inspired_logo_big.png",
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

  componentDidMount(){
      this.lockLogin.show()
  }

  render() {
    return (
      <div />
    )
  }
}

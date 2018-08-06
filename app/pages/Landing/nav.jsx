import React from 'react'
import Auth0Lock from "auth0-lock";

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
        primaryColor: '#f39312'
      },
      auth: {
          params: {
              scope: 'openid profile email'
          }
      },
      allowedConnections: ['google-oauth2', 'facebook']
    };

    const optionsSignup = {
      languageDictionary: {
        emailInputPlaceholder: "something@youremail.com",
        title: "Sign Up"
      },
      allowLogin: false,

      theme: {
        logo: "inspired_logo_big.png",
        primaryColor: '#f39312'
      },
      auth: {
          params: {
              scope: 'openid profile email'
          }
      },
      allowedConnections: ['google-oauth2', 'facebook']
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

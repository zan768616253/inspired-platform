import React from "react"
import ReactDOM from "react-dom"
import {
  Route,
  Router,
  browserHistory,
} from "react-router";

import Main from './pages/MainPage/main'
import injectTapEventPlugin from "react-tap-event-plugin";
import FirstPage from "./pages/Landing/firstpage.jsx";
import Profile from "./pages/ProfilePage/profile.jsx";
import { requireVerification } from "../auth.js";

$(document).foundation()
injectTapEventPlugin()

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={FirstPage}>{" "}</Route>
    <Route path="/app" component={Main} onEnter={requireVerification} />
    <Route path="/profile" component={Profile} />
  </Router>,
  document.getElementById("app")
);

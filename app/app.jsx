var React = require("react");
var ReactDOM = require("react-dom");
var {
  Route,
  Router,
  browserHistory,
} = require("react-router");

import Main from './pages/MainPage/main'
import injectTapEventPlugin from "react-tap-event-plugin";
import FirstPage from "./components/firstpage.jsx";
import Verify from "./components/authentication/verify.jsx";
import { requireAuth, requireVerification, redirect } from "../auth.js";
import Profile from "./pages/ProfilePage/profile.jsx";

$(document).foundation();
injectTapEventPlugin();

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={FirstPage} onEnter={redirect}>
      {" "}
    </Route>
    <Route path="/app" component={Main} onEnter={requireVerification} />
    <Route path="/profile" component={Profile} />

    <Route path="/verify" component={Verify} onEnter={requireAuth} />
  </Router>,
  document.getElementById("app")
);

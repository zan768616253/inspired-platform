var React = require("react");
var ReactDOM = require("react-dom");
var {
  Route,
  Router,
  hashHistory,
  browserHistory,
  IndexRoute
} = require("react-router");
var Main = require("Main");
import injectTapEventPlugin from "react-tap-event-plugin";
import FirstPage from "./components/firstpage.jsx";
import Verify from "./components/authentication/verify.jsx";
import { requireAuth, requireVerification, redirect } from "../auth.js";
import NotFound from "./components/dashboard/NotFound.jsx";
import TimeTable from "./components/dashboard/timetable.jsx";
import Settings from "./components/dashboard/settings.jsx";
import Profile from "./components/dashboard/profile.jsx";
import PrivateNotes from "./components/dashboard/privatenotes.jsx";
import Events from "./components/dashboard/events.jsx";
import Invites from "././components/dashboard/invites.jsx";
//load foundation

$(document).foundation();
injectTapEventPlugin();

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={FirstPage} onEnter={redirect}>
      {" "}
    </Route>
    <Route path="/app" component={Main} onEnter={requireVerification} />
    <Route path="/timetable" component={TimeTable} />
    <Route path="/events" component={Events} />
    <Route path="/notes" component={PrivateNotes} />
    <Route path="/settings" component={Settings} />
    <Route path="/profile" component={Profile} />
    <Route path="/invites" component={Invites} />

    <Route path="/verify" component={Verify} onEnter={requireAuth} />
    <Route path="*" component={NotFound} />
  </Router>,
  document.getElementById("app")
);

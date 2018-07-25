import React from "react";
import Nav from "./nav.jsx";
import Homepage from "../pages/LandingPage/homepage.jsx";
import { Scrollbars } from "react-custom-scrollbars";

var FirstPage = props => {
  return (
    <Scrollbars
      style={{ height: "100vh" }}
      renderTrackHorizontal={props => (
        <div
          {...props}
          className="track-horizontal"
          style={{ display: "none" }}
        />
      )}
      renderThumbHorizontal={props => (
        <div
          {...props}
          className="thumb-horizontal"
          style={{ display: "none" }}
        />
      )}
    >
      <Nav />
      <Homepage />
    </Scrollbars>
  );
};

export default FirstPage;

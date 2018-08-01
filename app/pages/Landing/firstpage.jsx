import React from "react";
import Nav from "./nav.jsx";
import { Scrollbars } from "react-custom-scrollbars";

const FirstPage = props => {
  return (
    <Scrollbars style={{ height: "100vh" }}>
      <Nav />
    </Scrollbars>
  );
};

export default FirstPage;

import React from "react";
import { Link } from "react-router-dom";

export default class First extends React.Component {
  render() {
    return (
      <div>
        <Link to="/">micro react home</Link>
        <div>second</div>
      </div>
    );
  }
}

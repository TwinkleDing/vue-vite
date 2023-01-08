import React from "react";
import { Link } from "react-router-dom";

export default class First extends React.Component {
  render() {
    return (
      <div>
        <div>second</div>
        <Link to="/">home</Link>
      </div>
    );
  }
}

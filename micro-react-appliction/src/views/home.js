import React from "react";
import { Link } from "react-router-dom";

export default class First extends React.Component {
  render() {
    return (
      <div>
        <div>micro react app home</div>
        <Link to="/first">first</Link> | 
        <Link to="/second">second</Link>
      </div>
    );
  }
}

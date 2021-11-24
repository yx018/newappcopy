import React, { Component } from "react";

export default class Zone extends Component {
  render() {

    return (
      <div >
        <h2 >
          <a href="#">
            {" "}
            {this.props.currentZone.name}{" "}
          </a>
        </h2>
        <span className="detail"> {this.props.currentZone.zipCodes} </span>{" "}
        <br />
        <span className="detail">
          {" "}
          {this.props.currentZone.numComments} comments{" "}
        </span>
      </div>
    );
  }
}
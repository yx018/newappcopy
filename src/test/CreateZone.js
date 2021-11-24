import React, { Component } from "react";

export default class CreateZone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zone: {
        name: "",
        zipCode: "",
      },
    };
  }

  updateZone(event) {
    let updated = Object.assign({}, this.state.zone);
    updated[event.target.id] = event.target.value;
    this.setState({
      zone: updated,
    });
  }

  submitZone(event) {
    console.log("SubmitZone: " + JSON.stringify(this.state.zone));
    this.props.onCreate(this.state.zone);
  }

  render() {
    return (
      <div>
        <input
          onChange={this.updateZone.bind(this)}
          className="form-control"
          id="name"
          type="text"
          placeholder="Name"
        />{" "}
        <br />
        <input
          onChange={this.updateZone.bind(this)}
          className="form-control"
          id="zipCode"
          type="text"
          placeholder="Zip Code"
        />{" "}
        <br />
        <input
          onClick={this.submitZone.bind(this)}
          className="btn btn-danger"
          type="submit"
          value="Submit Zone"
        />
      </div>
    );
  }
}
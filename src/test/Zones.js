import React, { Component } from "react";
// import superagent from "superagent";
import CreateZone from "./CreateZone";
import Zone from "./Zone";

export default class Zones extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
    };
  }

  componentDidMount() {
    console.log("componentDidMount");
    // superagent
    //   .get("/api/zone")
    //   .query(null)
    //   .set("Accept", "application/json")
    //   .end((err, response) => {
    //     if (err) {
    //       alert("ERROR: " + err);
    //       return;
    //     }
    //     console.log(JSON.stringify(response.body));
    //     let results = response.body.results;
    //     this.setState({
    //       list: results,
    //     });
    //   });
  }

  addZone(zone) {
    let updatedZone = Object.assign({}, zone);
    updatedZone["zipCodes"] = updatedZone.zipCode.split(",");
    console.log("ADD ZONE: " + JSON.stringify(updatedZone));

    // superagent
    //   .post("/api/zone")
    //   .send(updatedZone)
    //   .set("Accept", "application/json")
    //   .end((err, response) => {
    //     if (err) {
    //       alert("ERROR: " + err.message);
    //       return;
    //     }
    //     console.log("ZONE CREATED: " + JSON.stringify(response));
    //     let updatedList = Object.assign([], this.state.list);
    //     updatedList.push(response.result);
    //     this.setState({
    //       list: updatedList,
    //     });
    //   });
  }

  render() {
    const listItems = this.state.list.map((zone, i) => {
      return (
        <li key={i}>
          {" "}
          <Zone currentZone={zone} />{" "}
        </li>
      );
    });

    return (
      <div>
        <ol>{listItems}</ol>
        <CreateZone onCreate={this.addZone.bind(this)} />
      </div>
    );
  }
}
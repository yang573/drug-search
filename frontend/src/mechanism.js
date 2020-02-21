import React from 'react';

const search_route = "http://localhost:5000/search";

class Mechanism extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      uuid: this.props.match.params.uuid,
      name: "Loading..."
    }

    this.get_info();
  }

  async get_info() {
    this.setState({"name": "Hello"});
  }

  render() {
    return (
      <div>
        <h2>{this.state.name}</h2>
        <h3>UUID: {this.state.uuid}</h3>
      </div>
    );
  }
}

export default Mechanism;

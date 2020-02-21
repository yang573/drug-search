import React from 'react';
import {
  Link
} from "react-router-dom";

const search_route = "http://localhost:5000/search";

class Home extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      query: "",
      results: []
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleChange(e) {
    console.log(e);
    await this.setState({ query: e.target.value });

    if (!this.state.query) {
      this.setState({results: []});
      return;
    }

    let req = {
      query: this.state.query,
      suggest: true
    };

    let resp = await fetch(search_route, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req)
    });

    let data = await resp.json();
    console.log(data);

    this.setState({results: data["results"]});
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log("This is unsupported");

//    if (!this.state.query)
//      return;
//
//    let req = {
//      query: this.state.query,
//      suggest: false
//    };
//
//    let resp = await fetch(search_route, {
//      method: 'POST',
//      headers: {
//        'Content-Type': 'application/json'
//      },
//      body: JSON.stringify(req)
//    });
//
//    let data = await resp.json();
//    console.log(data);
//
//    this.setState({results: data["results"]});
  }

  render() {
    return (
      <div>
        <h2>Drug Search</h2>
        <form id="search_form" onSubmit={this.handleSubmit}>
          <input
            id="search_query"
            onChange={this.handleChange}
            value={this.state.query}
          />
          <button>Go</button>
        </form>

        <Results results={this.state.results}/>
      </div>
    );
  }
}

class Results extends React.Component{
  render() {
    let results = this.props.results;
    let list = [];

    for (let r of results) {
      let route = r["isDrug"] ? "/drug/record/" : "/drug/mechanism/";
      let tag = r["isDrug"] ? " (Drug)" : " (Mechanism)";
      list.push(
        <li>
          <Link to={route + r["uuid"]}>{r["name"] + tag}</Link>
        </li>
      );
    }

    return (
      <ul>
        {list}
      </ul>
    )
  }
}

export default Home;

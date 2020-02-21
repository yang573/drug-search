import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Home from './home';
import Record from './record';
import Mechanism from './mechanism';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/home">
          <Home />
        </Route>

        <Route path="/drug/record/:uuid" component={Record} />
        <Route path="/drug/mechanism/:uuid" component={Mechanism} />
      </Switch>
    </Router>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);


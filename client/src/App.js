import React, { } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';

import Plans from "../src/pages/Plans/Plans";
import Error from "../src/pages/Error/Error";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={Plans} />
          <Route component={Error} />
        </Switch>
      </div>
    </Router >
  );
}

export default App;

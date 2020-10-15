import React, { } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';

import Plans from "../src/pages/Plans/Plans";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={Plans} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;

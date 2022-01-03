import React, { } from 'react';
import { getCookie } from "./sharedFunctions/sharedFunctions";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';

import Plans from "./pages/Plans/Plans";
import PlanDetails from "./pages/PlanDetails/PlanDetails";
import DummyDNDList from "./pages/DummyDNDList/DummyDNDList";
import Login from './pages/Login/Login';
import CreateAccountRequest from './pages/CreateAccountRequest/CreateAccountRequest';
import CreateAccount from './pages/CreateAccount/CreateAccount';
import ResetPasswordRequest from './pages/ResetPasswordRequest/ResetPasswordRequest';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import AccountOrg from './pages/AccountOrg/AccountOrg';
import Error from './pages/Error/Error';
import NoAccess from './pages/NoAccess/NoAccess';
import moment from 'moment';

var client = {
  account_id: "",
  session_token: "",
  auth_expiry: ""
}

const setClientTokenObject = () => {
  client = {
    account_id: getCookie("account_id"),//getCookie("user_token"),
    session_token: getCookie("session_access_token"),
    auth_expiry: getCookie("auth_expiry")
  }
}

function App() {

  setClientTokenObject();

  const checkTokenExpiration = () => {
    setClientTokenObject();

    if (client.account_id && client.auth_expiry) {

      let authSecondsRemaining = moment(client.auth_expiry).diff(moment(), 'seconds');

      if (authSecondsRemaining === 300) {
        //alert("Only five minutes remain on this session before you are automatically logged out. Would you like to stay logged in?");
        let openModalButton = document.getElementById("open-auth-timeout-modal-btn");

        openModalButton.click();

      } else if (authSecondsRemaining === 0) {
        document.cookie = "user_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        window.location.href = "/";
      }
    }
  };

  setInterval(checkTokenExpiration, 1000);

  if (client.account_id) {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/create-account" component={CreateAccount} />
            <Route exact path="/reset-password-request" component={ResetPasswordRequest} />
            <Route exact path="/reset-password" component={ResetPassword} />
            <Route exact path="/" component={Plans} />
            <Route exact path="/plan/:id" component={PlanDetails} />
            <Route exact path="/DummyDNDList/:id" component={DummyDNDList} />
            <Route exact path="/account-org" component={AccountOrg} />
            <Route component={Error} />
          </Switch>
        </div>
      </Router>
    );
  } else {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/create-account-request" component={CreateAccountRequest} />
            <Route exact path="/create-account" component={CreateAccount} />
            <Route exact path="/reset-password-request" component={ResetPasswordRequest} />
            <Route exact path="/reset-password" component={ResetPassword} />
            <Route component={NoAccess} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;

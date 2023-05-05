import React from "react";
import { getCookie } from "./sharedFunctions/sharedFunctions";
import keys from "./keys";
import { BrowserRouter as Router, Route, Routes, Switch } from "react-router-dom";
import { datadogRum } from "@datadog/browser-rum";
import { datadogLogs } from "@datadog/browser-logs";

import "./App.css";

import Plans from "./pages/Plans/Plans";
import PlanDetails from "./pages/PlanDetails/PlanDetails";
import Login from "./pages/Login/Login";
import CreateAccountRequest from "./pages/CreateAccountRequest/CreateAccountRequest";
import CreateAccount from "./pages/CreateAccount/CreateAccount";
import ResetPasswordRequest from "./pages/ResetPasswordRequest/ResetPasswordRequest";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import AccountOrg from "./pages/AccountOrg/AccountOrg";
import Error from "./pages/Error/Error";
import NoAccess from "./pages/NoAccess/NoAccess";
import moment from "moment";

datadogRum.init({
  applicationId: keys.datadog.app_key_rum,
  clientToken: keys.datadog.client_token_rum,
  service: "daily-planner-client",
  site: keys.datadog.dd_site,
  env: "production",
  version: "1.0.0",
  sampleRate: 100,
  trackInteractions: true,
  trackFrustrations: true,
  allowedTracingUrls:["http://daily-plans.herokuapp.com/"],
  defaultPrivacyLevel: "mask-user-input",
  beforeSend: (event, context) => {
    // collect a RUM resource's response headers
    if (event.type === "resource" && event.resource.type === "xhr") {
      event.context = {
        ...event.context,
        responseHeaders: context.XMLHttpRequest,
      };
    }
  },
});

datadogRum.addRumGlobalContext("test_profile_id", getCookie("account_id"));
datadogRum.setUser({
  profile_id: getCookie("account_id"),
  name: "John Doe",
  email: "john@doe.com",
  plan: "premium",
});

datadogLogs.init({
  clientToken: keys.datadog.client_token_rum,
  site: keys.datadog.dd_site,
  forwardErrorsToLogs: true,
  forwardConsoleLogs: "all",
  sampleRate: 100,
});

datadogRum.startSessionReplayRecording();

var client = {
  account_id: "",
  session_token: "",
  auth_expiry: "",
};

const setClientTokenObject = () => {
  client = {
    account_id: getCookie("account_id"), //getCookie("user_token"),
    session_token: getCookie("session_access_token"),
    auth_expiry: getCookie("auth_expiry"),
  };
};

function App() {
  setClientTokenObject();

  const checkTokenExpiration = () => {
    setClientTokenObject();

    if (client.account_id && client.auth_expiry) {
      let authSecondsRemaining = moment(client.auth_expiry).diff(
        moment(),
        "seconds"
      );

      if (authSecondsRemaining === 300) {
        //alert("Only five minutes remain on this session before you are automatically logged out. Would you like to stay logged in?");
        let openModalButton = document.getElementById(
          "open-auth-timeout-modal-btn"
        );

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
          <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/create-account" element={<CreateAccount />} />
            <Route
              exact
              path="/reset-password-request"
              element={<ResetPasswordRequest />}
            />
            <Route exact path="/reset-password" element={<ResetPassword />} />
            <Route exact path="/" element={<Plans />} />
            <Route exact path="/plan/:id" element={<PlanDetails />} />
            <Route exact path="/account-org" element={<AccountOrg />} />
            <Route element={<Error />} />
          </Routes>
      </Router>
    );
  } else {
    return (
      <Router>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route
              exact
              path="/create-account-request"
              element={<CreateAccountRequest />}
            />
            <Route exact path="/create-account" element={<CreateAccount />} />
            <Route
              exact
              path="/reset-password-request"
              element={<ResetPasswordRequest />}
            />
            <Route exact path="/reset-password" element={<ResetPassword />} />
            <Route element={<NoAccess />} />
          </Routes>
      </Router>
    );
  }
}

export default App;

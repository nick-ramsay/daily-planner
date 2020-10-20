import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
  } from "react-router-dom";
import { useInput } from '../../sharedFunctions/sharedFunctions';
import API from "../../utils/API";
import moment from 'moment';
import GithubLogo from '../../images/github_logos/GitHub_Logo_White.png';
import "./style.css";


const PlanDetails = () => {

    var [planID, setPlanID] = useState(useParams().id);

    useEffect(() => {
     
    }, [])

    return (
        <div>
            <h1>Plan Details</h1>
            <p>The selected plan is: {planID}</p>
        </div>
    )
}

export default PlanDetails;
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
    var PlanID = useParams().id;

    var [Plan, setPlan] = useState({});

    const renderPlan = () => {
        let selectedPlan = PlanID;
        API.findPlan(selectedPlan).then(
            (res) => {
                setPlan(Plan => res.data);
            }
        );
    }

    useEffect(() => {
        renderPlan();
    }, [])

    return (
        <div>
            <h1>Plan Details</h1>
            <h2><strong>"{Plan.plan_name}"</strong></h2>
            <p>The selected plan is: {PlanID}</p>
        </div>
    )
}

export default PlanDetails;
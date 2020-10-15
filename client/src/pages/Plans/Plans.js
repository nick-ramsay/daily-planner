import React, { useState, useEffect } from 'react';
import { useInput } from '../../sharedFunctions/sharedFunctions';
import API from "../../utils/API";
import moment from 'moment';
import GithubLogo from '../../images/github_logos/GitHub_Logo_White.png';
import "./style.css";


const Home = () => {

    var [newPlan, setNewPlan] = useInput("");
    var [Plans, setPlans] = useState([]);

    const renderPlans = () => {
        API.findAllPlans().then(
            (res) => {
                setPlans(Plans => res.data);
            }
        );
    }

    const savePlan = (event) => {
        if (newPlan !== "") {
            API.createPlan(newPlan, new Date()).then(
                (res) => {
                    renderPlans();
                    document.getElementById('planInput').value = "";
                }
            );
        }
    };

    const deletePlan = (event) => {
        let planDeletionID = event.currentTarget.dataset.plan_id;
        API.deleteOnePlan(planDeletionID).then(
            (res) => {
                renderPlans();
            }
        );
    }

    useEffect(() => {
        renderPlans();
    }, [])

    return (
        <div>
            <h2><strong>Daily Planner</strong></h2>
            <div className="container">
                <div className="col-md-12">
                    <form className="mt-3">
                        <div className="form-row text-center">
                            <div className="col">
                                <input type="text" placeholder="Enter your plan here" className="form-control" id="planInput" name="planInput" onChange={setNewPlan} aria-describedby="PlanHelp" />
                            </div>
                        </div>
                        <div className="form-row text-center">
                            <div className="col mt-3">
                                <div type="button" className="btn btn-custom" tabIndex="0" onClick={savePlan}>Submit</div>
                            </div>
                        </div>
                    </form>
                    <p style={{ color: "#e83e8c" }} className="mt-3 mb-1">
                        {Plans.length === 0 ? "No Plans" : Plans.length + (Plans.length > 1 ? " plans" : " plan")}
                    </p>
                    {Plans.map((plan, i) =>
                        <div className="col-md-12 mt-2 mb-2 plan-card" key={i}>
                            <div className="pt-1">
                                <div className="mt-1 mb-1"><h4>{plan.plan_name}</h4></div>
                                <div style={{ color: "#2EA7C8" }} className="mb-2">{moment(plan.created_date).format("DD MMMM YYYY h:mm A")}</div>
                                <div className="btn btn-sm btn-custom-red mb-1 mt-1" data-plan_id={plan._id} onClick={deletePlan}>Delete</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Home;
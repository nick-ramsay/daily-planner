import React, { useState, useEffect, Component } from 'react';
import { useInput } from '../../sharedFunctions/sharedFunctions';
import API from "../../utils/API";
import moment from 'moment';
import GithubLogo from '../../images/github_logos/GitHub_Logo_White.png';
import "./style.css";

import Navbar from "../../component/Navbar/Navbar";


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
            API.createPlan(newPlan, "Open", new Date()).then(
                (res) => {
                    renderPlans();
                    document.getElementById('planInput').value = "";
                }
            );
        }
    };

    useEffect(() => {
        renderPlans();
    }, [])

    return (
        <div>
            <Navbar />
            <div className="container pt-4">
                <div className="pb-2 my-5 mb-4 px-5">
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
                            <div className="container mt-2 mb-2 plan-card" key={i}>
                                <div className="pt-1">
                                    <div className="mt-1 mb-1 text-center"><h4>{'"' + plan.plan_name + '"'}</h4></div>
                                    <div className="mt-1 mb-1 text-center"><h5>{moment(plan.created_date).format("dddd,  DD MMMM YYYY")}</h5></div>
                                    <div className="text-center"><span className="badge badge-primary mt-2 mb-3 p-2" style={{ fontSize: 16 }}>{plan.plan_status}</span></div>
                                    <div>
                                        <a className="btn btn-sm btn-custom mt-1 mb-1" href={'./plan/' + plan._id}>View Tasks</a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;
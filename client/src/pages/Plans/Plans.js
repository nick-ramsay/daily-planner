import React, { useState, useEffect } from 'react';
import HashLoader from "react-spinners/HashLoader";
import { css } from "@emotion/core";
import { useInput } from '../../sharedFunctions/sharedFunctions';
import API from "../../utils/API";
import moment from 'moment';
import "./style.css";

import Navbar from "../../component/Navbar/Navbar";

const override = css`
  display: block;
  margin: 0 auto;
  color: #008000;
  `;

const Home = () => {

    var [loading, setLoading] = useState(true);
    var [newPlan, setNewPlan] = useInput("");
    var [Plans, setPlans] = useState([]);

    const renderPlans = () => {
        API.findAllPlans().then(
            (res) => {
                setPlans(Plans => res.data);
                setLoading(false);
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
                        <form className="mt-3 mb-4">
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
                        <div className="row">
                            <div className="col-md-12">
                                <HashLoader
                                    css={override}
                                    size={100}
                                    color={"#008000"}
                                    loading={loading}
                                />
                            </div>
                        </div>
                        {!loading === true &&
                            <p className="mb-1">
                                <strong>{Plans.length === 0 ? "No Plans" : Plans.length + (Plans.length > 1 ? " plans" : " plan")}</strong>
                            </p>
                        }
                        {!loading === true &&
                            Plans.map((plan, i) =>
                                <div className="container mt-2 mb-2 plan-card" key={i}>
                                    <div className="pt-1">
                                        <div className="mt-1 mb-1 text-center"><h4>{'"' + plan.plan_name + '"'}</h4></div>
                                        <div className="mt-1 mb-1 text-center"><h5>{moment(plan.created_date).format("dddd,  DD MMMM YYYY")}</h5></div>
                                        {(() => {
                                            let openTaskCount = 0;

                                            for (let j = 0; j < plan.tasks.length; j++) {
                                                if (plan.tasks[j].status === "Closed") {
                                                    openTaskCount += 0
                                                } else {
                                                    openTaskCount += 1
                                                }
                                            }

                                            if (openTaskCount > 0) {
                                                return (
                                                    <h6>Status: <span className="badge badge-danger">{openTaskCount} {openTaskCount > 1 ? "tasks" : "task"} open</span></h6>
                                                )
                                            } else if (plan.tasks.length === 0 || plan.tasks === undefined) {
                                                return (
                                                    <h6>Status: <span className="badge badge-warning">New Plan</span></h6>
                                                )
                                            }
                                            else {
                                                return (
                                                    <h6>Status: <span className="badge badge-success">Closed</span></h6>
                                                )
                                            }
                                        }
                                        )()}
                                        <div>
                                            <a className="btn btn-sm btn-custom mt-1 mb-1" href={'./plan/' + plan._id}>View Tasks</a>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Home;
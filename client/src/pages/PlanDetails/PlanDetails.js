import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useParams } from "react-router-dom";
import { useInput } from '../../sharedFunctions/sharedFunctions';
import API from "../../utils/API";
import moment from 'moment';
import GithubLogo from '../../images/github_logos/GitHub_Logo_White.png';
import "./style.css";

import Navbar from "../../component/Navbar/Navbar";


const PlanDetails = () => {
    var PlanID = useParams().id;

    var [Plan, setPlan] = useState({});
    var [newTask, setNewTask] = useInput();

    const renderPlan = () => {
        let selectedPlan = PlanID;
        API.findPlan(selectedPlan).then(
            (res) => {
                setPlan(Plan => res.data);
            }
        );
    }

    const saveTask = () => {
        if (newTask !== "") {
            let PlanData = Plan;
            let newTaskData = {
                description: newTask
            }
            PlanData.tasks.push(newTaskData);

            console.log(Plan);

            API.updatePlanTasks(PlanID, PlanData.tasks).then(
                (res) => {
                    console.log(res);
                    renderPlan();
                }
            )
        }
    }

    const deletePlan = (event) => {
        let planDeletionID = event.currentTarget.dataset.plan_id;
        API.deleteOnePlan(planDeletionID).then(
            (res) => {
                renderPlan();
                window.location = "/"
            }
        );
    }

    useEffect(() => {
        renderPlan();
    }, [])

    return (
        <div>
            <Navbar />
            <div className="container pt-4">
                <div className="pb-2 my-5 mb-4 px-5">
                    <div className="col-md-12 bg-white">
                        <h2><strong>{'"' + Plan.plan_name + '"'}</strong></h2>
                        <p>The selected plan is: {PlanID}</p>
                        <form className="mt-3">
                            <div className="form-row text-center">
                                <div className="col">
                                    <input type="text" placeholder="Enter your task here" className="form-control" id="taskInput" name="taskInput" onChange={setNewTask} aria-describedby="taskHelp" />
                                </div>
                            </div>
                            <div className="form-row text-center">
                                <div className="col mt-3">
                                    <div type="button" className="btn btn-custom" tabIndex="0" onClick={saveTask}>Save Task</div>
                                </div>
                            </div>
                        </form>
                        {/*<div className="btn btn-sm btn-custom-red mb-1 mt-1" data-plan_id={PlanID} onClick={deletePlan}>Delete Task</div>*/}
                        <div>
                            <p>{Plan.tasks != undefined ? Plan.tasks.map((task, i) =>
                                <p>{task.description}</p>
                            ) : ""}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlanDetails;
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
                description: newTask,
                created_date: new Date(),
                status: "Open",
                order: Plan.tasks.length
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
                    <div className="col-md-12 bg-white p-2">
                        <h2><strong>{'"' + Plan.plan_name + '"'}</strong></h2>
                        <h4>{moment(Plan.created_date).format("dddd,  DD MMMM YYYY")}</h4>
                        <button type="button" className="btn btn-custom" data-toggle="modal" data-target="#newTaskModal">
                            New Task
                        </button>
                        <div class="modal fade" id="newTaskModal" tabindex="-1" aria-labelledby="newTaskModalLabel" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="newTaskModalLabel">Enter a New Task</h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                        <form className="mt-3">
                                            <div className="form-row text-center">
                                                <div className="col">
                                                    <input type="text" placeholder="Enter your task description here" className="form-control" id="taskInput" name="taskInput" onChange={setNewTask} aria-describedby="taskHelp" />
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                        <button type="button" className="btn btn-custom" onClick={saveTask}>Save changes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*<div className="btn btn-sm btn-custom-red mb-1 mt-1" data-plan_id={PlanID} onClick={deletePlan}>Delete Task</div>*/}
                        <div>
                            <p>{Plan.tasks != undefined ? Plan.tasks.map((task, i) =>
                                <div className="card mb-1 mt-1 p-2 text-left">
                                    <h4>{(i + 1) + ". " + task.description + "  "}{task.status === "Closed" ? <span class="badge badge-success">{task.status}</span>:<span class="badge badge-warning">{task.status}</span>}</h4>
                                    <p>{moment(task.created_date).format("DD MMMM YYYY, h:mm A")}</p>
                                </div>
                            ) : ""}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlanDetails;
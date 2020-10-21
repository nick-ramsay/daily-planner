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
    var [newTaskDescription, setNewTaskDescription] = useInput();

    var [taskHoursLogged, setTaskHoursLogged] = useInput();
    var [taskStatus, setTaskStatus] = useInput();

    const renderPlan = () => {
        let selectedPlan = PlanID;
        API.findPlan(selectedPlan).then(
            (res) => {
                setPlan(Plan => res.data);
            }
        );
    }

    const saveTask = () => {
        if (newTaskDescription !== "") {
            let PlanData = Plan;
            let newTaskData = {
                description: newTaskDescription,
                created_date: new Date(),
                status: "Open",
                order: Plan.tasks.length,
                hoursLogged: 0
            }
            PlanData.tasks.push(newTaskData);

            API.updatePlanTasks(PlanID, PlanData.tasks).then(
                (res) => {
                    console.log(res);
                    renderPlan();
                }
            )
        }
    }

    const updateTask = () => {

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
                        <div className="modal fade" id="newTaskModal" tabindex="-1" aria-labelledby="newTaskModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="newTaskModalLabel">Enter a New Task</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <form className="mt-3">
                                            <div className="form-row text-center">
                                                <div className="col">
                                                    <input type="text" placeholder="Enter your task description here" className="form-control" id="taskInput" name="taskInput" onChange={setNewTaskDescription} aria-describedby="taskHelp" />
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
                        <div>
                            <p>{Plan.tasks != undefined ? Plan.tasks.map((task, i) =>
                                <div className="card mb-1 mt-1 p-2">
                                    <h5>{"#" + (i + 1) + ": " + task.description}</h5>
                                    <span>{moment(task.created_date).format("DD MMMM YYYY, h:mm A")}</span>
                                    <div>
                                        {task.status === "Closed" ? <h3><span className="badge badge-success">{task.status}</span></h3> : <h5><span className="badge badge-warning">{task.status}</span></h5>}
                                    </div>
                                    <div>
                                        <button className="btn btn-sm btn-custom" type="button" data-toggle="collapse" data-target={"#taskDetails" + i} aria-expanded="false" aria-controls={"taskDetails" + task + i}>
                                            Task Details
                                        </button>
                                    </div>
                                    <div className="collapse" id={"taskDetails" + i}>
                                        <form>
                                            <div className="form-row">
                                                <div className="form-group col-md-6">
                                                    <label for="inputState">Status</label>
                                                    <select id="inputState" className="form-control" defaultValue={task.status} onChange={setTaskStatus}>
                                                        <option>Closed</option>
                                                        <option>Open</option>
                                                        <option>In Progress</option>
                                                    </select>
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label for="taskHoursLogged">Hours Logged</label>
                                                    <input type="number" className="form-control" id="taskHoursLogged" step=".1" min="0" defaultValue={task.hoursLogged} onChange={setTaskHoursLogged} />
                                                </div>
                                            </div>
                                            <button type="button" className="btn btn-sm btn-custom" onClick={updateTask}>Update</button>
                                        </form>
                                    </div>
                                </div>
                            ) : ""}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default PlanDetails;
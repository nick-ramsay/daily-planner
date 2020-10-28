import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useParams } from "react-router-dom";
import { useInput } from '../../sharedFunctions/sharedFunctions';
import API from "../../utils/API";
import moment from 'moment';
import upArrow from '../../images/baseline_keyboard_arrow_up_black_48dp.png';
import downArrow from '../../images/baseline_keyboard_arrow_down_black_48dp.png';
import deleteIcon from '../../images/outline_remove_circle_outline_black_48dp.png';
import "./style.css";

import Navbar from "../../component/Navbar/Navbar";


const PlanDetails = () => {
    var PlanID = useParams().id;

    var [Plan, setPlan] = useState({});
    var [newTaskDescription, setNewTaskDescription] = useInput();
    var [totalHoursAllowed, setTotalHoursAllowed] = useState(8);
    var [totalHoursLogged, setTotalHoursLogged] = useState(0);

    var [taskHoursLogged, setTaskHoursLogged] = useInput();
    var [taskStatus, setTaskStatus] = useInput();

    const calculateTotalHoursLogged = (PlanData) => {
        console.log("Called calcTotalHours");
        let totalHours = 0;
        console.log(PlanData.tasks);
        for (let i = 0; i < PlanData.tasks.length; i++) {
            totalHours += Number(PlanData.tasks[i].hoursLogged);
        };
        setTotalHoursLogged(totalHoursLogged => totalHours);
    }

    const renderPlan = () => {
        let selectedPlan = PlanID;
        API.findPlan(selectedPlan).then(
            (res) => {
                setPlan(Plan => res.data);
                calculateTotalHoursLogged(res.data);
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
                hoursLogged: 0,
                jiras: []
            }
            PlanData.tasks.push(newTaskData);

            API.checkExistingTasks(PlanID, newTaskDescription).then(
                (res) => {
                    console.log("Called checkExistingTasks API");
                    console.log(res);
                    renderPlan();
                }
            );

            API.updatePlanTasks(PlanID, PlanData.tasks).then(
                (res) => {
                    console.log(res);
                    document.getElementById("taskInput").value = "";
                    renderPlan();
                }
            )
        }
    }

    const updateTask = (event) => {
        let taskArrayPosition = event.currentTarget.dataset.task_array_position;
        let taskDescription = document.getElementById("taskDescription" + taskArrayPosition).innerHTML;
        let newHoursLogged = document.getElementById("taskHoursLogged" + taskArrayPosition).value;
        let newStatus = document.getElementById("taskStatus" + taskArrayPosition).value;


        API.checkExistingTasks(PlanID, newTaskDescription).then(
            (res) => {
                console.log("Called checkExistingTasks API");
                console.log(res);
                renderPlan();
            }
        );

        API.updateTask(PlanID, taskDescription, taskArrayPosition, newHoursLogged, newStatus).then(
            (res) => {
                console.log(res);
                renderPlan();
            }
        )
    }

    const linkJIRA = (event) => {
        let taskArrayPosition = event.currentTarget.dataset.task_array_position;
        let taskDescription = document.getElementById("taskDescription" + taskArrayPosition).innerHTML;
        let linkJIRAID = document.getElementById("linkJIRAInput" + taskArrayPosition).value;

        console.log(linkJIRAID);
        API.linkJIRA(PlanID, taskDescription, taskArrayPosition, linkJIRAID).then(
            (res) => {
                renderPlan();
                document.getElementById("linkJIRAInput" + taskArrayPosition).value = "";
            }
        )
    }

    useEffect(() => {
        renderPlan();
    }, [])

    return (
        <div>
            <Navbar />
            <div className="container bg-white pt-4">
                <div className="pb-2 my-5 mb-4 px-5">
                    <div className="col-md-12 p-2">
                        <h2><strong>{'"' + Plan.plan_name + '"'}</strong></h2>
                        <h4>{moment(Plan.created_date).format("dddd,  DD MMMM YYYY")}</h4>
                        <h5><strong>{totalHoursLogged} hours logged</strong></h5>
                        <div class="progress mt-2 mb-2">
                            <div class="progress-bar bg-custom" role="progressbar" style={{ width: (totalHoursLogged / 8 * 100) + "%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <p>You {(totalHoursAllowed - totalHoursLogged > 0) ? "have" : "are"} {(Math.abs(totalHoursAllowed - totalHoursLogged).toFixed(2))} {(totalHoursAllowed - totalHoursLogged === 1) ? "hour" : "hours"} {(totalHoursAllowed - totalHoursLogged >= 0) ? "remaining." : "overtime."} {(totalHoursAllowed - totalHoursLogged < 0) ? "Overachiever!" : (8 - totalHoursLogged === 0) ? "Congrats! You're done!" : ""} </p>
                        <button type="button" className="btn btn-sm btn-custom" data-toggle="modal" data-target="#newTaskModal">
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
                                        <button type="button" className="btn btn-custom" onClick={saveTask} data-toggle="modal" data-target="#newTaskModal">Save Task</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div>{Plan.tasks !== undefined ? Plan.tasks.map((task, i) =>
                                <div className="card mb-1 mt-1 p-2">
                                    <div className="row">
                                        <div className="col-md-11">
                                            <div className="row">
                                                <div className="col-md-12 text-left">
                                                    <h5><strong>{"#" + (i + 1) + ": "}<span id={"taskDescription" + i}>{task.description}</span></strong></h5>
                                                </div>
                                            </div>
                                            <div className="row mb-2">
                                                <div className="col-md-12 text-left">
                                                    {task.jiras !== undefined ? task.jiras.map(
                                                        (jira, i) =>
                                                            <span className="jiraLinkPill mr-3"><a className="jiraLinks" href={"https://jira.iscinternal.com/browse/" + jira} title={"Go to JIRA " + jira} target="_blank" rel="noopener noreferrer">{jira}</a> <img className="deleteIcon ml-1" alt="deleteIcon" title={"Remove JIRA " + jira} src={deleteIcon}></img></span>
                                                    ) : ""
                                                    }
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4 text-left">
                                                    <h6><span>Created: {moment(task.created_date).format("DD MMMM YYYY, h:mm A")}</span></h6>
                                                </div>
                                                <div className="col-md-4 text-left">
                                                    <div>
                                                        {(() => {
                                                            switch (task.status) {
                                                                case "Closed":
                                                                    return (
                                                                        <h6>Status: <span className="badge badge-success">{task.status}</span></h6>
                                                                    )
                                                                case "Open":
                                                                    return (
                                                                        <h6>Status: <span className="badge badge-primary">{task.status}</span></h6>
                                                                    )
                                                                case "In Progress":
                                                                    return (
                                                                        <h6>Status: <span className="badge badge-warning">{task.status}</span></h6>
                                                                    )
                                                                case "Pending Feedback":
                                                                    return (
                                                                        <h6>Status: <span className="badge badge-info">{task.status}</span></h6>
                                                                    )
                                                                case "Punted":
                                                                    return (
                                                                        <h6>Status: <span className="badge badge-secondary">{task.status}</span></h6>
                                                                    )
                                                                default:
                                                                    return (
                                                                        <h6>Status: <span className="badge badge-dark">{task.status}</span></h6>
                                                                    )
                                                            }
                                                        }
                                                        )()}
                                                    </div>
                                                </div>
                                                <div className="col-md-4 text-left">
                                                    <h6>Hours Logged: {task.hoursLogged + (task.hoursLogged === 1 ? " hour" : " hours")}</h6>
                                                </div>
                                            </div>
                                            <div className="collapse" id={"taskDetails" + i}>
                                                <form>
                                                    <div className="form-row text-center mt-3 mb-0">
                                                        <div className="col-md-12">
                                                            <button type="button" className="btn btn-sm btn-custom" data-plan_id={Plan._id} data-task_array_position={i} onClick={updateTask} data-toggle="collapse" data-target={"#taskDetails" + i} aria-expanded="false" aria-controls={"taskDetails" + task + i}>Update</button>
                                                        </div>
                                                    </div>
                                                    <div className="form-row">
                                                        <div className="form-group col-md-6">
                                                            <label for="inputState">Status</label>
                                                            <select id={"taskStatus" + i} className="form-control" defaultValue={task.status} onChange={setTaskStatus}>
                                                                <option>Closed</option>
                                                                <option>Open</option>
                                                                <option>In Progress</option>
                                                                <option>Pending Feedback</option>
                                                                <option>Punted</option>
                                                            </select>
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label for="taskHoursLogged">Hours Logged</label>
                                                            <input type="number" className="form-control" id={"taskHoursLogged" + i} step=".1" min="0" defaultValue={task.hoursLogged} onChange={setTaskHoursLogged} />
                                                        </div>
                                                    </div>
                                                    <div className="form-row">
                                                        <div className="form-group col-md-6">
                                                            <label for="taskHoursLogged">Link JIRA</label>
                                                            <input type="text" className="form-control" id={"linkJIRAInput" + i} />
                                                            <button className="btn btn-sm btn-custom-blue mt-1" id="linkJIRAButton" type="button" data-task_array_position={i} data-plan_id={Plan._id} onClick={linkJIRA}>Add</button>
                                                        </div>
                                                        <div className="form-gorup col-md-6">
                                                            <div>
                                                                <button type="submit" className="btn btn-sm m-2 arrow-btn" id={"moveTaskUpBtn" + i}><img className="arrowIcon" alt="upArrowIcon" src={upArrow}></img> Move Up</button>
                                                            </div>
                                                            <div>
                                                                <button type="submit" className="btn btn-sm m-2 arrow-btn" id={"moveTaskDownBtn" + i}><img className="arrowIcon" alt="downArrowIcon" src={downArrow}></img> Move Down</button>
                                                            </div>

                                                        </div>
                                                    </div>

                                                </form>
                                            </div>
                                            
                                        </div>
                                        <div className="col-md-1 mt-auto mb-auto">
                                                <div>
                                                    <button className="btn btn-sm btn-custom-blue" type="button" data-toggle="collapse" data-target={"#taskDetails" + i} aria-expanded="false" aria-controls={"taskDetails" + task + i}>
                                                        Edit
                                                     </button>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                            ) : ""}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default PlanDetails;
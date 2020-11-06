import React, { useState, useEffect } from 'react';
import BarLoader from "react-spinners/BarLoader";
import HashLoader from "react-spinners/HashLoader";
import { css } from "@emotion/core";
import { BrowserRouter as Router, useParams } from "react-router-dom";
import { useInput } from '../../sharedFunctions/sharedFunctions';
import API from "../../utils/API";
import moment from 'moment';
import upArrow from '../../images/baseline_keyboard_arrow_up_black_48dp.png';
import downArrow from '../../images/baseline_keyboard_arrow_down_black_48dp.png';
import deleteIcon from '../../images/thin_minus_icon.png';
import "./style.css";

import Navbar from "../../component/Navbar/Navbar";

const override = css`
  display: block;
  margin: 0 auto;
  color: #008000;
  `;

const PlanDetails = () => {
    var PlanID = useParams().id;
    var [importablePlans, setImportablePlans] = useState([]);
    var [selectedImportPlan, setSelectedImportPlan] = useState("");

    var [loading, setLoading] = useState(true);
    var [jiraLinksLoading, setJiraLinksLoading] = useState(false);
    var [Plan, setPlan] = useState({});
    var [newTaskDescription, setNewTaskDescription] = useInput();
    var [totalHoursAllowed, setTotalHoursAllowed] = useState(8);
    var [totalHoursLogged, setTotalHoursLogged] = useState(0);

    var [taskDescription, setTaskDescription] = useInput();
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
        API.findImportableTasks().then(
            (res) => {
                console.log(res);
                setImportablePlans(importablePlans => res.data);
            }
        );
        API.findPlan(selectedPlan).then(
            (res) => {
                setLoading(loading => false);
                setJiraLinksLoading(jiraLinksloading => false);
                setPlan(Plan => res.data);
                calculateTotalHoursLogged(res.data);
            }
        );
    }

    const selectImportPlan = (event) => {
        let selectedPlanID = event.target.options[event.target.selectedIndex].dataset.selected_plan_id;
        console.log(selectedPlanID);
        setSelectedImportPlan(selectedImportPlan => selectedPlanID);
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

    const hideEditBtn = (event) => {
        let taskArrayIndex = event.currentTarget.dataset.task_array_index;

        document.getElementById("editTaskBtn" + taskArrayIndex).classList.add("d-none");
        document.getElementById("saveTaskBtn" + taskArrayIndex).classList.remove("d-none");
        //document.getElementById("moveTaskBtns" + taskArrayIndex).classList.remove("d-none");
    }

    const showEditBtn = (event) => {
        let taskArrayIndex = event.currentTarget.dataset.task_array_index;
        document.getElementById("editTaskBtn" + taskArrayIndex).classList.remove("d-none");
        document.getElementById("saveTaskBtn" + taskArrayIndex).classList.add("d-none");
        //document.getElementById("moveTaskBtns" + taskArrayIndex).classList.add("d-none");
    }

    const updateTask = (event) => {
        let taskArrayPosition = event.currentTarget.dataset.task_array_position;
        let taskDescription = document.getElementById("taskDescription" + taskArrayPosition).innerHTML;
        let newHoursLogged = document.getElementById("taskHoursLogged" + taskArrayPosition).value;
        let newStatus = document.getElementById("taskStatus" + taskArrayPosition).value;
        let newTaskDescription = document.getElementById("updatedTaskDescription" + taskArrayPosition).value;

        console.log(newTaskDescription)


        API.checkExistingTasks(PlanID, newTaskDescription).then(
            (res) => {
                console.log("Called checkExistingTasks API");
                console.log(res);
                renderPlan();
            }
        );

        API.updateTask(PlanID, taskDescription, taskArrayPosition, newHoursLogged, newStatus, newTaskDescription).then(
            (res) => {
                renderPlan();
            }
        )

        document.getElementById("saveTaskBtn" + taskArrayPosition).classList.add("d-none");
        document.getElementById("editTaskBtn" + taskArrayPosition).classList.remove("d-none");
        //document.getElementById("moveTaskBtns" + taskArrayPosition).classList.add("d-none");

    }

    const linkJIRA = (event) => {
        setJiraLinksLoading(jiraLinksLoading => true);
        let taskArrayPosition = event.currentTarget.dataset.task_array_position;
        let taskDescription = document.getElementById("taskDescription" + taskArrayPosition).innerHTML;
        let linkJIRAID = document.getElementById("linkJIRAInput" + taskArrayPosition).value;

        console.log(linkJIRAID);
        API.linkJIRA(PlanID, taskDescription, taskArrayPosition, linkJIRAID).then(
            (res) => {
                setJiraLinksLoading(jiraLinksLoading => false);
                renderPlan();
                document.getElementById("linkJIRAInput" + taskArrayPosition).value = "";
            }
        )
    }

    const removeJIRA = (event) => {
        setJiraLinksLoading(jiraLinksLoading => true);
        let jiraArrayIndex = event.currentTarget.dataset.jira_array_index;
        let taskArrayIndex = event.currentTarget.dataset.task_array_index;
        let taskDescription = document.getElementById("taskDescription" + taskArrayIndex).innerHTML;
        let jiraArray = Plan.tasks[taskArrayIndex].jiras;

        jiraArray.splice(jiraArrayIndex, 1);

        API.removeJIRA(PlanID, taskDescription, jiraArray).then(
            (res) => {
                setJiraLinksLoading(false);
                renderPlan();
            }
        )
    }

    const moveJira = (event) => {
        let planTasks = Plan.tasks;
        let taskArrayIndex = parseInt(event.currentTarget.dataset.task_array_index);
        let taskDescription = document.getElementById("taskDescription" + taskArrayIndex).innerHTML;
        let moveJiraIncrement = parseInt(event.currentTarget.dataset.move_jira_increment);

        let selectedTask = Plan.tasks[taskArrayIndex];
        let newTaskIndex = (taskArrayIndex + moveJiraIncrement);

        planTasks.splice(taskArrayIndex, 1);
        planTasks.splice(newTaskIndex, 0, selectedTask);

        API.updateTaskOrder(PlanID, taskDescription, planTasks).then(
            (res) => {
                renderPlan();
                for (let i = 0; i < Plan.tasks.length; i++) {
                    document.getElementById("editTaskBtn" + i).classList.remove("d-none");
                    document.getElementById("taskDetails" + i).classList.remove("show");
                    document.getElementById("taskDetails" + i).classList.add("collapse");
                }
            }
        )
    }

    const importPuntedTasks = (event) => {
        let currentTaskDescriptions = [];

        for (let i = 0; i < Plan.tasks.length; i++) {
            currentTaskDescriptions.push(Plan.tasks[i].description);
        }

        API.importPuntedTasks(currentTaskDescriptions).then(
            (res) => {
                console.log(res)
            }
        )
    }

    useEffect(() => {
        renderPlan();
    }, [])

    return (
        <div>
            <Navbar />
            {loading === true &&
                <div className="container pt-4">
                    <div className="pb-2 my-5 mb-4">
                        <HashLoader
                            css={override}
                            size={100}
                            color={"#008000"}
                            loading={loading}
                        />
                    </div>
                </div>
            }
            {!loading === true &&
                <div className="container bg-white pt-4">
                    <div className="pb-2 my-5 mb-4">
                        <div>
                            <h2><strong>{'"' + Plan.plan_name + '"'}</strong></h2>
                            <h4>{moment(Plan.created_date).format("dddd,  DD MMMM YYYY")}</h4>
                            <h5><strong>{totalHoursLogged} hours logged</strong></h5>
                            <div className="progress mt-2 mb-2">
                                <div className="progress-bar bg-custom" role="progressbar" style={{ width: (totalHoursLogged / 8 * 100) + "%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                            <p>You {(totalHoursAllowed - totalHoursLogged > 0) ? "have" : "are"} {(Math.abs(totalHoursAllowed - totalHoursLogged).toFixed(2))} {(totalHoursAllowed - totalHoursLogged === 1) ? "hour" : "hours"} {(totalHoursAllowed - totalHoursLogged >= 0) ? "remaining." : "overtime."} {(totalHoursAllowed - totalHoursLogged < 0) ? "Overachiever!" : (8 - totalHoursLogged === 0) ? "Congrats! You're done!" : ""} </p>
                            <div>
                                <button type="button" className="btn btn-sm btn-custom m-1" data-toggle="modal" data-target="#newTaskModal">
                                    New Task
                        </button>
                            </div>
                            <div>
                                <a className="custom-hyperlink text-center" data-toggle="modal" data-target="#importPuntedModal">
                                    Import Punted Tasks
                                </a>
                            </div>
                            <div className="modal fade" id="newTaskModal" tabIndex="-1" aria-labelledby="newTaskModalLabel" aria-hidden="true">
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
                            <div className="modal fade" id="importPuntedModal" tabIndex="-1" aria-labelledby="importPuntedModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="importPuntedModalLabel">Import Punted Tasks</h5>
                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div className="modal-body">
                                            <form className="mt-3">
                                                <div className="form-group col-md-12 text-left">
                                                    <label htmlFor="importablePlanOptions">Plans</label>
                                                    <select id="importablePlanOptions" className="form-control" defaultValue="Pick a Plan to Import" onChange={selectImportPlan}>
                                                        <option data-selected_plan_id="">Pick a Plan to Import</option>
                                                        {importablePlans !== [] ? importablePlans.map((importablePlan, p) =>
                                                            importablePlan._id !== PlanID &&
                                                            <option key={"importablePlanKey" + p} id={"planOption" + importablePlan._id} data-selected_plan_id={importablePlan._id}>"{importablePlan.plan_name}" ({moment(importablePlan.created_date).format("dddd,  DD MMMM YYYY")})</option>
                                                        ) : ""}
                                                    </select>
                                                </div>
                                            </form>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                            <button type="button" className="btn btn-custom" onClick={importPuntedTasks} data-toggle="modal" data-target="#importPuntedModal">Import</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div>{Plan.tasks !== undefined ? Plan.tasks.map((task, i) =>
                                    <div className="card mb-1 mt-1 p-2">
                                        <div className="row">
                                            <div className="col-md-10">
                                                <div className="row">
                                                    <div className="col-md-12 text-left">
                                                        <h5><strong>{"#" + (i + 1) + ": "}<span id={"taskDescription" + i}>{task.description}</span></strong></h5>
                                                    </div>
                                                </div>
                                                <div className="row mb-2">
                                                    <div className="col-md-12">
                                                        <BarLoader
                                                            css={override}
                                                            width={300}
                                                            height={10}
                                                            color={"#008000"}
                                                            loading={jiraLinksLoading}
                                                        />
                                                    </div>
                                                    <div className="col-md-12 text-left">
                                                        {!jiraLinksLoading &&
                                                            task.jiras !== undefined ? task.jiras.map(
                                                                (jira, j) =>
                                                                    <div className="mt-1">
                                                                        <span className="jiraLinkPill mr-3 float-sm-left"><a className="jiraLinks" href={"https://jira.iscinternal.com/browse/" + jira} title={"Go to JIRA " + jira} target="_blank" rel="noopener noreferrer">{jira}</a> <img className="deleteIcon ml-1" alt="deleteIcon" title={"Remove JIRA " + jira} src={deleteIcon} data-jira_array_index={j} data-task_array_index={i} onClick={removeJIRA}></img></span>
                                                                    </div>
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
                                            </div>
                                            <div className="col-md-2">
                                                <div className="row">
                                                    <div className="col-md-12 text-center">
                                                        {i === 0 ? "" :
                                                            <button type="button" className="btn btn-sm m-1 arrow-btn" id={"moveTaskUpBtn" + i} data-task_array_index={i} data-move_jira_increment="-1" onClick={moveJira}><img className="arrowIcon" alt="upArrowIcon" src={upArrow}></img></button>
                                                        }
                                                        {i === (Plan.tasks.length - 1) ? "" :
                                                            <button type="button" className="btn btn-sm m-1 arrow-btn" id={"moveTaskDownBtn" + i} data-task_array_index={i} data-move_jira_increment="1" onClick={moveJira}><img className="arrowIcon" alt="downArrowIcon" src={downArrow}></img></button>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-12 text-center">
                                                        <button id={"editTaskBtn" + i} className="btn btn-sm btn-custom-blue" type="button" data-toggle="collapse" data-task_array_index={i} data-target={"#taskDetails" + i} aria-expanded="false" aria-controls={"taskDetails" + task + i} onClick={hideEditBtn}>Edit</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="collapse" id={"taskDetails" + i}>
                                                    <form className="taskUpdateForm p-2">
                                                        <div className="form-row">
                                                            <div className="form-group col-md-12 text-left">
                                                                <label htmlFor="taskDescription">Description</label>
                                                                <input type="text" key={task.description + i} className="form-control" id={"updatedTaskDescription" + i} defaultValue={task.description} onChange={setTaskDescription} />
                                                            </div>
                                                        </div>
                                                        <div className="form-row">
                                                            <div className="form-group col-md-6 text-left">
                                                                <label htmlFor="inputState">Status</label>
                                                                <select id={"taskStatus" + i} key={task.description + i} className="form-control" defaultValue={task.status} onChange={setTaskStatus}>
                                                                    <option>Closed</option>
                                                                    <option>Open</option>
                                                                    <option>In Progress</option>
                                                                    <option>Pending Feedback</option>
                                                                    <option>Punted</option>
                                                                </select>
                                                            </div>
                                                            <div className="form-group col-md-6 text-left">
                                                                <label htmlFor="taskHoursLogged">Hours Logged</label>
                                                                <input type="number" className="form-control" id={"taskHoursLogged" + i} key={task.description + i} step=".1" min="0" defaultValue={task.hoursLogged} onChange={setTaskHoursLogged} />
                                                            </div>
                                                        </div>
                                                        <div className="form-row">
                                                            <div className="form-group col-md-6 text-left">
                                                                <div className="row">
                                                                    <div className="col-md-12">
                                                                        <label htmlFor="taskHoursLogged">Link JIRA</label>
                                                                    </div>
                                                                    <div className="col-md-9">
                                                                        <input type="text" key={task.description + i} className="form-control" id={"linkJIRAInput" + i} />
                                                                    </div>
                                                                    <div className="col-md-3 text-center">
                                                                        <button className="btn btn-sm btn-custom-blue mt-1" id="linkJIRAButton" type="button" data-task_array_position={i} data-plan_id={Plan._id} onClick={linkJIRA}>Add</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="form-row text-right">
                                                            <div className="col-md-12">
                                                                <button className="btn btn-sm btn-secondary mr-1" type="button" data-toggle="collapse" data-target={"#taskDetails" + i} data-task_array_index={i} aria-expanded="false" aria-controls={"taskDetails" + task + i} onClick={showEditBtn}>Close</button>
                                                                <button id={"saveTaskBtn" + i} type="button" className="btn btn-sm btn-custom d-none" data-plan_id={Plan._id} data-task_array_position={i} onClick={updateTask} data-toggle="collapse" data-target={"#taskDetails" + i} aria-expanded="false" aria-controls={"taskDetails" + task + i}>Save</button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                ) : ""}</div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default PlanDetails;
import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import BarLoader from "react-spinners/BarLoader";
import HashLoader from "react-spinners/HashLoader";
import { css } from "@emotion/core";
import { BrowserRouter as Router, useParams } from "react-router-dom";
import { logout, useInput, getCookie } from "../../sharedFunctions/sharedFunctions";
import API from "../../utils/API";
import moment from 'moment';
import upArrow from '../../images/baseline_keyboard_arrow_up_black_48dp.png';
import downArrow from '../../images/baseline_keyboard_arrow_down_black_48dp.png';
import deleteIcon from '../../images/thin_minus_icon.png';
import "./style.css";

import Navbar from "../../components/Navbar/Navbar";

const override = css`
  display: block;
  margin: 0 auto;
  color: #008000;
  `;

const DummyDNDList = () => {
    //REACT HOOKS START...
    var PlanID = useParams().id;
    var [items, setItems] = useState([]);
    var [tasks, setTasks] = useState([]);
    var [importablePlans, setImportablePlans] = useState([]);
    var [selectedImportPlan, setSelectedImportPlan] = useState("");
    var [userToken, setUserToken] = useState("");
    var [loading, setLoading] = useState(true);
    var [Plan, setPlan] = useState({});
    var [planTaskCount, setPlanTaskCount] = useState(-1);
    var [newTaskDescription, setNewTaskDescription] = useInput();
    var [totalHoursAllowed, setTotalHoursAllowed] = useState(8);
    var [totalHoursLogged, setTotalHoursLogged] = useState(0);

    var [taskDescription, setTaskDescription] = useInput();
    var [taskHoursLogged, setTaskHoursLogged] = useInput();
    var [taskStatus, setTaskStatus] = useInput();
    //...REACT HOOKS END

    //PLAN DETAILS FUNCTIONS...
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
                setPlan(Plan => res.data);
                setTasks(tasks => res.data.tasks);
                setPlanTaskCount(planTaskCount => res.data.tasks.length)
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
            PlanData.tasks.unshift(newTaskData);

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

    const removeJIRA = (event) => {
        let jiraArrayIndex = event.currentTarget.dataset.jira_array_index;
        let taskArrayIndex = event.currentTarget.dataset.task_array_index;
        let taskDescription = document.getElementById("taskDescription" + taskArrayIndex).innerHTML;
        let jiraArray = Plan.tasks[taskArrayIndex].jiras;

        jiraArray.splice(jiraArrayIndex, 1);

        API.removeJIRA(PlanID, taskDescription, jiraArray).then(
            (res) => {
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

        console.log(planTasks);

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

    const reorderTasks = (newTaskArray) => {
        console.log(newTaskArray.length);
        console.log(Plan.tasks.length);

        if (newTaskArray.length === Plan.tasks.length) {
            API.replaceTaskArray(PlanID, newTaskArray).then(
                (res) => {
                    console.log(res.data);
                    setLoading(loading => true);
                    renderPlan();
                }
            );
        };
    }

    const importPuntedTasks = () => {
        let currentTaskDescriptions = [];
        let selectedImportPlanTasks = [];

        for (let i = 0; i < Plan.tasks.length; i++) {
            currentTaskDescriptions.push(Plan.tasks[i].description);
        }

        const importTasks = (currentTasks, importedTasks) => {
            let currentTaskDescriptions = currentTasks;
            let originalImportedTasks = importedTasks;
            let approvedImportTasks = [];

            for (let i = 0; i < originalImportedTasks.length; i++) {
                if (currentTaskDescriptions.indexOf(originalImportedTasks[i].description) === -1 && approvedImportTasks.indexOf(originalImportedTasks[i]) === -1 && (originalImportedTasks[i].status === "Punted" || originalImportedTasks[i].status === "Pending Feedback" || originalImportedTasks[i].status === "Awaiting Backport")) {
                    approvedImportTasks.push(originalImportedTasks[i]);
                }
            }

            for (let i = 0; i < approvedImportTasks.length; i++) {
                if (approvedImportTasks[i].status === "Pending Feedback") {
                    approvedImportTasks[i].status = "Pending Feedback";
                } else if (approvedImportTasks[i].status === "Awaiting Backport") {
                    approvedImportTasks[i].status = "Awaiting Backport";
                } else {
                    approvedImportTasks[i].status = "Open";
                }

                approvedImportTasks[i].hoursLogged = 0;
            }

            console.log(approvedImportTasks);

            API.importTasks(PlanID, approvedImportTasks).then(
                (res) => {
                    console.log(res.data);
                    setLoading(loading => true);
                    renderPlan();
                }
            )
        }

        if (selectedImportPlan !== "") {
            API.findImportPuntedTasks(selectedImportPlan, currentTaskDescriptions).then(
                (res) => {
                    console.log(res.data);
                    selectedImportPlanTasks = res.data[0].tasks;
                    importTasks(currentTaskDescriptions, selectedImportPlanTasks);
                }
            )
        }
    }

    const deleteTask = (event) => {
        let planTasks = Plan.tasks;
        let taskPlan = event.currentTarget.dataset.plan_id;
        let taskArrayIndex = event.currentTarget.dataset.task_array_index;
        let taskDescription = document.getElementById("taskDescription" + taskArrayIndex).innerHTML;
        let deleteConfirmationValue = "";

        deleteConfirmationValue = document.getElementById("deleteTaskConfirmationInput" + taskArrayIndex).value;

        console.log(deleteConfirmationValue);
        console.log(planTasks);
        console.log(taskPlan);
        console.log(taskArrayIndex);
        console.log(taskDescription);

        planTasks.splice(taskArrayIndex, 1);
        console.log(planTasks);

        if (deleteConfirmationValue === "DELETE") {
            API.deleteTask(PlanID, taskDescription, moment().format()).then(
                (res) => {
                    console.log(res.data);
                    renderPlan();
                }
            )
        }
    }
    //...REACT FUNCTIONS END

    //SIMPLE LIST EXAMPLE FUNCTIONS...
    // fake data generator
    const getItems = count =>
        Array.from({ length: count }, (v, k) => k).map(k => ({
            id: `item-${k}`,
            content: `item ${k}`
        }));

    // a little function to help us with reordering the result
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    const grid = 8;

    const getItemStyle = (isDragging, draggableStyle) => ({
        // some basic styles to make the items look a bit nicer
        userSelect: "none",
        padding: grid * 2,
        margin: `0 0 ${grid}px 0`,

        // change background colour if dragging
        background: isDragging ? "lightgreen" : "grey",

        // styles we need to apply on draggables
        ...draggableStyle
    });

    const getListStyle = isDraggingOver => ({
        background: isDraggingOver ? "lightblue" : "lightgrey",
        padding: grid,
        width: 250
    });

    const onDragEnd = (result) => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const tempItems = reorder(
            tasks,
            result.source.index,
            result.destination.index
        );

        setTasks(tasks => tempItems);

        reorderTasks(tempItems);
    }

    //..END: SIMPLE LIST EXAMPLE FUNCITONS
    useEffect(() => {
        setItems(items => getItems(10))
        renderPlan();
    }, []);

    return (
        <div>
            <Navbar />
            <div className="container pt-4 justify-content-center">
                <div className="pb-2 my-5 mb-4 bg-white p-3">
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable">
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    style={getListStyle(snapshot.isDraggingOver)}
                                >
                                    {tasks !== undefined ? tasks.map((plan, index) => (
                                        <Draggable key={"task"+ index} draggableId={"task" + index} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                    )}
                                                >
                                                    {plan.description}
                                                </div>
                                            )}
                                        </Draggable>
                                    )):""}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                    <a href={"../plan/" + PlanID}>Go Back to Plan Tasks</a>
                </div>
            </div>
        </div>
    )

}

export default DummyDNDList;
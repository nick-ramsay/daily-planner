import React, { useState, useEffect } from "react";
import { datadogRum } from "@datadog/browser-rum";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import HashLoader from "react-spinners/HashLoader";
import { BrowserRouter as Router, useParams } from "react-router-dom";
import { useInput, getCookie } from "../../sharedFunctions/sharedFunctions";
import { ExportToCsv } from "export-to-csv";
import API from "../../utils/API";
import moment from "moment";
import "./style.css";

import Navbar from "../../components/Navbar/Navbar";

const PlanDetails = () => {
  var PlanID = useParams().id;
  var [autoSort, setAutoSort] = useState(true);
  var [tasks, setTasks] = useState([]);
  var [importablePlans, setImportablePlans] = useState([]);
  var [selectedImportPlan, setSelectedImportPlan] = useState("");
  var [loading, setLoading] = useState(true);
  var [Plan, setPlan] = useState({});
  var [newTaskDescription, setNewTaskDescription] = useInput();
  var [totalHoursLogged, setTotalHoursLogged] = useState({
    totalHoursLogged: 0,
  });

  var [taskDescription, setTaskDescription] = useInput();
  var [taskHoursLogged, setTaskHoursLogged] = useInput();
  var [taskStatus, setTaskStatus] = useInput();

  const calculateTotalHoursLogged = (PlanData) => {
    let totalHours = 0;
    let closedHours = 0;
    let openHours = 0;
    let inProgressHours = 0;
    let pendingFeedbackHours = 0;
    let onHoldHours = 0;
    let slackThreadHours = 0;
    let longTermHours = 0;
    let puntedHours = 0;
    let meetingHours = 0;
    let otherHours = 0;

    for (let i = 0; i < PlanData.tasks.length; i++) {
      totalHours += Number(PlanData.tasks[i].hoursLogged);
      if (PlanData.tasks[i].status === "Closed") {
        closedHours += Number(PlanData.tasks[i].hoursLogged);
      } else if (PlanData.tasks[i].status === "Open") {
        openHours += Number(PlanData.tasks[i].hoursLogged);
      } else if (PlanData.tasks[i].status === "In Progress") {
        inProgressHours += Number(PlanData.tasks[i].hoursLogged);
      } else if (PlanData.tasks[i].status === "Pending Feedback") {
        pendingFeedbackHours += Number(PlanData.tasks[i].hoursLogged);
      } else if (PlanData.tasks[i].status === "On Hold") {
        onHoldHours += Number(PlanData.tasks[i].hoursLogged);
      } else if (PlanData.tasks[i].status === "Slack Thread") {
        slackThreadHours += Number(PlanData.tasks[i].hoursLogged);
      } else if (PlanData.tasks[i].status === "Long Term") {
        longTermHours += Number(PlanData.tasks[i].hoursLogged);
      } else if (PlanData.tasks[i].status === "Punted") {
        puntedHours += Number(PlanData.tasks[i].hoursLogged);
      } else if (PlanData.tasks[i].status === "Meeting") {
        meetingHours += Number(PlanData.tasks[i].hoursLogged);
      } else {
        otherHours += Number(PlanData.tasks[i].hoursLogged);
      }
    }
    let tempTotalHoursLogged = {
      hoursInDay: 8,
      totalHoursLogged: totalHours,
      closedHours: closedHours,
      openHours: openHours,
      inProgressHours: inProgressHours,
      pendingFeedbackHours: pendingFeedbackHours,
      onHoldHours: onHoldHours,
      slackThreadHours: slackThreadHours,
      longTermHours: longTermHours,
      puntedHours: puntedHours,
      meetingHours: meetingHours,
      otherHours: otherHours,
    };
    console.log(tempTotalHoursLogged);
    setTotalHoursLogged((totalHoursLogged) => tempTotalHoursLogged);
  };

  const renderPlan = () => {
    let selectedPlan = PlanID;
    API.findImportableTasks(getCookie("account_id")).then((res) => {
      setImportablePlans((importablePlans) => res.data);
    });
    API.findPlan(selectedPlan).then((res) => {
      setLoading((loading) => false);
      setPlan((Plan) => res.data);
      setTasks((tasks) => res.data.tasks);
      calculateTotalHoursLogged(res.data);
    });
  };

  const selectImportPlan = (event) => {
    let selectedPlanID =
      event.target.options[event.target.selectedIndex].dataset.selected_plan_id;
    setSelectedImportPlan((selectedImportPlan) => selectedPlanID);
  };

  const saveTask = () => {
    if (newTaskDescription !== "") {
      let PlanData = Plan;
      let newTaskData = {
        description: newTaskDescription,
        created_date: new Date(),
        status: "Open",
        order: Plan.tasks.length,
        hoursLogged: 0,
        links: generateLinks(newTaskDescription),
        jiras: [],
      };
      PlanData.tasks.unshift(newTaskData);

      API.checkExistingTasks(PlanID, newTaskDescription).then((res) => {
        renderPlan();
      });

      API.updatePlanTasks(PlanID, PlanData.tasks).then((res) => {
        document.getElementById("taskInput").value = "";
        renderPlan();
        datadogRum.addAction("new-task-created", {
          newTaskDescription: newTaskData.description, // for example, 42.12
          newTaskCreatedDate: newTaskData.created_date, // for example, ['tomato', 'strawberries']
        });
      });
    }
  };

  const hideEditBtn = (event) => {
    let taskArrayIndex = event.currentTarget.dataset.task_array_index;

    document
      .getElementById("editTaskBtn" + taskArrayIndex)
      .classList.add("d-none");
    //document.getElementById("saveTaskBtn" + taskArrayIndex).classList.remove("d-none");
    //document.getElementById("moveTaskBtns" + taskArrayIndex).classList.remove("d-none");
  };

  /*
    const showEditBtn = (event) => {
        let taskArrayIndex = event.currentTarget.dataset.task_array_index;
        document.getElementById("editTaskBtn" + taskArrayIndex).classList.remove("d-none");
        document.getElementById("saveTaskBtn" + taskArrayIndex).classList.add("d-none");
        //document.getElementById("moveTaskBtns" + taskArrayIndex).classList.add("d-none");
    }
    */

  const generateLinks = (taskDescription) => {
    let zendeskRegex = /ZD\s{1}\d{6,7}/g;
    let zendeskStrings =
      taskDescription.match(zendeskRegex) != null
        ? taskDescription.match(zendeskRegex)
        : [];

    let newLinks = [];

    for (let l = 0; l < zendeskStrings.length; l += 1) {
      let currentTitle = zendeskStrings[l];
      let currentID = Number(zendeskStrings[l].match(/\s{1}\d{6,7}/g)[0]);
      let currentURL = "https://datadog.zendesk.com/agent/tickets/" + currentID;

      let currentLink = {
        title: currentTitle,
        id: currentID,
        url: currentURL,
      };

      newLinks.push(currentLink);
    }
    return newLinks;
  };

  const automatedSort = (tasks, originalArrayPosition, newStatus) => {
    console.log(tasks);
    console.log(originalArrayPosition);
    console.log(newStatus);
    let tempTasks = tasks;
    let newTaskStatus = newStatus;
    let originalArrayIndex = Number(originalArrayPosition);

    if (newStatus === "Open") {
      let bottomStatusIndex = -1;
      for (let i = 0; i < tempTasks.length; i++) {
        if (
          tempTasks[i].status === newTaskStatus &&
          bottomStatusIndex < i &&
          i < originalArrayIndex
        ) {
          bottomStatusIndex = i;
          console.log(bottomStatusIndex);
          console.log("Called AutoSort for Open!");
        }
      }
      bottomStatusIndex += 1;
      console.log(bottomStatusIndex);
    }
  };

  const updateTask = (event) => {
    let taskArrayPosition = event.currentTarget.dataset.task_array_position;
    let taskDescription = document.getElementById(
      "taskDescription" + taskArrayPosition
    ).innerHTML;
    let newHoursLogged = document.getElementById(
      "taskHoursLogged" + taskArrayPosition
    ).value;
    let originalStatus = tasks[taskArrayPosition].status;
    let newStatus = document.getElementById(
      "taskStatus" + taskArrayPosition
    ).value;
    let newTaskDescription = document.getElementById(
      "updatedTaskDescription" + taskArrayPosition
    ).value;

    let newLinks = generateLinks(newTaskDescription);

    API.checkExistingTasks(PlanID, newTaskDescription).then((res) => {
      renderPlan();
    });

    API.updateTask(
      PlanID,
      taskDescription,
      taskArrayPosition,
      newHoursLogged,
      newStatus,
      newTaskDescription,
      newLinks,
      true
    ).then((res) => {
      renderPlan();
    });
  };

  const reorderTasks = (newTaskArray) => {
    if (newTaskArray.length === Plan.tasks.length) {
      API.replaceTaskArray(PlanID, newTaskArray).then((res) => {
        renderPlan();
      });
    }
  };

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
        if (
          currentTaskDescriptions.indexOf(
            originalImportedTasks[i].description
          ) === -1 &&
          approvedImportTasks.indexOf(originalImportedTasks[i]) === -1 &&
          (originalImportedTasks[i].status === "Punted" ||
            originalImportedTasks[i].status === "Pending Feedback" ||
            originalImportedTasks[i].status === "Awaiting Backport" ||
            originalImportedTasks[i].status === "On Hold" ||
            originalImportedTasks[i].status === "Long Term" ||
            originalImportedTasks[i].status === "Slack Thread")
        ) {
          approvedImportTasks.push(originalImportedTasks[i]);
        }
      }

      for (let i = 0; i < approvedImportTasks.length; i++) {
        if (approvedImportTasks[i].status === "Pending Feedback") {
          approvedImportTasks[i].status = "Pending Feedback";
        } else if (approvedImportTasks[i].status === "Awaiting Backport") {
          approvedImportTasks[i].status = "Awaiting Backport";
        } else if (approvedImportTasks[i].status === "On Hold") {
          approvedImportTasks[i].status = "On Hold";
        } else if (approvedImportTasks[i].status === "Long Term") {
          approvedImportTasks[i].status = "Long Term";
        } else if (approvedImportTasks[i].status === "Slack Thread") {
          approvedImportTasks[i].status = "Slack Thread";
        } else {
          approvedImportTasks[i].status = "Open";
        }

        approvedImportTasks[i].hoursLogged = 0;
        approvedImportTasks[i].touched = false;
      }

      API.importTasks(PlanID, approvedImportTasks).then((res) => {
        setLoading((loading) => true);
        renderPlan();
      });
    };

    if (selectedImportPlan !== "") {
      API.findImportPuntedTasks(
        selectedImportPlan,
        currentTaskDescriptions
      ).then((res) => {
        selectedImportPlanTasks = res.data[0].tasks;
        importTasks(currentTaskDescriptions, selectedImportPlanTasks);
      });
    }
  };

  const deleteTask = (event) => {
    let planTasks = Plan.tasks;
    let taskPlan = event.currentTarget.dataset.plan_id;
    let taskArrayIndex = event.currentTarget.dataset.task_array_index;
    let taskDescription = document.getElementById(
      "taskDescription" + taskArrayIndex
    ).innerHTML;
    let deleteConfirmationValue = "";

    deleteConfirmationValue = document.getElementById(
      "deleteTaskConfirmationInput" + taskArrayIndex
    ).value;

    planTasks.splice(taskArrayIndex, 1);

    if (deleteConfirmationValue === "DELETE") {
      API.deleteTask(PlanID, taskDescription, moment().format()).then((res) => {
        renderPlan();
      });
    }
  };

  //SIMPLE LIST EXAMPLE FUNCTIONS...
  // fake data generator
  const getItems = (count) =>
    Array.from({ length: count }, (v, k) => k).map((k) => ({
      id: `item-${k}`,
      content: `item ${k}`,
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
    //userSelect: "none",
    //padding: grid * 2,
    //margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? "none" : "none",

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? "#E5E5FF" : "none",
    //padding: grid,
    //width: 500
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

    setTasks((tasks) => tempItems);

    reorderTasks(tempItems);
  };

  const puntAllOpen = () => {
    let tempTasks = tasks;

    for (let i = 0; i < tempTasks.length; i++) {
      if (
        tempTasks[i].status === "Open" ||
        tempTasks[i].status === "In Progress"
      ) {
        tempTasks[i].status = "Punted";
      }
    }

    API.replaceTaskArray(PlanID, tempTasks).then((res) => {
      renderPlan();
    });
  };

  const exportDailyWork = (exportType) => {
    let tempExportType = exportType;
    let tempTasks = tasks;

    let timeLoggedExports = [];

    for (let i = 0; i < tempTasks.length; i++) {
      if (
        Number(tempTasks[i].hoursLogged) !== 0 ||
        tempTasks[i].touched === true ||
        moment(tempTasks[i].created_date).format("DD-MM-YYYY") ===
          moment().format("DD-MM-YYYY")
      ) {
        let currentTaskObject = {
          name: tempTasks[i].description,
          status:
            moment(tempTasks[i].created_date).format("DD-MM-YYYY") ===
            moment().format("DD-MM-YYYY")
              ? tempTasks[i].status + " (New Task)"
              : tempTasks[i].status,
          hours: Number(tempTasks[i].hoursLogged),
          tickets:
            tempTasks[i].links[0] !== undefined
              ? tempTasks[i].links[0].url
              : "",
        };

        timeLoggedExports.push(currentTaskObject);
      }
    }

    const options = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalSeparator: ".",
      showLabels: true,
      showTitle: true,
      title:
        Plan.plan_name +
        " (" +
        moment(Plan.created_date).format("dddd,  DD MMMM YYYY") +
        ")",
      filename: Plan.plan_name + "_" + Plan.created_date,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };

    const csvExporter = new ExportToCsv(options);

    if (timeLoggedExports.length > 0) {
      csvExporter.generateCsv(timeLoggedExports);
    } else {
      csvExporter.generateCsv([{}]);
    }
  };

  //..END: SIMPLE LIST EXAMPLE FUNCITONS

  useEffect(() => {
    renderPlan();
  }, []);

  return (
    
      <div>
        <Navbar />
        {loading === true && (
          <div className="container pt-4 min-vh-100">
            <div className="row justify-content-center min-vh-100">
              <div className="col-md-12 pt-4 mt-auto mb-auto">
                <HashLoader
                  size={200}
                  color={"#008000"}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        )}
        {!loading && (
          <div className="container pt-4">
            <div className="pb-2 my-5 bg-white p-3">
              <div>
                <h2
                  className="font-weight-bold"
                  onClick={datadogRum.addError("error", {
                    test_profile_id: getCookie("account_id"),
                  })}
                >
                  {moment(Plan.created_date).format("dddd,  DD MMMM YYYY")}
                </h2>
                <h5>
                  <strong>
                    {Number(totalHoursLogged.totalHoursLogged)} hours logged
                  </strong>
                </h5>
                <div className="progress mt-2" id="hour-bar">
                  <div
                    className="progress-bar bg-custom"
                    onClick={() => {
                      document
                        .getElementById("hour-bar")
                        .classList.add("d-none");
                      document
                        .getElementById("color-coded-hour-bar")
                        .classList.remove("d-none");
                    }}
                    role="progressbar"
                    style={{
                      width:
                        (totalHoursLogged.totalHoursLogged / 8) * 100 + "%",
                    }}
                    aria-valuenow="25"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <div
                  className="progress d-none"
                  id="color-coded-hour-bar"
                  onClick={() => {
                    document
                      .getElementById("color-coded-hour-bar")
                      .classList.add("d-none");
                    document
                      .getElementById("hour-bar")
                      .classList.remove("d-none");
                  }}
                >
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{
                      width:
                        (totalHoursLogged.totalHoursLogged <=
                        totalHoursLogged.hoursInDay
                          ? (totalHoursLogged.closedHours /
                              totalHoursLogged.hoursInDay) *
                            100
                          : (totalHoursLogged.closedHours /
                              totalHoursLogged.totalHoursLogged) *
                            100) + "%",
                    }}
                    title={
                      totalHoursLogged.closedHours +
                      " hours logged toward Closed tasks"
                    }
                    aria-valuenow="30"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    Closed
                  </div>
                  <div
                    className="progress-bar bg-primary"
                    role="progressbar"
                    style={{
                      width:
                        (totalHoursLogged.totalHoursLogged <=
                        totalHoursLogged.hoursInDay
                          ? (totalHoursLogged.openHours /
                              totalHoursLogged.hoursInDay) *
                            100
                          : (totalHoursLogged.openHours /
                              totalHoursLogged.totalHoursLogged) *
                            100) + "%",
                    }}
                    title={
                      totalHoursLogged.openHours +
                      " hours logged toward Open tasks"
                    }
                    aria-valuenow="30"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    Open
                  </div>
                  <div
                    className="progress-bar bg-warning"
                    role="progressbar"
                    style={{
                      width:
                        (totalHoursLogged.totalHoursLogged <=
                        totalHoursLogged.hoursInDay
                          ? (totalHoursLogged.inProgressHours /
                              totalHoursLogged.hoursInDay) *
                            100
                          : (totalHoursLogged.inProgressHours /
                              totalHoursLogged.totalHoursLogged) *
                            100) + "%",
                    }}
                    title={
                      totalHoursLogged.inProgressHours +
                      " hours logged toward In Progress tasks"
                    }
                    aria-valuenow="30"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    In Progress
                  </div>
                  <div
                    className="progress-bar bg-info"
                    role="progressbar"
                    style={{
                      width:
                        (totalHoursLogged.totalHoursLogged <=
                        totalHoursLogged.hoursInDay
                          ? (totalHoursLogged.pendingFeedbackHours /
                              totalHoursLogged.hoursInDay) *
                            100
                          : (totalHoursLogged.pendingFeedbackHours /
                              totalHoursLogged.totalHoursLogged) *
                            100) + "%",
                    }}
                    title={
                      totalHoursLogged.pendingFeedbackHours +
                      " hours logged toward Pending Feedback tasks"
                    }
                    aria-valuenow="30"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    Pending
                  </div>
                  <div
                    className="progress-bar bg-dark"
                    role="progressbar"
                    style={{
                      width:
                        (totalHoursLogged.totalHoursLogged <=
                        totalHoursLogged.hoursInDay
                          ? (totalHoursLogged.onHoldHours /
                              totalHoursLogged.hoursInDay) *
                            100
                          : (totalHoursLogged.onHoldHours /
                              totalHoursLogged.totalHoursLogged) *
                            100) + "%",
                    }}
                    title={
                      totalHoursLogged.onHoldHours +
                      " hours logged toward On Hold tasks"
                    }
                    aria-valuenow="30"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    On Hold
                  </div>
                  <div
                    className="progress-bar badge-custom-purple"
                    role="progressbar"
                    style={{
                      width:
                        (totalHoursLogged.totalHoursLogged <=
                        totalHoursLogged.hoursInDay
                          ? (totalHoursLogged.slackThreadHours /
                              totalHoursLogged.hoursInDay) *
                            100
                          : (totalHoursLogged.slackThreadHours /
                              totalHoursLogged.totalHoursLogged) *
                            100) + "%",
                    }}
                    title={
                      totalHoursLogged.slackThreadHours +
                      " hours logged toward Slack Thread tasks"
                    }
                    aria-valuenow="30"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    Slack Thread
                  </div>
                  <div
                    className="progress-bar badge-custom-hotpink"
                    role="progressbar"
                    style={{
                      width:
                        (totalHoursLogged.totalHoursLogged <=
                        totalHoursLogged.hoursInDay
                          ? (totalHoursLogged.longTermHours /
                              totalHoursLogged.hoursInDay) *
                            100
                          : (totalHoursLogged.longTermHours /
                              totalHoursLogged.totalHoursLogged) *
                            100) + "%",
                    }}
                    title={
                      totalHoursLogged.longTermHours +
                      " hours logged toward Long Term tasks"
                    }
                    aria-valuenow="30"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    Long Term
                  </div>
                  <div
                    className="progress-bar bg-secondary"
                    role="progressbar"
                    style={{
                      width:
                        (totalHoursLogged.totalHoursLogged <=
                        totalHoursLogged.hoursInDay
                          ? (totalHoursLogged.puntedHours /
                              totalHoursLogged.hoursInDay) *
                            100
                          : (totalHoursLogged.puntedHours /
                              totalHoursLogged.totalHoursLogged) *
                            100) + "%",
                    }}
                    title={
                      totalHoursLogged.puntedHours +
                      " hours logged toward Punted tasks"
                    }
                    aria-valuenow="30"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    Punted
                  </div>
                  <div
                    className="progress-bar badge-custom-sunshine"
                    role="progressbar"
                    style={{
                      width:
                        (totalHoursLogged.totalHoursLogged <=
                        totalHoursLogged.hoursInDay
                          ? (totalHoursLogged.meetingHours /
                              totalHoursLogged.hoursInDay) *
                            100
                          : (totalHoursLogged.meetingHours /
                              totalHoursLogged.totalHoursLogged) *
                            100) + "%",
                    }}
                    title={
                      totalHoursLogged.meetingHours +
                      " hours logged toward Meeting tasks"
                    }
                    aria-valuenow="30"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    Meetings
                  </div>
                  <div
                    className="progress-bar bg-warning"
                    role="progressbar"
                    style={{
                      width:
                        (totalHoursLogged.totalHoursLogged <=
                        totalHoursLogged.hoursInDay
                          ? (totalHoursLogged.otherHours /
                              totalHoursLogged.hoursInDay) *
                            100
                          : (totalHoursLogged.otherHours /
                              totalHoursLogged.totalHoursLogged) *
                            100) + "%",
                    }}
                    title={
                      totalHoursLogged.otherHours +
                      " hours logged toward other tasks"
                    }
                    aria-valuenow="30"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    Other
                  </div>
                </div>
                <span>
                  You{" "}
                  {totalHoursLogged.hoursInDay -
                    totalHoursLogged.totalHoursLogged >
                  0
                    ? "have"
                    : "are"}{" "}
                  {Math.abs(
                    totalHoursLogged.hoursInDay -
                      totalHoursLogged.totalHoursLogged
                  ).toFixed(2)}{" "}
                  {totalHoursLogged.hoursInDay -
                    totalHoursLogged.totalHoursLogged ===
                  1
                    ? "hour"
                    : "hours"}{" "}
                  {totalHoursLogged.hoursInDay -
                    totalHoursLogged.totalHoursLogged >=
                  0
                    ? "remaining."
                    : "overtime."}{" "}
                  {totalHoursLogged.hoursInDay -
                    totalHoursLogged.totalHoursLogged <
                  0
                    ? "Overachiever!"
                    : totalHoursLogged.hoursInDay -
                        totalHoursLogged.totalHoursLogged ===
                      0
                    ? "Congrats! You're done!"
                    : ""}{" "}
                </span>

                <div className="accordion" id="planSettingsAccordion">
                  <div>
                    <div>
                      <h2 className="mb-1">
                        <button
                          className="btn"
                          type="button"
                          style={{ fontWeight: "bold", fontSize: 14 }}
                          data-toggle="collapse"
                          data-target="#planSettingsCard"
                          aria-expanded="true"
                          aria-controls="planSettingsAccordion"
                        >
                          <span>Tools & Settings</span>
                          <span style={{ fontSize: 20 }}> &#9881;</span>
                        </button>
                      </h2>
                    </div>

                    <div
                      id="planSettingsCard"
                      className="collapse"
                      aria-labelledby="headingOne"
                      data-parent="#planSettingsAccordion"
                    >
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <button
                              type="button"
                              className="btn btn-sm btn-navy-inverse"
                              data-toggle="modal"
                              data-target="#importPuntedModal"
                            >
                              Import Punted Tasks
                            </button>
                          </div>
                        </div>
                        <div className="row mt-2">
                          <div className="col-md-6">
                            <button
                              className="btn btn-sm btn-navy-inverse"
                              type="button"
                              onClick={puntAllOpen}
                            >
                              Punt-It-All
                            </button>
                          </div>
                          <div className="col-md-6">
                            <div className="custom-control custom-switch">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                defaultChecked={autoSort}
                                id="autoSortSwitch"
                                onClick={() => {
                                  autoSort === true
                                    ? setAutoSort(false)
                                    : setAutoSort(true);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="autoSortSwitch"
                              >
                                Auto Sort
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="row mt-2">
                          <div className="col-md-6">
                            <button
                              className="btn btn-sm btn-navy-inverse"
                              type="button"
                              onClick={() => exportDailyWork("timeLogged")}
                            >
                              Export Work w/ Time Logged
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    type="button"
                    className="btn btn-sm btn-custom m-1"
                    data-toggle="modal"
                    data-target="#newTaskModal"
                    onClick={datadogRum.addAction("new-task-modal-opened", {
                      newTaskModalOpenedTimestamp: new Date(),
                    })}
                  >
                    New Task
                  </button>
                </div>
                <div
                  className="modal fade"
                  id="newTaskModal"
                  tabIndex="-1"
                  aria-labelledby="newTaskModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="newTaskModalLabel">
                          Enter a New Task
                        </h5>
                        <button
                          type="button"
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <form className="mt-3">
                          <div className="form-row text-center">
                            <div className="col">
                              <input
                                type="text"
                                placeholder="Enter your task description here"
                                className="dd-privacy-allow form-control"
                                id="taskInput"
                                name="taskInput"
                                onChange={setNewTaskDescription}
                                data-track="SEARCH - input box"
                                aria-describedby="taskHelp"
                              />
                            </div>
                          </div>
                        </form>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-dismiss="modal"
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          className="btn btn-custom"
                          onClick={saveTask}
                          data-toggle="modal"
                          data-target="#newTaskModal"
                        >
                          Save Task
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="modal fade"
                  id="importPuntedModal"
                  tabIndex="-1"
                  aria-labelledby="importPuntedModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="importPuntedModalLabel">
                          Import Punted Tasks
                        </h5>
                        <button
                          type="button"
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <form className="mt-3">
                          <div className="form-group col-md-12 text-left">
                            <label htmlFor="importablePlanOptions">Plans</label>
                            <select
                              id="importablePlanOptions"
                              className="form-control"
                              defaultValue="Pick a Plan to Import"
                              onChange={selectImportPlan}
                            >
                              <option data-selected_plan_id="">
                                Pick a Plan to Import
                              </option>
                              {importablePlans !== []
                                ? importablePlans.map(
                                    (importablePlan, p) =>
                                      importablePlan._id !== PlanID && (
                                        <option
                                          key={"importablePlanKey" + p}
                                          id={"planOption" + importablePlan._id}
                                          data-selected_plan_id={
                                            importablePlan._id
                                          }
                                        >
                                          "{importablePlan.plan_name}" (
                                          {moment(
                                            importablePlan.created_date
                                          ).format("dddd,  DD MMMM YYYY")}
                                          )
                                        </option>
                                      )
                                  )
                                : ""}
                            </select>
                          </div>
                        </form>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-dismiss="modal"
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          className="btn btn-custom"
                          onClick={importPuntedTasks}
                          data-toggle="modal"
                          data-target="#importPuntedModal"
                        >
                          Import
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable">
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={getListStyle(snapshot.isDraggingOver)}
                        >
                          {tasks !== undefined
                            ? tasks.map((task, i) => {
                                if (
                                  task.deletion_date === null ||
                                  task.deletion_date === undefined
                                ) {
                                  return (
                                    <Draggable
                                      key={"task" + i}
                                      draggableId={"task" + i}
                                      index={i}
                                    >
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
                                          <div>
                                            <div className="card mb-1 mt-1">
                                              <div className="card-body pt-2 pb-2">
                                                <div className="row">
                                                  <div className="col-md-12">
                                                    <div className="row">
                                                      <div className="col-md-12 text-left">
                                                        <h5
                                                          id={"editTaskBtn" + i}
                                                          data-toggle="collapse"
                                                          data-task_array_index={
                                                            i
                                                          }
                                                          data-target={
                                                            "#taskDetails" + i
                                                          }
                                                          aria-expanded="false"
                                                          aria-controls={
                                                            "taskDetails" +
                                                            task +
                                                            i
                                                          }
                                                        >
                                                          <strong>
                                                            {"#" +
                                                              (i + 1) +
                                                              ": "}
                                                            <span
                                                              id={
                                                                "taskDescription" +
                                                                i
                                                              }
                                                              className="task-description-edit"
                                                            >
                                                              {task.description}
                                                            </span>
                                                          </strong>
                                                        </h5>
                                                      </div>
                                                    </div>
                                                    <div className="row mb-2">
                                                      <div className="col-md-12 text-left">
                                                        {task.links !==
                                                        undefined
                                                          ? task.links.map(
                                                              (link, j) => (
                                                                <div
                                                                  key={
                                                                    "task-" +
                                                                    i +
                                                                    "-link-" +
                                                                    j
                                                                  }
                                                                  className="mt-1"
                                                                >
                                                                  <span
                                                                    className="jiraLinkPill mr-3 float-sm-left"
                                                                    style={{
                                                                      fontSize: 12,
                                                                    }}
                                                                  >
                                                                    <a
                                                                      className="jiraLinks"
                                                                      href={
                                                                        link.url
                                                                      }
                                                                      title={
                                                                        "Go to link " +
                                                                        link.title
                                                                      }
                                                                      target="_blank"
                                                                      rel="noopener noreferrer"
                                                                    >
                                                                      {
                                                                        link.title
                                                                      }
                                                                    </a>
                                                                  </span>
                                                                </div>
                                                              )
                                                            )
                                                          : ""}
                                                      </div>
                                                    </div>
                                                    <div className="row">
                                                      <div className="col-md-4 text-left">
                                                        <h6>
                                                          <span>
                                                            Created at{" "}
                                                            {moment(
                                                              task.created_date
                                                            ).format(
                                                              "DD MMMM YYYY, h:mm A"
                                                            )}
                                                          </span>
                                                        </h6>
                                                      </div>
                                                      <div className="col-md-4 text-left">
                                                        <div>
                                                          {(() => {
                                                            switch (
                                                              task.status
                                                            ) {
                                                              case "Closed":
                                                                return (
                                                                  <h6>
                                                                    <span
                                                                      id={
                                                                        "task-status-" +
                                                                        i
                                                                      }
                                                                      className="badge badge-success"
                                                                    >
                                                                      {
                                                                        task.status
                                                                      }
                                                                    </span>
                                                                  </h6>
                                                                );
                                                              case "Open":
                                                                return (
                                                                  <h6>
                                                                    <span
                                                                      id={
                                                                        "task-status-" +
                                                                        i
                                                                      }
                                                                      className="badge badge-primary"
                                                                    >
                                                                      {
                                                                        task.status
                                                                      }
                                                                    </span>
                                                                  </h6>
                                                                );
                                                              case "In Progress":
                                                                return (
                                                                  <h6>
                                                                    <span
                                                                      id={
                                                                        "task-status-" +
                                                                        i
                                                                      }
                                                                      className="badge badge-warning"
                                                                    >
                                                                      {
                                                                        task.status
                                                                      }
                                                                    </span>
                                                                  </h6>
                                                                );
                                                              case "Pending Feedback":
                                                                return (
                                                                  <h6>
                                                                    <span
                                                                      id={
                                                                        "task-status-" +
                                                                        i
                                                                      }
                                                                      className="badge badge-info"
                                                                    >
                                                                      {
                                                                        task.status
                                                                      }
                                                                    </span>
                                                                  </h6>
                                                                );
                                                              case "Punted":
                                                                return (
                                                                  <h6>
                                                                    <span
                                                                      id={
                                                                        "task-status-" +
                                                                        i
                                                                      }
                                                                      className="badge badge-secondary"
                                                                    >
                                                                      {
                                                                        task.status
                                                                      }
                                                                    </span>
                                                                  </h6>
                                                                );
                                                              case "Awaiting Backport":
                                                                return (
                                                                  <h6>
                                                                    <span
                                                                      id={
                                                                        "task-status-" +
                                                                        i
                                                                      }
                                                                      className="badge badge-custom-peru"
                                                                    >
                                                                      {
                                                                        task.status
                                                                      }
                                                                    </span>
                                                                  </h6>
                                                                );
                                                              case "Meeting":
                                                                return (
                                                                  <h6>
                                                                    <span
                                                                      id={
                                                                        "task-status-" +
                                                                        i
                                                                      }
                                                                      className="badge badge-custom-sunshine"
                                                                    >
                                                                      {
                                                                        task.status
                                                                      }
                                                                    </span>
                                                                  </h6>
                                                                );
                                                              case "Long Term":
                                                                return (
                                                                  <h6>
                                                                    <span
                                                                      id={
                                                                        "task-status-" +
                                                                        i
                                                                      }
                                                                      className="badge badge-custom-hotpink"
                                                                    >
                                                                      {
                                                                        task.status
                                                                      }
                                                                    </span>
                                                                  </h6>
                                                                );
                                                              case "Slack Thread":
                                                                if (
                                                                  task.touched ===
                                                                  false
                                                                ) {
                                                                  return (
                                                                    <h6>
                                                                      <span
                                                                        id={
                                                                          "task-status-" +
                                                                          i
                                                                        }
                                                                        className=" badge badge-custom-purple-inverted"
                                                                      >
                                                                        <italic>
                                                                          <strong>
                                                                            {"Bump " +
                                                                              task.status}
                                                                          </strong>
                                                                        </italic>
                                                                      </span>
                                                                    </h6>
                                                                  );
                                                                } else {
                                                                  return (
                                                                    <h6>
                                                                      <span
                                                                        id={
                                                                          "task-status-" +
                                                                          i
                                                                        }
                                                                        className="badge badge-custom-purple"
                                                                      >
                                                                        {
                                                                          task.status
                                                                        }
                                                                      </span>
                                                                    </h6>
                                                                  );
                                                                }
                                                              default:
                                                                return (
                                                                  <h6>
                                                                    <span
                                                                      id={
                                                                        "task-status-" +
                                                                        i
                                                                      }
                                                                      className="badge badge-dark"
                                                                    >
                                                                      {
                                                                        task.status
                                                                      }
                                                                    </span>
                                                                  </h6>
                                                                );
                                                            }
                                                          })()}
                                                        </div>
                                                      </div>
                                                      <div className="col-md-4 text-left">
                                                        <h6>
                                                          {task.hoursLogged +
                                                            (task.hoursLogged ===
                                                            1
                                                              ? " hour logged"
                                                              : " hours logged")}
                                                        </h6>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  {/*
                                                                                        <div className="col-md-2 mt-auto mb-auto">
                                                                                            <div className="row">
                                                                                                <div className="col-md-12 mb-1 text-center">
                                                                                                    <button id={"editTaskBtn" + i} className="btn btn-sm btn-custom-blue" type="button" data-toggle="collapse" data-task_array_index={i} data-target={"#taskDetails" + i} aria-expanded="false" aria-controls={"taskDetails" + task + i} onClick={hideEditBtn}>Edit</button>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div> 
                                                                                        <div className="col-md-1 mt-auto mb-auto">
                                                                                            <div className="row">
                                                                                                {i === 0 ? "" :
                                                                                                    <button type="button" className="btn btn-sm w-100 arrow-btn mb-1" id={"moveTaskUpBtn" + i} data-task_array_index={i} data-move_jira_increment="-1" onClick={moveJira}><img className="arrowIcon" alt="upArrowIcon" src={upArrow}></img></button>
                                                                                                }
                                                                                            </div>
                                                                                            <div className="row">
                                                                                                {i === (Plan.tasks.length - 1) ? "" :
                                                                                                    <button type="button" className="btn btn-sm w-100 arrow-btn" id={"moveTaskDownBtn" + i} data-task_array_index={i} data-move_jira_increment="1" onClick={moveJira}><img className="arrowIcon" alt="downArrowIcon" src={downArrow}></img></button>
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                        */}
                                                </div>
                                              </div>
                                              <div className="row">
                                                <div className="col-md-12">
                                                  <div
                                                    className="collapse"
                                                    id={"taskDetails" + i}
                                                  >
                                                    <form className="taskUpdateForm p-2">
                                                      <div className="form-row">
                                                        <div className="form-group col-md-12 text-left">
                                                          <label htmlFor="taskDescription">
                                                            Description
                                                          </label>
                                                          <input
                                                            type="text"
                                                            key={
                                                              task.description +
                                                              i
                                                            }
                                                            className="form-control"
                                                            id={
                                                              "updatedTaskDescription" +
                                                              i
                                                            }
                                                            defaultValue={
                                                              task.description
                                                            }
                                                            onChange={
                                                              setTaskDescription
                                                            }
                                                          />
                                                        </div>
                                                      </div>
                                                      <div className="form-row">
                                                        <div className="form-group col-md-6 text-left">
                                                          <label htmlFor="inputState">
                                                            Status
                                                          </label>
                                                          <select
                                                            id={
                                                              "taskStatus" + i
                                                            }
                                                            key={
                                                              task.description +
                                                              i
                                                            }
                                                            className="form-control"
                                                            defaultValue={
                                                              task.status
                                                            }
                                                            onChange={
                                                              setTaskStatus
                                                            }
                                                          >
                                                            <option>
                                                              Closed
                                                            </option>
                                                            <option>
                                                              Open
                                                            </option>
                                                            <option>
                                                              In Progress
                                                            </option>
                                                            <option>
                                                              Pending Feedback
                                                            </option>
                                                            <option>
                                                              On Hold
                                                            </option>
                                                            <option>
                                                              Slack Thread
                                                            </option>
                                                            <option>
                                                              Long Term
                                                            </option>
                                                            <option>
                                                              Punted
                                                            </option>
                                                            <option>
                                                              Meeting
                                                            </option>
                                                          </select>
                                                        </div>
                                                        <div className="form-group col-md-6 text-left">
                                                          <label htmlFor="taskHoursLogged">
                                                            Hours Logged
                                                          </label>
                                                          <input
                                                            type="number"
                                                            className="form-control"
                                                            id={
                                                              "taskHoursLogged" +
                                                              i
                                                            }
                                                            key={
                                                              task.description +
                                                              i
                                                            }
                                                            step=".125"
                                                            min="0"
                                                            defaultValue={
                                                              task.hoursLogged
                                                            }
                                                            onChange={
                                                              setTaskHoursLogged
                                                            }
                                                          />
                                                        </div>
                                                      </div>
                                                      <div className="form-row">
                                                        <div className="col-md-6 p-2 text-left">
                                                          <button
                                                            type="button"
                                                            id={
                                                              "deleteTaskBtn" +
                                                              i
                                                            }
                                                            className="btn btn-sm btn-custom-red"
                                                            data-plan_id={
                                                              Plan._id
                                                            }
                                                            data-task_array_position={
                                                              i
                                                            }
                                                            data-toggle="modal"
                                                            data-target={
                                                              "#deleteTaskModal" +
                                                              i
                                                            }
                                                          >
                                                            Delete Task
                                                          </button>
                                                        </div>
                                                        <div className="col-md-6 p-2 text-right">
                                                          <button
                                                            className="btn btn-sm btn-secondary mr-1"
                                                            type="button"
                                                            data-toggle="collapse"
                                                            data-target={
                                                              "#taskDetails" + i
                                                            }
                                                            data-task_array_index={
                                                              i
                                                            }
                                                            aria-expanded="false"
                                                            aria-controls={
                                                              "taskDetails" +
                                                              task +
                                                              i
                                                            }
                                                          >
                                                            Close
                                                          </button>
                                                          <button
                                                            id={
                                                              "saveTaskBtn" + i
                                                            }
                                                            type="button"
                                                            className="btn btn-sm btn-custom"
                                                            data-plan_id={
                                                              Plan._id
                                                            }
                                                            data-task_array_position={
                                                              i
                                                            }
                                                            onClick={updateTask}
                                                            data-toggle="collapse"
                                                            data-target={
                                                              "#taskDetails" + i
                                                            }
                                                            aria-expanded="false"
                                                            aria-controls={
                                                              "taskDetails" +
                                                              task +
                                                              i
                                                            }
                                                          >
                                                            Save
                                                          </button>
                                                        </div>
                                                      </div>
                                                    </form>
                                                  </div>
                                                </div>
                                              </div>
                                              <div
                                                className="modal fade"
                                                id={"deleteTaskModal" + i}
                                                tabIndex="-1"
                                                aria-labelledby="newTaskModalLabel"
                                                aria-hidden="true"
                                              >
                                                <div className="modal-dialog">
                                                  <div className="modal-content">
                                                    <div className="modal-header">
                                                      <h5
                                                        className="modal-title"
                                                        id="deleteTaskLabel"
                                                      >
                                                        Are you sure you want to
                                                        delete this task?
                                                      </h5>
                                                      <button
                                                        type="button"
                                                        className="close"
                                                        data-dismiss="modal"
                                                        aria-label="Close"
                                                      >
                                                        <span aria-hidden="true">
                                                          &times;
                                                        </span>
                                                      </button>
                                                    </div>
                                                    <div className="modal-body">
                                                      <form className="mt-3">
                                                        <div className="form-row text-center">
                                                          <div className="col">
                                                            <input
                                                              type="text"
                                                              placeholder='Type "DELETE" to confirm you want to delete this task...'
                                                              className="form-control"
                                                              id={
                                                                "deleteTaskConfirmationInput" +
                                                                i
                                                              }
                                                              name="deleteTaskConfirmationInput"
                                                              aria-describedby="deleteTaskConfirmationHelp"
                                                            />
                                                          </div>
                                                        </div>
                                                      </form>
                                                    </div>
                                                    <div className="modal-footer">
                                                      <button
                                                        type="button"
                                                        className="btn btn-secondary"
                                                        data-dismiss="modal"
                                                      >
                                                        Close
                                                      </button>
                                                      <button
                                                        type="button"
                                                        className="btn btn-custom"
                                                        data-plan_id={Plan._id}
                                                        data-task_array_index={
                                                          i
                                                        }
                                                        onClick={deleteTask}
                                                        data-toggle="modal"
                                                        data-target={
                                                          "#deleteTaskModal" + i
                                                        }
                                                      >
                                                        Delete Task
                                                      </button>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </Draggable>
                                  );
                                }
                              })
                            : ""}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
  
  );
};

export default PlanDetails;

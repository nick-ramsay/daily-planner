import React, { useState, useEffect } from "react";
import HashLoader from "react-spinners/HashLoader";

import { logout, getCookie } from "../../sharedFunctions/sharedFunctions";
import API from "../../utils/API";
import moment from "moment";
import "./style.css";

import Navbar from "../../components/Navbar/Navbar";

const AccountOrg = () => {
  var [loading, setLoading] = useState(true);
  var [autoTasks, setAutoTasks] = useState();
  var [accountID, setAccountID] = useState(getCookie("account_id"));

  const renderAccountDetails = () => {
    console.log("API to be added...");
    setLoading((loading) => false);
    renderAutoTasks();
  };

  const saveNewScheduledTask = () => {
    console.log(moment().weekday());

    let newScheduledTaskDescription =
      document.getElementById("autoTaskDescInput").value;
    let newScheduledTaskHours = document.getElementById(
      "autoTaskDefaultHours"
    ).value;
    let newScheduledTaskWeekdays = [];
    let newScheduledTaskData;

    if (document.getElementById("new-auto-task-sunday").checked) {
      newScheduledTaskWeekdays.push(
        Number(document.getElementById("new-auto-task-sunday").value)
      );
    }
    if (document.getElementById("new-auto-task-monday").checked) {
      newScheduledTaskWeekdays.push(
        Number(document.getElementById("new-auto-task-monday").value)
      );
    }
    if (document.getElementById("new-auto-task-tuesday").checked) {
      newScheduledTaskWeekdays.push(
        Number(document.getElementById("new-auto-task-tuesday").value)
      );
    }
    if (document.getElementById("new-auto-task-wednesday").checked) {
      newScheduledTaskWeekdays.push(
        Number(document.getElementById("new-auto-task-wednesday").value)
      );
    }
    if (document.getElementById("new-auto-task-thursday").checked) {
      newScheduledTaskWeekdays.push(
        Number(document.getElementById("new-auto-task-thursday").value)
      );
    }
    if (document.getElementById("new-auto-task-friday").checked) {
      newScheduledTaskWeekdays.push(
        Number(document.getElementById("new-auto-task-friday").value)
      );
    }
    if (document.getElementById("new-auto-task-saturday").checked) {
      newScheduledTaskWeekdays.push(
        Number(document.getElementById("new-auto-task-saturday").value)
      );
    }

    newScheduledTaskData = {
      description: newScheduledTaskDescription,
      hours: Number(newScheduledTaskHours),
      weekdays: newScheduledTaskWeekdays,
      activated: true,
    };

    if (newScheduledTaskDescription !== "") {
      console.log("Make API call...");
      API.saveAutoTask(getCookie("account_id"), newScheduledTaskData).then(
        (res) => {
          console.log("Called Called saveAutoTask API");
          console.log(res);
          renderAutoTasks();
        }
      );
    }

    console.log(newScheduledTaskData);

    document.getElementById("autoTaskDescInput").value = "";
    document.getElementById("autoTaskDefaultHours").value = 0;

    let weekdayInputElements =
      document.getElementsByClassName("autoTaskWeekdays");

    for (let i = 0; i < weekdayInputElements.length; i++) {
      document.getElementsByClassName("autoTaskWeekdays")[i].checked = false;
    }
  };

  const updateAutoTask = (index) => {
    let newDescription = document.getElementById(
      "autoTaskDescription" + index
    ).value;
    let newHours = Number(
      document.getElementById("autoTaskHours" + index).value
    );
    let newWeekdays = [];
    let newAutoTaskData = {};

    if (document.getElementById("auto-task-sunday-" + index).checked) {
      newWeekdays.push(
        Number(document.getElementById("auto-task-sunday-" + index).value)
      );
    }
    if (document.getElementById("auto-task-monday-" + index).checked) {
      newWeekdays.push(
        Number(document.getElementById("auto-task-monday-" + index).value)
      );
    }
    if (document.getElementById("auto-task-tuesday-" + index).checked) {
      newWeekdays.push(
        Number(document.getElementById("auto-task-tuesday-" + index).value)
      );
    }
    if (document.getElementById("auto-task-wednesday-" + index).checked) {
      newWeekdays.push(
        Number(document.getElementById("auto-task-wednesday-" + index).value)
      );
    }
    if (document.getElementById("auto-task-thursday-" + index).checked) {
      newWeekdays.push(
        Number(document.getElementById("auto-task-thursday-" + index).value)
      );
    }
    if (document.getElementById("auto-task-friday-" + index).checked) {
      newWeekdays.push(
        Number(document.getElementById("auto-task-friday-" + index).value)
      );
    }
    if (document.getElementById("auto-task-saturday-" + index).checked) {
      newWeekdays.push(
        Number(document.getElementById("auto-task-saturday-" + index).value)
      );
    }

    newAutoTaskData = {
      description: newDescription,
      hours: newHours,
      weekdays: newWeekdays,
    };

    console.log(newAutoTaskData);
  };

  const autoTaskOnOff = (index, onOffBoolean) => {
    console.log(index);
    console.log(onOffBoolean);
    API.autoTaskOnOff(
      getCookie("account_id"),
      index,
      onOffBoolean === true ? false : true
    ); /*.then(
            () => {
                console.log();
                //setAutoTasks(autoTasks => res.data.autoTasks);
            }
        )*/
  };

  const renderAutoTasks = () => {
    API.findAutoTasks(getCookie("account_id")).then((res) => {
      console.log(res.data.autoTasks);
      setAutoTasks((autoTasks) => res.data.autoTasks);
    });
  };

  const createNewAutoLink = () => {
    console.log("Create new autoLink...");

    let newAutoLinkNameInput = document.getElementById("newAutoLinkName");
    let newTriggerRegexInput = document.getElementById("newTriggerRegex");
    let newIDExtractionRegexInput = document.getElementById(
      "newIDExtractionRegex"
    );
    let newPrecedingURLInput = document.getElementById("newPrecedingURL");
    let newLinkPrefixInput = document.getElementById("newLinkPrefix");

    let newAutoTaskInfo = {
      newAutoLinkName: newAutoLinkNameInput.value,
      newTriggerRegex: newTriggerRegexInput.value,
      newIDExtractionRegex: newIDExtractionRegexInput.value,
      newPrecedingURL: newPrecedingURLInput.value,
      newLinkPrefix: newLinkPrefixInput.value,
    };

    let allInputsCompleted = false;

    if (
      newAutoLinkNameInput.value !== "" &&
      newTriggerRegexInput.value !== "" &&
      newIDExtractionRegexInput.value !== "" &&
      newPrecedingURLInput.value !== "" &&
      newLinkPrefixInput.value !== ""
    ) {
      allInputsCompleted = true;
    }

    if (allInputsCompleted === true) {
      API.updateSettings(accountID, newAutoTaskInfo).then((res) => {
        console.log("Called Called saveAuto API");
        console.log(res);
        newAutoLinkNameInput.value = "";
        newTriggerRegexInput.value = "";
        newIDExtractionRegexInput.value = "";
        newPrecedingURLInput.value = "";
        newLinkPrefixInput.value = "";
      });
    }

    console.log("All Fields Completed: " + allInputsCompleted);
  };

  useEffect(() => {
    renderAccountDetails();
  }, []);

  return (
    <div>
      <Navbar />
      {loading === true && (
        <div className="container min-vh-100">
          <div className="row justify-content-center min-vh-100">
            <div className="col-md-12 pt-4 mt-auto mb-auto">
              <HashLoader size={200} color={"#008000"} loading={loading} />
            </div>
          </div>
        </div>
      )}
      <div className="container pt-4">
        <div className="pb-2 my-5 mb-4 bg-white px-5">
          <div className="col-md-12">
            <h2>Settings</h2>
            <div className="row">
                <div className="col-md-6">
                <button className="btn btn-sm btn-outline-dark mt-2 pr-2 pl-2" onClick={()=> window.history.back()}>⬅</button>
                </div>
                <div className="col-md-6">
              <button
                type="button"
                className="btn btn-sm btn-danger mt-2"
                onClick={logout}
              >
                Logout
              </button>
              </div>
            </div>
            <div className="accordion mt-2 mb-2" id="new-auto-task-accordion">
              <div className="card">
                <div
                  className="card-header card-header-accordion"
                  id="headingOne"
                >
                  <h2 className="mb-0">
                    <button
                      className="btn"
                      style={{ color: "white" }}
                      type="button"
                      data-toggle="collapse"
                      data-target="#collapseNewAutoTask"
                      aria-expanded="true"
                      aria-controls="new-auto-task-accordion"
                    >
                      Auto Tasks
                    </button>
                  </h2>
                </div>
                <div
                  id="collapseNewAutoTask"
                  className="collapse"
                  aria-labelledby="headingOne"
                  data-parent="#new-auto-task-accordion"
                >
                  <div className="card-body">
                    <div className="row">
                      <div className="col">
                        <h6>
                          <strong>New Auto Link</strong>
                        </h6>
                      </div>
                    </div>
                    <form>
                      <div className="row">
                        <div className="col">
                          <input
                            id="newAutoLinkName"
                            type="text"
                            className="form-control"
                            placeholder="Auto Link Name"
                          />
                        </div>
                        <div className="col">
                          <input
                            id="newTriggerRegex"
                            type="text"
                            className="form-control"
                            placeholder="Trigger Regex"
                          />
                        </div>
                        <div className="col">
                          <input
                            id="newIDExtractionRegex"
                            type="text"
                            className="form-control"
                            placeholder="ID Extraction Regex"
                          />
                        </div>
                      </div>
                      <div className="row mt-2">
                        <div className="col">
                          <input
                            id="newPrecedingURL"
                            type="text"
                            className="form-control"
                            placeholder="Preceding URL"
                          />
                        </div>
                        <div className="col">
                          <input
                            id="newLinkPrefix"
                            type="text"
                            className="form-control"
                            placeholder="Link Prefix"
                          />
                        </div>
                      </div>
                      <div className="row mt-2">
                        <div className="col">
                          <button
                            className="btn btn-sm btn-success"
                            type="button"
                            onClick={() => createNewAutoLink()}
                          >
                            Add Link
                          </button>
                        </div>
                      </div>
                    </form>
                    <div className="row mt-2">
                      <div className="col">
                        <h6>
                          <strong>Existing Auto Links</strong>
                        </h6>
                      </div>
                    </div>
                    <div>
                      {/*
                                                autoTasks !== undefined ?
                                                    autoTasks.map((autoTask, i) =>
                                                        <div className="card mb-1">
                                                            <div className="col-md-12">
                                                                <h5 data-toggle="collapse" data-target={"#autoTaskCard" + i}><strong>"{autoTasks[i].description}"</strong></h5>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-md-4">
                                                                    <div className="row">
                                                                        <div className='col-md-12'>
                                                                            <strong>On/Off</strong>
                                                                        </div>
                                                                    </div>
                                                                    <div className="custom-control custom-switch">
                                                                        <input type="checkbox" className="custom-control-input" id={"autoTaskOnOff" + i} defaultChecked={autoTasks[i].activated} onClick={() => autoTaskOnOff(i, autoTasks[i].activated)} />
                                                                        <label className="custom-control-label" htmlFor={"autoTaskOnOff" + i}></label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-4 text-center">
                                                                    <div className="row">
                                                                        <div className='col-md-12'>
                                                                            <strong>Hours</strong>
                                                                        </div>
                                                                    </div>
                                                                    <div className='row'>
                                                                        <div className='col-md-12'>
                                                                            {autoTasks[i].hours}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <div className="row">
                                                                        <div className='col-md-12'>
                                                                            <strong>Days</strong>
                                                                        </div>
                                                                    </div>
                                                                    {autoTasks[i].weekdays.map((weekday, j) =>
                                                                        <span>{moment.weekdays(weekday)}{j + 1 !== autoTasks[i].weekdays.length ? ", " : ""}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="collapse" id={"autoTaskCard" + i}>
                                                                <form>
                                                                    <div className="form-group row mt-2">
                                                                        <label htmlFor={"autoTaskDescription" + i} className="col-md-2 col-form-label">Description</label>
                                                                        <div className="col-md-10">
                                                                            <input type="text" className="form-control" id={"autoTaskDescription" + i} defaultValue={autoTask.description} />
                                                                        </div>
                                                                    </div>
                                                                    <div className="form-group row">
                                                                        <label htmlFor={"autoTaskHours" + i} className="col-md-2 col-form-label">Default Hours</label>
                                                                        <div className="col-md-10">
                                                                            <input type="number" defaultValue={autoTask.hours} step={0} min={0} className="form-control" id={"autoTaskHours" + i} />
                                                                        </div>
                                                                    </div>
                                                                    <div className="form-group row">
                                                                        <label htmlFor="autoTaskWeekdays" className="col-md-2 col-form-label">Days of Week</label>
                                                                        <div className="col-md-10">
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input autoTaskWeekdays" type="checkbox" id={"auto-task-monday-" + i} value="1" defaultChecked={autoTask.weekdays.indexOf(1) !== -1 ? true : false} />
                                                                                <label className="form-check-label" htmlFor={"auto-task-monday-" + i}>Monday</label>
                                                                            </div>
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input autoTaskWeekdays" type="checkbox" id={"auto-task-tuesday-" + i} value="2" defaultChecked={autoTask.weekdays.indexOf(2) !== -1 ? true : false} />
                                                                                <label className="form-check-label" htmlFor={"auto-task-tuesday-" + i}>Tuesday</label>
                                                                            </div>
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input autoTaskWeekdays" type="checkbox" id={"auto-task-wednesday-" + i} value="3" defaultChecked={autoTask.weekdays.indexOf(3) !== -1 ? true : false} />
                                                                                <label className="form-check-label" htmlFor={"auto-task-wednesday-" + i}>Wednesday</label>
                                                                            </div>
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input autoTaskWeekdays" type="checkbox" id={"auto-task-thursday-" + i} value="4" defaultChecked={autoTask.weekdays.indexOf(4) !== -1 ? true : false} />
                                                                                <label className="form-check-label" htmlFor={"auto-task-thursday-" + i}>Thursday</label>
                                                                            </div>
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input autoTaskWeekdays" type="checkbox" id={"auto-task-friday-" + i} value="5" defaultChecked={autoTask.weekdays.indexOf(5) !== -1 ? true : false} />
                                                                                <label className="form-check-label" htmlFor={"auto-task-friday-" + i}>Friday</label>
                                                                            </div>
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input autoTaskWeekdays" type="checkbox" id={"auto-task-saturday-" + i} value="6" defaultChecked={autoTask.weekdays.indexOf(6) !== -1 ? true : false} />
                                                                                <label className="form-check-label" htmlFor={"auto-task-saturday-" + i}>Saturday</label>
                                                                            </div>
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input autoTaskWeekdays" name="autoTaskWeekdays" type="checkbox" id={"auto-task-sunday-" + i} value="0" defaultChecked={autoTask.weekdays.indexOf(0) !== -1 ? true : false} />
                                                                                <label className="form-check-label" htmlFor={"auto-task-sunday-" + i}>Sunday</label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="form-group row justify-content-center">
                                                                        <button type="button" className="btn btn-sm btn-success" onClick={() => updateAutoTask(i)} data-auto_save_tasks_index={i}>Save</button>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    ) : ""
                                                    */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/*
                        <div className="accordion mt-2" id="new-auto-task-accordion">
                            <div className="card">
                                <div className="card-header card-header-accordion" id="headingOne">
                                    <h2 className="mb-0">
                                        <button className="btn" style={{ color: "white" }} type="button" data-toggle="collapse" data-target="#collapseNewAutoTask" aria-expanded="true" aria-controls="new-auto-task-accordion">
                                            Automatic Tasks
                                        </button>
                                    </h2>
                                </div>
                                <div id="collapseNewAutoTask" className="collapse" aria-labelledby="headingOne" data-parent="#new-auto-task-accordion">
                                    <div className="card-body">
                                        <form>
                                            <div className="form-group row">
                                                <label htmlFor="autoTaskDescInput" className="col-md-2 col-form-label">Description</label>
                                                <div className="col-md-10">
                                                    <input type="text" className="form-control" id="autoTaskDescInput" placeholder="Enter task description" />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="autoTaskDefaultHours" className="col-md-2 col-form-label">Default Hours</label>
                                                <div className="col-md-10">
                                                    <input type="number" defaultValue={0} placeholder={0} step={0} min={0} className="form-control" id="autoTaskDefaultHours" />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="inputPassword" className="col-md-2 col-form-label">Days of Week</label>
                                                <div className="col-md-10">
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input autoTaskWeekdays" type="checkbox" id="new-auto-task-monday" value="1" />
                                                        <label className="form-check-label" htmlFor="inlineCheckbox1">Monday</label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input autoTaskWeekdays" type="checkbox" id="new-auto-task-tuesday" value="2" />
                                                        <label className="form-check-label" htmlFor="new-auto-task-tuesday">Tuesday</label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input autoTaskWeekdays" type="checkbox" id="new-auto-task-wednesday" value="3" />
                                                        <label className="form-check-label" htmlFor="new-auto-task-wednesday">Wednesday</label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input autoTaskWeekdays" type="checkbox" id="new-auto-task-thursday" value="4" />
                                                        <label className="form-check-label" htmlFor="new-auto-task-thursday">Thursday</label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input autoTaskWeekdays" type="checkbox" id="new-auto-task-friday" value="5" />
                                                        <label className="form-check-label" htmlFor="new-auto-task-friday">Friday</label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input autoTaskWeekdays" type="checkbox" id="new-auto-task-saturday" value="6" />
                                                        <label className="form-check-label" htmlFor="new-auto-task-saturday">Saturday</label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input autoTaskWeekdays" name="autoTaskWeekdays" type="checkbox" id="new-auto-task-sunday" value="0" />
                                                        <label className="form-check-label" htmlFor="new-auto-task-sunday">Sunday</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group row justify-content-center">
                                                <button type="button" className="btn btn-sm btn-success" onClick={saveNewScheduledTask}>Save</button>
                                            </div>
                                        </form>
                                        <div>
                                            {
                                                autoTasks !== undefined ?
                                                    autoTasks.map((autoTask, i) =>
                                                        <div className="card mb-1">
                                                            <div className="col-md-12">
                                                                <h5 data-toggle="collapse" data-target={"#autoTaskCard" + i}><strong>"{autoTasks[i].description}"</strong></h5>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-md-4">
                                                                    <div className="row">
                                                                        <div className='col-md-12'>
                                                                            <strong>On/Off</strong>
                                                                        </div>
                                                                    </div>
                                                                    <div className="custom-control custom-switch">
                                                                        <input type="checkbox" className="custom-control-input" id={"autoTaskOnOff" + i} defaultChecked={autoTasks[i].activated} onClick={() => autoTaskOnOff(i, autoTasks[i].activated)} />
                                                                        <label className="custom-control-label" htmlFor={"autoTaskOnOff" + i}></label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-4 text-center">
                                                                    <div className="row">
                                                                        <div className='col-md-12'>
                                                                            <strong>Hours</strong>
                                                                        </div>
                                                                    </div>
                                                                    <div className='row'>
                                                                        <div className='col-md-12'>
                                                                            {autoTasks[i].hours}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <div className="row">
                                                                        <div className='col-md-12'>
                                                                            <strong>Days</strong>
                                                                        </div>
                                                                    </div>
                                                                    {autoTasks[i].weekdays.map((weekday, j) =>
                                                                        <span>{moment.weekdays(weekday)}{j + 1 !== autoTasks[i].weekdays.length ? ", " : ""}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="collapse" id={"autoTaskCard" + i}>
                                                                <form>
                                                                    <div className="form-group row mt-2">
                                                                        <label htmlFor={"autoTaskDescription" + i} className="col-md-2 col-form-label">Description</label>
                                                                        <div className="col-md-10">
                                                                            <input type="text" className="form-control" id={"autoTaskDescription" + i} defaultValue={autoTask.description} />
                                                                        </div>
                                                                    </div>
                                                                    <div className="form-group row">
                                                                        <label htmlFor={"autoTaskHours" + i} className="col-md-2 col-form-label">Default Hours</label>
                                                                        <div className="col-md-10">
                                                                            <input type="number" defaultValue={autoTask.hours} step={0} min={0} className="form-control" id={"autoTaskHours" + i} />
                                                                        </div>
                                                                    </div>
                                                                    <div className="form-group row">
                                                                        <label htmlFor="autoTaskWeekdays" className="col-md-2 col-form-label">Days of Week</label>
                                                                        <div className="col-md-10">
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input autoTaskWeekdays" type="checkbox" id={"auto-task-monday-" + i} value="1" defaultChecked={autoTask.weekdays.indexOf(1) !== -1 ? true : false} />
                                                                                <label className="form-check-label" htmlFor={"auto-task-monday-" + i}>Monday</label>
                                                                            </div>
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input autoTaskWeekdays" type="checkbox" id={"auto-task-tuesday-" + i} value="2" defaultChecked={autoTask.weekdays.indexOf(2) !== -1 ? true : false} />
                                                                                <label className="form-check-label" htmlFor={"auto-task-tuesday-" + i}>Tuesday</label>
                                                                            </div>
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input autoTaskWeekdays" type="checkbox" id={"auto-task-wednesday-" + i} value="3" defaultChecked={autoTask.weekdays.indexOf(3) !== -1 ? true : false} />
                                                                                <label className="form-check-label" htmlFor={"auto-task-wednesday-" + i}>Wednesday</label>
                                                                            </div>
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input autoTaskWeekdays" type="checkbox" id={"auto-task-thursday-" + i} value="4" defaultChecked={autoTask.weekdays.indexOf(4) !== -1 ? true : false} />
                                                                                <label className="form-check-label" htmlFor={"auto-task-thursday-" + i}>Thursday</label>
                                                                            </div>
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input autoTaskWeekdays" type="checkbox" id={"auto-task-friday-" + i} value="5" defaultChecked={autoTask.weekdays.indexOf(5) !== -1 ? true : false} />
                                                                                <label className="form-check-label" htmlFor={"auto-task-friday-" + i}>Friday</label>
                                                                            </div>
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input autoTaskWeekdays" type="checkbox" id={"auto-task-saturday-" + i} value="6" defaultChecked={autoTask.weekdays.indexOf(6) !== -1 ? true : false} />
                                                                                <label className="form-check-label" htmlFor={"auto-task-saturday-" + i}>Saturday</label>
                                                                            </div>
                                                                            <div className="form-check form-check-inline">
                                                                                <input className="form-check-input autoTaskWeekdays" name="autoTaskWeekdays" type="checkbox" id={"auto-task-sunday-" + i} value="0" defaultChecked={autoTask.weekdays.indexOf(0) !== -1 ? true : false} />
                                                                                <label className="form-check-label" htmlFor={"auto-task-sunday-" + i}>Sunday</label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="form-group row justify-content-center">
                                                                        <button type="button" className="btn btn-sm btn-success" onClick={() => updateAutoTask(i)} data-auto_save_tasks_index={i}>Save</button>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    ) : ""
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                                        */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountOrg;

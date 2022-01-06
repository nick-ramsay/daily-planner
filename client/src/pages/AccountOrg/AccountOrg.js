import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import HashLoader from "react-spinners/HashLoader";
import { css } from "@emotion/core";
import { logout, useInput, getCookie } from "../../sharedFunctions/sharedFunctions";
import API from "../../utils/API";
import moment from 'moment';
import "./style.css";

import Navbar from "../../components/Navbar/Navbar";

const override = css`
  display: block;
  margin: 0 auto;
  color: #008000;
  `;

const AccountOrg = () => {

    var [loading, setLoading] = useState(true);

    const renderAccountDetails = () => {
        console.log("API to be added...");
        setLoading(loading => false);
    }

    useEffect(() => {
        renderAccountDetails();
        console.log(moment().day());
    }, [])

    return (
        <div>
            <Navbar />
            {loading === true &&
                <div className="container min-vh-100">
                    <div className="row justify-content-center min-vh-100">
                        <div className="col-md-12 pt-4 mt-auto mb-auto">
                            <HashLoader
                                css={override}
                                size={200}
                                color={"#008000"}
                                loading={loading}
                            />
                        </div>
                    </div>
                </div>
            }
            <div className="container pt-4">
                <div className="pb-2 my-5 mb-4 bg-white px-5">
                    <div className="col-md-12">
                        <h2>User</h2>
                        <div className="accordion mt-2" id="new-auto-task-accordion">
                            <div className="card">
                                <div className="card-header" id="headingOne">
                                    <h2 className="mb-0">
                                        <button className="btn" type="button" data-toggle="collapse" data-target="#collapseNewAutoTask" aria-expanded="true" aria-controls="new-auto-task-accordion">
                                            Automatic Tasks
                                        </button>
                                    </h2>
                                </div>
                                <div id="collapseNewAutoTask" className="collapse" aria-labelledby="headingOne" data-parent="#new-auto-task-accordion">
                                    <div className="card-body">
                                        <form>
                                            <div className="form-group row">
                                                <label for="autoTaskDescInput" className="col-md-2 col-form-label">Description</label>
                                                <div className="col-md-10">
                                                    <input type="text" className="form-control" id="autoTaskDescInput" placeholder="Enter task description" />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label for="inputPassword" className="col-md-2 col-form-label">Days of Week</label>
                                                <div className="col-md-10">
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input" type="checkbox" id="new-auto-task-monday" value="1" />
                                                        <label className="form-check-label" for="inlineCheckbox1">Monday</label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input" type="checkbox" id="new-auto-task-tuesday" value="2" />
                                                        <label className="form-check-label" for="new-auto-task-tuesday">Tuesday</label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input" type="checkbox" id="new-auto-task-wednesday" value="3" />
                                                        <label className="form-check-label" for="new-auto-task-wednesday">Wednesday</label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input" type="checkbox" id="new-auto-task-thursday" value="4" />
                                                        <label className="form-check-label" for="new-auto-task-thursday">Thursday</label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input" type="checkbox" id="new-auto-task-friday" value="5" />
                                                        <label className="form-check-label" for="new-auto-task-friday">Friday</label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input" type="checkbox" id="new-auto-task-saturday" value="6" />
                                                        <label className="form-check-label" for="new-auto-task-saturday">Saturday</label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input" type="checkbox" id="new-auto-task-sunday" value="7" />
                                                        <label className="form-check-label" for="new-auto-task-sunday">Sunday</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button type="button" className="btn btn-sm btn-danger mt-2" onClick={logout}>Logout</button>

                        <h2>Organisation</h2>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default AccountOrg;
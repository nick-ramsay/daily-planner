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

                        <button type="button" className="btn btn-sm btn-danger" onClick={logout}>Logout</button>

                        <h2>Organisation</h2>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default AccountOrg;
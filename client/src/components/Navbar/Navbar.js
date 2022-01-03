import React, { useState, useEffect } from "react";
import { logout, useInput, getCookie } from "../../sharedFunctions/sharedFunctions";
import API from "../../utils/API";

import "./style.css";



const Navbar = (props) => {
    var [firstname, setFirstname] = useState("");
    var [lastname, setLastname] = useState("");

    const renderAccountName = () => {
        API.findUserName(getCookie("account_id")).then(
            (res) => {
                console.log(res);
                setFirstname(firstname => res.data.firstname);
                setLastname(lastname => res.data.lastname);
            }
        );
    };

    useEffect(() => {
        renderAccountName();
    }, []);

    return (
        <nav className="navbar navbar-dark navbar-expand-lg fixed-top">
            <a className="navbar-brand" href="/"><span>Daily Planner</span></a>
            <button className="navbar-toggler custom-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav ml-auto">
                    <a className="nav-item nav-link account-link" href="./account-org">{firstname.slice(0, 1) + lastname.slice(0, 1)}</a>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
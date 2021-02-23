import React from "react";
import "./style.css";


function NavbarLoggedOut(props) {

    return (

        <nav className="navbar navbar-expand-lg navbar-dark">
            <div className="container">
                <a className="navbar-brand" href="/"><strong>Daily Plans</strong></a>
            </div>
        </nav>

    )
}

export default NavbarLoggedOut;
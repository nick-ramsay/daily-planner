import React, { } from 'react';
import "./style.css";

const Error = () => {

    return (
        <div>
            <div className="container pt-4">
                <div className="col-md-12 my-5 px-5 bg-dark rounded content-container">
                    <div className="row text-center">
                        <div className="col-md-12">
                            <h1 className="mt-5" style={{ fontSize: 50 }}>
                                <strong>
                                    <span style={{ color: "peru" }}>¯</span>
                                    <span style={{ color: "green" }}>\</span>
                                    <span style={{ color: "red" }}>_</span>
                                    <span style={{ color: "purple" }}>(</span>
                                    <span style={{ color: "white" }}>ツ</span>
                                    <span style={{ color: "teal" }}>)</span>
                                    <span style={{ color: "gold" }}>_</span>
                                    <span style={{ color: "orange" }}>/</span>
                                    <span style={{ color: "blue" }}>¯</span>
                                </strong>
                            </h1>
                            <h1 style={{ fontSize: 100, color: "white" }}><strong>404</strong></h1>
                            <h1 style={{ fontSize: 50, color: "red" }}><strong>Oops... we have not what you seek</strong></h1>
                            <h3 className="mb-5">The page for which you're looking either doesn't exist, didn't load properly, or is temporarily unavailable.</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Error;
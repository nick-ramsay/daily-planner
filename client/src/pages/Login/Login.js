import React, { useState } from 'react';
import "./style.css";
import { useInput } from "../../sharedFunctions/sharedFunctions";
import { sha256 } from 'js-sha256';
import moment from 'moment';
import API from "../../utils/API";
import GithubLogo from "../../images/github_logos/GitHub_Logo.png";

const Login = () => {

    var [email, setEmail] = useInput("");
    var [password, setPassword] = useInput("");
    var [submissionMessage, setSubmissionMessage] = useState("");

    const login = () => {

        let cookieExpiryDate = moment().add("60", "minutes").format();

        if (email && password) {
            API.login(email, sha256(password)).then(
                res => {
                    if (res.data) {
                        setSubmissionMessage(submissionMessage => "");
                        document.cookie = "auth_expiry=" + cookieExpiryDate + "; expires=" + moment(cookieExpiryDate).format("ddd, DD MMM YYYY HH:mm:ss UTC");
                        document.cookie = "user_token=" + res.data._id + "; expires=" + moment(cookieExpiryDate).format("ddd, DD MMM YYYY HH:mm:ss UTC");
                        window.location = "/";
                    } else {
                        setSubmissionMessage(submissionMessage => "Hmm... this is incorrect. Enter your username and password again.");
                    }
                }
            )
        } else {
            setSubmissionMessage(submissionMessage => "Please complete all fields");
        }
    }

    return (
        <div>
            <div className="jumbotron jumbotron-fluid">
                <div className="container">
                    <div className="row pl-4">
                        <h1 className="mt-auto" style={{fontSize: "3rem"}}>Daily Plans</h1>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="col-md-12 mt-2">
                    <form className="p-3">
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Email address</label>
                            <input type="email" className="form-control" id="exampleInputEmail1" onChange={setEmail} aria-describedby="emailHelp" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Password</label>
                            <input type="password" className="form-control" onChange={setPassword} id="exampleInputPassword1" />
                        </div>
                        <button type="button" id="login-btn" name="login-btn" onClick={login} className="btn btn-sm btn-custom-blue">Login</button>
                        <div className="mt-3 mb-1">
                            <a href="/create-account-request">New to Investment Tracker? Create an account here!</a>
                        </div>
                        <div>
                            <a href="/reset-password-request">Forgot password? Reset here!</a>
                        </div>
                        <div className="form-group text-center">
                            <p className="submission-message" name="submissionMessage">{submissionMessage}</p>
                        </div>
                    </form>
                </div>
                <footer className="footer mt-5">
                    <div className="container text-center">
                        <a href="https://github.com/nick-ramsay/investment-tracker" target="_blank" rel="noopener noreferrer"><img src={GithubLogo} alt="Github Logo" width="60px" /></a>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default Login;
import React, { useState } from 'react';
import NavbarLoggedOut from "../../components/NavbarLoggedOut/NavbarLoggedOut";
import "./style.css";
import API from "../../utils/API";

const ResetPasswordRequest = () => {

    const useInput = (initialValue) => {
        const [value, setValue] = useState(initialValue);

        function handleChange(e) {
            setValue(e.target.value);
        }

        return [value, handleChange];
    } //This dynamicaly sets react hooks as respective form inputs are updated...


    var [email, setEmail] = useInput("");
    var [submissionMessage, setSubmissionMessage] = useState("");

    const requestPasswordResetCode = () => {
        if (email !== "") {
            API.checkExistingAccountEmails(email)
                .then(res => {
                    if (res.data !== "") {
                        API.setEmailResetCode(email)
                            .then(
                                res => {
                                    window.location.href = "/reset-password";
                                }
                            );
                    } else {
                        setSubmissionMessage(submissionMessage => ("Sorry... no account exists for this email address"));
                    }
                }
                );
        } else {
            setSubmissionMessage(submissionMessage => "Please enter an email address")
        }
    }

    return (
        <div>
            <NavbarLoggedOut />
            <div className="container">
                <div className="col-md-12 mt-2">
                    <h5 className="text-center mb-3 mt-3"><strong>Enter Your E-mail for a Password Reset Code</strong></h5>
                    <form className="p-3">
                        <div className="form-group">
                            <label htmlFor="resetEmailAddress">Email address</label>
                            <input type="email" className="form-control" id="resetEmailAddress" name="resetEmailAddress" onChange={setEmail} aria-describedby="emailHelp" />
                        </div>
                        <button type="button" className="btn btn-sm" onClick={requestPasswordResetCode}>Submit</button>
                        <div className="form-group text-center">
                            <p className="submission-message" name="submissionMessage">{submissionMessage}</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ResetPasswordRequest;
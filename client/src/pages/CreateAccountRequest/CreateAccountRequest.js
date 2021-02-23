import React, { useState } from 'react';
import { useInput } from "../../sharedFunctions/sharedFunctions";
import NavbarLoggedOut from "../../components/NavbarLoggedOut/NavbarLoggedOut";
import "./style.css";
import API from "../../utils/API";

const CreateAccountRequest = () => {

    var [email, setEmail] = useInput("");
    var [submissionMessage, setSubmissionMessage] = useState("");

    const checkEmailAvailability = () => {
        if (email !== "") {
            API.checkExistingAccountEmails(email)
                .then(res => {
                    if (res.data !== "") {
                        setSubmissionMessage(submissionMessage => ("Looks like an account already exists with this e-mail. Try logging in."));
                    } else {
                        API.setEmailVerificationToken(email)
                            .then(res => {
                                window.location = "./create-account"
                            })
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
                    <h5 className="text-center mb-3 mt-3"><strong>What e-mail would you like to use for your account?</strong></h5>
                    <form className="p-3">
                        <div className="form-group">
                            <label htmlFor="createAccountEmailAddress">Email address</label>
                            <input type="email" className="form-control" id="createAccountEmailAddress" name="createAccountEmailAddress" onChange={setEmail} aria-describedby="emailHelp" />
                        </div>
                        <button type="button" className="btn btn-sm" onClick={checkEmailAvailability}>Submit</button>
                        <div className="form-group text-center">
                            <p className="submission-message" name="submissionMessage">{submissionMessage}</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateAccountRequest;
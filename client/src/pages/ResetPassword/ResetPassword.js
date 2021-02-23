import React, { useState } from 'react';
import NavbarLoggedOut from "../../components/NavbarLoggedOut/NavbarLoggedOut";
import { sha256 } from 'js-sha256';
import "./style.css";
import API from "../../utils/API";

const ResetPassword = () => {

    const useInput = (initialValue) => {
        const [value, setValue] = useState(initialValue);

        function handleChange(e) {
            setValue(e.target.value);
        }

        return [value, handleChange];
    } //This dynamicaly sets react hooks as respective form inputs are updated...

    var [passwordResetCode, setPasswordResetCode] = useInput("");
    var [email, setEmail] = useInput("");
    var [newPassword, setNewPassword] = useInput("");
    var [newPasswordConfirm, setNewPasswordConfirm] = useInput("");
    var [submissionMessage, setSubmissionMessage] = useState("");

    const resetPassword = () => {
        if (passwordResetCode !== "" && email !== "" && newPassword !== "" && newPasswordConfirm !== "" && newPassword === newPasswordConfirm) {
            API.checkEmailAndResetToken(email, sha256(passwordResetCode)).then(
                res => {
                    if (res.data !== "") {
                        let encryptedPassword = sha256(newPassword);
                        API.resetPassword(email, encryptedPassword).then(res => window.location.href = "/");
                    } else {
                        setSubmissionMessage(submissionMessage => "Hmm... reset code doesn't appear correct for email. Please make sure you've properly entered the email and reset code.")
                    }
                });
        } else if (newPassword !== newPasswordConfirm) {
            setSubmissionMessage(submissionMessage => "Password and confirm password don't match")
        } else {
            setSubmissionMessage(submissionMessage => "Please complete all fields")
        }
    }

    return (
        <div>
            <NavbarLoggedOut />
            <div className="container">
                <div className="col-md-12 mt-2">
                    <h5 className="text-center mb-3 mt-3"><strong>Reset Your Password</strong></h5>
                    <form className="p-3">
                        <p className="text-center">Check your e-mail for your one-time reset code. Enter your reset code, email, and new password below.</p>
                        <div className="form-group">
                            <label htmlFor="passwordResetCode">Reset Code</label>
                            <input type="password" className="form-control" id="passwordResetCode" name="passwordResetCode" onChange={setPasswordResetCode} aria-describedby="passwordResetCodeHelp" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="passwordResetEmail">Email address</label>
                            <input type="email" className="form-control" id="passwordResetEmail" name="passwordResetEmail" onChange={setEmail} aria-describedby="passwordResetEmailHelp" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="passwordResetNewPassword">New Password</label>
                            <input type="password" className="form-control" id="passwordResetNewPassword" name="passwordResetNewPassword" onChange={setNewPassword} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="passwordResetNewPasswordConfirmation">Confirm New Password</label>
                            <input type="password" className="form-control" id="passwordResetNewPasswordConfirmation" name="passwordResetNewPasswordConfirmation" onChange={setNewPasswordConfirm} />
                        </div>
                        <button type="button" className="btn btn-sm" onClick={resetPassword}>Submit</button>
                        <div className="form-group text-center">
                            <p className="submission-message" name="submissionMessage">{submissionMessage}</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword;
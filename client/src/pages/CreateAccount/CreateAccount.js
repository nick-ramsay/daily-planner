import React, { useState } from 'react';
import NavbarLoggedOut from "../../components/NavbarLoggedOut/NavbarLoggedOut";
import { sha256 } from 'js-sha256';
import "./style.css";
import API from "../../utils/API";

const CreateAccount = () => {

    const useInput = (initialValue) => {
        const [value, setValue] = useState(initialValue);

        function handleChange(e) {
            setValue(e.target.value);
        }

        return [value, handleChange];
    } //This dynamicaly sets react hooks as respective form inputs are updated...


    var [firstname, setFirstname] = useInput("");
    var [lastname, setLastname] = useInput("");
    var [phone, setPhone] = useInput("");
    var [email, setEmail] = useInput("");
    var [emailVerificationToken, setEmailVerficationToken] = useInput("");
    var [password, setPassword] = useInput("");
    var [confirmPassword, setConfirmPassword] = useInput("");
    var [submissionMessage, setSubmissionMessage] = useState("");

    const createNewAccount = () => {

        let currentAccountInfo = {
            email: email,
            phone: phone,
            firstname: firstname,
            lastname: lastname,
            password: sha256(password),
            sessionAccessToken: null,
            passwordResetToken: null
        }

        if (firstname !== "" && lastname !== "" && email !== "" && password !== "" && emailVerificationToken !== "" && confirmPassword !== "" && password === confirmPassword) {
            setSubmissionMessage(submissionMessage => "");
            API.checkEmailVerificationToken(email, emailVerificationToken).then(
                res => {
                    if (res.data !== "") {
                        console.log(res.data)
                        API.checkExistingAccountEmails(currentAccountInfo.email)
                            .then(res => {
                                if (res.data === "") {
                                    API.createAccount(currentAccountInfo).then(res => {
                                        API.deleteEmailVerificationToken(email).then(res =>
                                            window.location.href = "/"
                                        )
                                });
                    } else {
                        setSubmissionMessage(submissionMessage => ("Sorry... an account already exists for this email."));
                    }
                }
            );
        } else {
            setSubmissionMessage(submissionMessage => "Hmm... reset code doesn't appear correct for email. Please make sure you've properly entered the email and reset code.")
        }
    });

} else if (password !== confirmPassword) {
    setSubmissionMessage(submissionMessage => ("Password and confirm password fields don't match..."));
}
else {
    setSubmissionMessage(submissionMessage => ("Not enough info entered..."));
}
    }

return (
    <div>
        <NavbarLoggedOut />
        <div className="container">
            <div className="col-md-12 mt-2">
                <h5 className="text-center mb-3 mt-3"><strong>Create Account</strong></h5>
                <p className="text-center">Please check your e-mail for your verification token.</p>
                <form className="p-3">
                    <div className="row mb-3">
                        <div className="col">
                            <label htmlFor="createAccountFirstName">First Name</label>
                            <input type="text" className="form-control" id="createAccountFirstName" name="createAccountFirstName" onChange={setFirstname} aria-describedby="createAccountFirstnameHelp" />
                        </div>
                        <div className="col">
                            <label htmlFor="createAccountFirstName">Last Name</label>
                            <input type="text" className="form-control" id="createAccountLastName" name="createAccountLastName" onChange={setLastname} aria-describedby="createAccountLastnameHelp" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="createAccountEmail">Email address</label>
                        <input type="email" className="form-control" id="createAccountEmail" name="createAccountEmail" onChange={setEmail} aria-describedby="createAccountEmailHelp" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="createAccountPhone">Phone Number</label>
                        <input type="text" className="form-control" id="createAccountPhone" name="createAccountPhone" onChange={setPhone} aria-describedby="createAccountPhoneHelp" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="createAccountEmailVerificationToken">Email Verification Token</label>
                        <input type="password" className="form-control" id="createAccountEmailVerificationToken" onChange={setEmailVerficationToken} name="createAccountEmailVerificationToken" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="createAccountPassword">Password</label>
                        <input type="password" className="form-control" id="createAccountPassword" onChange={setPassword} name="createAccountPassword" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="createAccountPasswordConfirm">Confirm Password</label>
                        <input type="password" className="form-control" id="createAccountPasswordConfirm" name="createAccountPasswordConfirm" onChange={setConfirmPassword} />
                    </div>
                    <button type="button" className="btn btn-sm" onClick={createNewAccount}>Create</button>
                    <div className="form-group text-center">
                        <p className="submission-message" name="submissionMessage">{submissionMessage}</p>
                    </div>
                </form>
            </div>
        </div>
    </div>
)
}

export default CreateAccount;
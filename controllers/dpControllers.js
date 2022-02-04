const db = require("../models");
const sha256 = require('js-sha256').sha256;
const sgMail = require('@sendgrid/mail');
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const keys = require("../keys");

const gmailClientId = keys.gmail_credentials.gmailClientId;
const gmailClientSecret = keys.gmail_credentials.gmailClientSecret;
const gmailRefreshToken = keys.gmail_credentials.gmailRefreshToken;
const sendGridAPIKey = keys.gmail_credentials.sendGridAPIKey;

sgMail.setApiKey(sendGridAPIKey);

const oauth2Client = new OAuth2(
    gmailClientId, // ClientID
    gmailClientSecret, // Client Secret
    "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
    refresh_token: gmailRefreshToken
});

const accessToken = oauth2Client.getAccessToken();

const smtpTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: "OAuth2",
        user: "applications.nickramsay@gmail.com",
        //user: gmailUserId,
        //pass: gmailPassword,
        clientId: gmailClientId,
        clientSecret: gmailClientSecret,
        refreshToken: gmailRefreshToken,
        accessToken: accessToken
    }
});

let useGmail = true;
let useSendgrid = true;

module.exports = {
    //START: User Account Controllers...
    sendEmail: function (req, res) {
        console.log("Called send test e-mail controller...");
        //SENDGRID LOGIC BELOW...

        let messageParameters = req.body[0];

        let msg = {
            to: messageParameters.recipientEmail,
            from: 'applications.nickramsay@gmail.com',
            subject: '"' + messageParameters.subject + '" from ' + messageParameters.senderName + ' via SendGrid',
            text: messageParameters.message,
            html: '<strong>' + messageParameters.message + '</strong>'
        };

        if (useSendgrid) {
            sgMail.send(msg);
        }

        //GMAIL CREDENTIALS BELOW...

        let mailOptions = {
            from: 'applications.nickramsay@gmail.com',
            to: messageParameters.recipientEmail,
            subject: '"' + messageParameters.subject + '" from ' + messageParameters.senderName,
            text: messageParameters.message
        };

        if (useGmail) {
            smtpTransport.sendMail(mailOptions, (error, response) => {
                error ? console.log(error) : console.log(response);
                smtpTransport.close();
            });
        }
    },
    createAccount: function (req, res) {
        console.log("Called Create Account controller");
        db.Accounts
            .create(req.body)
            .then(dbModel => res.json(dbModel))
            .then(console.log(req.body))
            .catch(err => res.status(422).json(err));
    },
    checkExistingAccountEmails: function (req, res) {
        console.log("Called check accounts controller...");
        db.Accounts
            .find({ email: req.body[0] }, { email: 1, _id: 0 }).sort({})
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err));
    },
    setEmailVerficationToken: function (req, res) {
        console.log("Called check set e-mail verification token controller...");
        let email = req.body.email;
        let emailVerificationToken = Math.floor((Math.random() * 999999) + 100000).toString();

        db.AccountCreationRequests
            .replaceOne({ email: email }, { email: email, emailVerificationToken: emailVerificationToken }, { upsert: true })
            .then(dbModel => {
                res.json(dbModel[0]),
                    smtpTransport.sendMail({
                        from: 'applications.nickramsay@gmail.com',
                        to: email,
                        subject: "Your Email Verification Code",
                        text: "Your e-mail verification code is: " + emailVerificationToken
                    }, (error, response) => {
                        error ? console.log(error) : console.log(response);
                        smtpTransport.close();
                    })
            })
            .catch(err => res.status(422).json(err));
    },
    checkEmailVerificationToken: function (req, res) {
        console.log("Called checkEmailVerificationController controller...");

        db.AccountCreationRequests
            .find({ email: req.body.email, emailVerificationToken: req.body.emailVerificationToken }, { email: 1 })
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err))
    },
    deleteEmailVerificationToken: function (req, res) {
        console.log("Called deleteEmailVerificationController controller...");

        db.AccountCreationRequests
            .remove({ email: req.body.email })
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err))
    },
    resetPasswordRequest: function (req, res) {
        console.log("Called reset password request controller...");
        let resetToken = Math.floor((Math.random() * 999999) + 100000).toString();

        db.Accounts
            .updateOne({ email: req.body[0] }, { passwordResetToken: sha256(resetToken) })
            .then(dbModel => {
                res.json(dbModel[0]),
                    smtpTransport.sendMail({
                        from: 'applications.nickramsay@gmail.com',
                        to: req.body[0],
                        subject: "Your Password Reset Code",
                        text: "Your password reset code is: " + resetToken
                    }, (error, response) => {
                        error ? console.log(error) : console.log(response);
                        smtpTransport.close();
                    })
            })
            .catch(err => res.status(422).json(err));
    },
    checkEmailAndToken: function (req, res) {
        console.log("Called check email and token controller...");

        db.Accounts
            .find({ email: req.body.email, passwordResetToken: req.body.resetToken }, { email: 1 })
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err));
    },
    resetPassword: function (req, res) {
        console.log("Called reset password controller...");

        db.Accounts
            .updateOne({ email: req.body.email }, { password: req.body.newPassword, passwordResetToken: null })
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err));
    },
    login: function (req, res) {
        console.log("Called login controller...");

        db.Accounts
            .find({ email: req.body.email, password: req.body.password }, { _id: 1 })
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err));
    },
    findUserName: (req, res) => {
        db.Accounts
            .find({ _id: req.body.account_id }, { _id: -1, firstname: 1, lastname: 1 })
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err));
    },
    saveAutoTask: (req, res) => {
        console.log("Called saveAutoTask controller...");
        console.log(req.body);

        db.Accounts
            .updateOne({ _id: req.body.account_id }, { $push: { autoTasks: req.body.auto_task_data } })
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err));
    },
    findAutoTasks: (req, res) => {
        db.Accounts
            .find({ _id: req.body.account_id }, { autoTasks: 1 })
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err));
    },
    autoTaskOnOff: (req, res) => {
        console.log(req.body);
        /*db.Accounts
            .updateOne({ _id: req.body.account_id }, {$push: autoTasks.$[index].activated: req.body.onOffBoolean })
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err));
            */
    },
    setSessionAccessToken: function (req, res) {
        console.log("Called session token set controller...");

        let sessionAccessToken = Math.floor((Math.random() * 999999) + 100000).toString();

        db.Accounts
            .updateOne({ _id: req.body.id }, { sessionAccessToken: sha256(sessionAccessToken) })
            .then(dbModel => {
                res.json({
                    dbModel: dbModel[0],
                    sessionAccessToken: sha256(sessionAccessToken)
                });
            })
            .catch(err => res.status(422).json(err));
    },
    fetchAccountDetails: function (req, res) {
        console.log("Called fetch account details controller...");

        db.Accounts
            .find({ _id: req.body.id }, { password: 0, sessionAccessToken: 0, passwordResetToken: 0, _id: 0 }).sort({})
            .then(dbModel => res.json(dbModel[0]))
            .catch(err => res.status(422).json(err));
    },
    testBackendToken: function (req, res) {
        console.log("Called test token controller...");
        var testToken;
        testToken = Math.floor(Math.random() * 100000);
        var testJSON = { body: testToken };
        res.json(testJSON);
    },
    //END: User Account Controllers...
    createPlan: function (req, res) {
        console.log("Called Create Plan controller");
        console.log(req.body);
        db.Plans
            .create(req.body)
            .then(dbModel => res.json(dbModel))
            .then(console.log(req.body))
            .catch(err => res.status(422).json(err));
    },
    findAllPlans: function (req, res) {
        console.log("Called Find All Plans Controller");
        console.log(req.body);
        db.Plans
            .find({ account_id: req.body.account_id })
            .sort({ created_date: -1 })
            .then(dbModel => res.json(dbModel))
            .then(console.log(req.body))
            .catch(err => res.status(422).json(err));
    },
    findPlan: function (req, res) {
        console.log("Called Find One Plans Controller");
        console.log(req.body);
        db.Plans
            .findOne({ _id: req.body.planID })
            .then(dbModel => res.json(dbModel))
            .then(console.log(req.body))
            .catch(err => res.status(422).json(err));
    },
    deleteOnePlan: function (req, res) {
        console.log(req.body);
        db.Plans
            .deleteOne({ _id: req.body.planID })
            .then(dbModel => res.json(dbModel))
            .then(console.log(req.body))
            .catch(err => res.status(422).json(err));
    },
    updatePlanTasks: function (req, res) {
        console.log(req.body);
        db.Plans
            .update({ _id: req.body.planID }, { $set: { tasks: req.body.tasks } })
            .then(dbModel => res.json(dbModel))
            .then(console.log(req.body))
            .catch(err => res.status(422).json(err));
    },
    updateTask: function (req, res) {
        console.log("Called update task controller!");
        console.log(req.body);

        db.Plans
            .updateOne({ _id: req.body.planID, "tasks.description": req.body.taskDescription },
                {
                    $set: { "tasks.$.status": req.body.newStatus, "tasks.$.hoursLogged": req.body.newHoursLogged, "tasks.$.description": req.body.newTaskDescription }
                }
            )
            .then(dbModel => res.json(dbModel))
            .then(console.log(req.body))
            .catch(err => res.status(422).json(err));
    },
    checkExistingTasks: function (req, res) {
        console.log("Called checkExistingTasks Controller");
        console.log(req.body);
        db.Plans
            .findOne({ _id: req.body.planID, "task.$.description": req.body.taskDescription })
            .then(dbModel => res.json(dbModel))
            .then(console.log(req.body))
            .catch(err => res.status(422).json(err));
    },
    linkJIRA: function (req, res) {
        console.log("Called link JIRA controller!");
        console.log(req.body);

        db.Plans
            .updateOne({ _id: req.body.PlanID, "tasks.description": req.body.taskDescription },
                {
                    $push: { "tasks.$.jiras": req.body.linkJIRAID }
                }
            )
            .then(dbModel => res.json(dbModel))
            .then(console.log(req.body))
            .catch(err => res.status(422).json(err));
    },
    removeJira: function (req, res) {
        console.log("Called removeJIRA controller!");
        console.log(req.body);

        db.Plans.
            updateOne({ _id: req.body.PlanID, "tasks.description": req.body.taskDescription },
                {
                    $set: { "tasks.$.jiras": req.body.newJiraArray }
                }
            )
            .then(dbModel => res.json(dbModel))
            .then(console.log(req.body))
            .catch(err => res.status(422).json(err));
    },
    replaceTaskArray: (req, res) => {
        console.log("Called replaceTaskArray controller...");
        console.log(req.body);
        db.Plans.
            updateOne({ _id: req.body.PlanID },
                { tasks: req.body.newTaskArray })
            .then(dbModel => res.json(dbModel))
            .then(console.log(req.body))
            .catch(err => res.status(422).json(err));

    },
    updateTaskOrder: function (req, res) {
        console.log("Called updateTaskOrder controller...");

        db.Plans.
            updateOne({ _id: req.body.PlanID, "tasks.description": req.body.taskDescription },
                {
                    $set: { "tasks": req.body.newTaskArray }
                }
            )
            .then(dbModel => res.json(dbModel))
            .then(console.log(req.body))
            .catch(err => res.status(422).json(err));
    },
    findImportPuntedTasks: function (req, res) {
        let selectedImportPlan = req.body.selectedImportPlan;
        db.Plans
            .find({ _id: selectedImportPlan })
            .then(dbModel => console.log(res.json(dbModel)))
            .then(console.log(req.body))
            .catch(err => res.status(422).json(err));
    },
    findImportablePlans: function (req, res) {
        console.log("Called Find All Plans Controller");
        db.Plans
            .find({ account_id: req.body.account_id }, { _id: 1, plan_name: 1, created_date: 1 })
            .sort({ created_date: -1 })
            .then(dbModel => res.json(dbModel))
            .then(console.log(req.body))
            .catch(err => res.status(422).json(err));
    },
    importTasks: function (req, res) {
        db.Plans
            .update({ _id: req.body.PlanID }, { $push: { tasks: { $each: req.body.approvedImportedTasks } } })
            .then(dbModel => res.json(dbModel))
            .then(console.log(req.body))
            .catch(err => res.status(422).json(err));
    },
    deleteTask: function (req, res) {
        console.log("Called delete task controller!");

        db.Plans
            .updateOne({ _id: req.body.planID, "tasks.description": req.body.taskDescription },
                {
                    $set: { "tasks.$.deletion_date": req.body.deletionDate }
                }
            )
            .then(dbModel => res.json(dbModel))
            .then(console.log(req.body))
            .catch(err => res.status(422).json(err));
    }
};
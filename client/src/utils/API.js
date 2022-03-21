import axios from "axios";

const apiURL = process.env.NODE_ENV === 'production' ? '' : '//localhost:3001'

export default {
    //START: Account APIs...
    sendEmail: function (messageInfo) {
        return axios({ method: "post", url: apiURL + "/api/daily-planner/send-email", data: [messageInfo] });
    },
    createAccount: function (newAccountInfo) {
        return axios({ method: "post", url: apiURL + "/api/daily-planner/create-account", data: newAccountInfo })
    },
    setEmailVerificationToken: function (email) {
        return axios({ method: "post", url: apiURL + "/api/daily-planner/set-email-verification-token", data: { email: email } })
    },
    checkEmailVerificationToken: function (email, emailVerificationToken) {
        return axios({ method: "post", url: apiURL + "/api/daily-planner/check-email-verification-token", data: { email: email, emailVerificationToken: emailVerificationToken } })
    },
    deleteEmailVerificationToken: function (email) {
        return axios({ method: "post", url: apiURL + "/api/daily-planner/delete-email-verification-token", data: { email: email } })
    },
    checkExistingAccountEmails: function (email) {
        return axios({ method: "post", url: apiURL + "/api/daily-planner/check-existing-account-emails", data: [email] });
    },
    setEmailResetCode: function (email, generatedResetToken) {
        return axios({ method: "post", url: apiURL + "/api/daily-planner/reset-password-request", data: [email, generatedResetToken] });
    },
    checkEmailAndResetToken: function (email, resetToken) {
        return axios({ method: "post", url: apiURL + "/api/daily-planner/check-email-and-reset-token", data: { email: email, resetToken: resetToken } });
    },
    resetPassword: function (email, newPassword) {
        return axios({ method: "post", url: apiURL + "/api/daily-planner/reset-password", data: { email: email, newPassword: newPassword } });
    },
    login: function (email, password) {
        return axios({ method: "post", url: apiURL + "/api/daily-planner/reset-login", data: { email: email, password: password } });
    },
    setSessionAccessToken: function (id, sessionAccessToken) {
        return axios({ method: "post", url: apiURL + "/api/daily-planner/set-session-access-token", data: { id: id, sessionAccessToken: sessionAccessToken } });
    },
    findUserName: (account_id) => {
        return axios({ method: "post", url: apiURL + "/api/daily-planner/find-user-name", data: { account_id: account_id} });
    },
    saveAutoTask: (account_id, auto_task_data) => {
        return axios({ method: "post", url: apiURL + "/api/daily-planner/save-auto-task", data: { account_id: account_id, auto_task_data: auto_task_data} });
    },
    findAutoTasks: (account_id) => {
        return axios({ method: "post", url: apiURL + "/api/daily-planner/find-auto-tasks", data: { account_id: account_id} });
    },
    autoTaskOnOff: (account_id, index, onOffBoolean) => {
        return axios({ method: "post", url: apiURL + "/api/daily-planner/auto-task-on-off", data: { account_id: account_id, index: index, onOffBoolean: onOffBoolean} });
    },
    //END: Account APIs...
    createPlan: function (plan_name, account_id, plan_status, created_date) {
        return axios({ method: "post", url: apiURL + "/api/daily-planner/create-plan", data: { plan_name, account_id, plan_status, created_date } });
    },
    findAllPlans: function (account_id) {
        console.log("API: "+ account_id);
        return axios({ method: "post", url: apiURL + "/api/daily-planner/find-all-plans", data: {account_id: account_id} });
    },
    findPlan: function (planID) {
        console.log(planID);
        return axios({ method: "post", url: apiURL + "/api/daily-planner/find-plan", data: { planID } });
    },
    deleteOnePlan: function (planID) {
        return axios({ method: "post", url: apiURL + "/api/daily-planner/delete-one-plan", data: { planID } });
    },
    updatePlanTasks: function (planID, tasks) {
        return axios({ method: "post", url: apiURL + "/api/daily-planner/update-plan-tasks", data: { planID, tasks } })
    },
    updateTask: function (planID, taskDescription, taskArrayPosition, newHoursLogged, newStatus, newTaskDescription, newLinks) {
        return axios({ method: "post", url: apiURL + "/api/daily-planner/update-task", data: { planID, taskDescription, taskArrayPosition, newHoursLogged, newStatus, newTaskDescription, newLinks } })
    },
    checkExistingTasks: function (planID, newTaskDescription) {
        return axios({ method: "post", url: apiURL + "/api/daily-planner/check-existing-tasks", data: { planID, newTaskDescription } });
    },
    linkJIRA: function (PlanID, taskDescription, taskArrayPosition, linkJIRAID) {
        return axios({ method: "post", url: apiURL + "/api/daily-planner/link-jira", data: { PlanID, taskDescription, taskArrayPosition, linkJIRAID } });
    },
    removeJIRA: function (PlanID, taskDescription, newJiraArray) {
        return axios({ method: "post", url: apiURL + "/api/daily-planner/remove-jira", data: { PlanID, taskDescription, newJiraArray } });
    },
    replaceTaskArray: (PlanID, newTaskArray) => {
        return axios({ method: "put", url: apiURL + "/api/daily-planner/replace-task-array", data: { PlanID, newTaskArray } });
    },
    updateTaskOrder: function (PlanID, taskDescription, newTaskArray) {
        return axios({ method: "post", url: apiURL + "/api/daily-planner/update-task-order", data: { PlanID, taskDescription, newTaskArray } });
    },
    findImportPuntedTasks: function (selectedImportPlan) {
        return axios({ method: "post", url: apiURL + "/api/daily-planner/find-import-punted-tasks", data: { selectedImportPlan } });
    },
    findImportableTasks: function (account_id) {
        return axios({ method: "post", url: apiURL + "/api/daily-planner/find-importable-plans", data: {account_id} });
    },
    importTasks: function (PlanID, approvedImportedTasks) {
        return axios({ method: "post", url: apiURL + "/api/daily-planner/import-tasks", data: {PlanID, approvedImportedTasks} });
    },
    deleteTask: function (PlanID, taskDescription, deletionDate) {
        return axios({ method: "post", url: apiURL + "/api/daily-planner/delete-task", data: {PlanID, taskDescription, deletionDate} });
    }
};
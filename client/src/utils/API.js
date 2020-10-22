import axios from "axios";

const apiURL = process.env.NODE_ENV === 'production' ? '' : '//localhost:3001'

export default {
    createPlan: function (plan_name, plan_status, created_date) {
        return axios({ method: "post", url: apiURL + "/api/daily-planner/create-plan", data: { plan_name, plan_status, created_date } });
    },
    findAllPlans: function () {
        return axios({ method: "post", url: apiURL + "/api/daily-planner/find-all-plans", data: {} });
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
    updateTask: function (planID, taskDescription, taskArrayPosition, newHoursLogged, newStatus) {
        return axios({ method: "post", url: apiURL + "/api/daily-planner/update-task", data: { planID, taskDescription, taskArrayPosition, newHoursLogged, newStatus } })
    },
    checkExistingTasks: function (planID, newTaskDescription) {
        console.log(planID);
        return axios({ method: "post", url: apiURL + "/api/daily-planner/check-existing-tasks", data: { planID, newTaskDescription } });
    },
};
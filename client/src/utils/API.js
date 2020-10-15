import axios from "axios";

const apiURL = process.env.NODE_ENV === 'production' ? '' : '//localhost:3001'

export default {
    createPlan: function (plan_name, plan_status, created_date) {
        return axios({ method: "post", url: apiURL + "/api/daily-planner/create-plan", data: { plan_name, plan_status, created_date } });
    },
    findAllPlans: function () {
        return axios({ method: "post", url: apiURL + "/api/daily-planner/find-all-plans", data: {} });
    },
    deleteOnePlan: function (planID) {
        return axios({ method: "post", url: apiURL + "/api/daily-planner/delete-one-plan", data: { planID } });
    }
};
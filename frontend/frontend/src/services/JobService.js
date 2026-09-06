import axios from "axios";

const API_URL = "http://localhost:8080/api/jobs";

export const createJob = async (jobData) => {
    return await axios.post(API_URL, jobData);
};

export const getAllJobs = async () => {
    return await axios.get(API_URL);
};
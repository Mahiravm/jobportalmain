import axios from "axios";

const API_URL = "http://localhost:8080/api/applications";

export const applyJob = async (applicationData) => {
    return await axios.post(API_URL, applicationData);
};
export const getApplicationsByJob = async (jobId) => {
    return await axios.get(
        `http://localhost:8080/api/applications/job/${jobId}`
    );
};

export const getAllApplications = async () => {
    return await axios.get(API_URL);
}; 
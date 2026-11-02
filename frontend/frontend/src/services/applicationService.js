import axios from "axios";

const API_URL = "http://localhost:8080/api/applications";

export const applyJob = async (applicationData) => {
    return await axios.post(API_URL, applicationData);
};

export const applyJobWithFile = async (jobId, userId, file) => {
    const formData = new FormData();
    formData.append("userId", userId);
    if (file) {
        formData.append("file", file);
    }
    return await axios.post(`${API_URL}/${jobId}/apply`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

export const getApplicationsByJob = async (jobId) => {
    return await axios.get(`${API_URL}/job/${jobId}`);
};

export const getApplicantDetailsByRecruiter = async (jobId, recruiterId) => {
    return await axios.get(`http://localhost:8080/api/recruiter/jobs/${jobId}/applicants?recruiterId=${recruiterId}`);
};

export const getMyApplications = async (userId) => {
    return await axios.get(`${API_URL}/my-applications?userId=${userId}`);
};

export const getAiResult = async (applicationId) => {
    return await axios.get(`${API_URL}/${applicationId}/ai-result`);
};

export const getAllApplications = async () => {
    return await axios.get(API_URL);
};

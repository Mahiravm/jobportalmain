import { useEffect, useState } from "react";
import { getAllJobs } from "../services/JobService";
import { applyJob, getMyApplications } from "../services/applicationService";
import "./CandidateDashboard.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CandidateDashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const [activeTab, setActiveTab] = useState("jobs"); // "jobs" or "applications"
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [resumeUploaded, setResumeUploaded] = useState(false);
    const [uploadingResume, setUploadingResume] = useState(false);
    const [applyingJobId, setApplyingJobId] = useState(null);
    const [selectedAiApp, setSelectedAiApp] = useState(null); // For AI modal
    const [selectedJobDetails, setSelectedJobDetails] = useState(null); // For Job Description modal

    const refreshApplications = async () => {
        if (!user?.id) return;
        try {
            const res = await getMyApplications(user.id);
            setApplications(res.data || []);
        } catch (err) {
            console.error("Error fetching applications:", err);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        let isMounted = true;

        const loadInitialData = async () => {
            try {
                const jobRes = await getAllJobs();
                if (isMounted) {
                    setJobs(jobRes.data || []);
                }
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }

            if (user?.id) {
                try {
                    const res = await axios.get(`http://localhost:8080/api/user/${user.id}`);
                    if (isMounted && res.data && res.data.resumePath) {
                        setResumeUploaded(true);
                    }
                } catch (err) {
                    console.error("Error checking resume:", err);
                }

                try {
                    const appRes = await getMyApplications(user.id);
                    if (isMounted) {
                        setApplications(appRes.data || []);
                    }
                } catch (err) {
                    console.error("Error fetching applications:", err);
                }
            }
        };

        loadInitialData();

        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleResumeUpload = async (file) => {
        if (!file || !user?.id) return;
        const formData = new FormData();
        formData.append("file", file);
        setUploadingResume(true);

        try {
            await axios.post(`http://localhost:8080/api/resume/upload/${user.id}`, formData);
            alert("Resume uploaded successfully! Groq AI will use this document for ATS evaluations.");
            setResumeUploaded(true);
        } catch (error) {
            console.error("Resume upload error:", error);
            alert("Resume upload failed. Please verify the file format (.pdf, .docx).");
        } finally {
            setUploadingResume(false);
        }
    };

    const handleApply = async (jobId) => {
        if (!resumeUploaded) {
            alert("Please upload your resume before applying.");
            return;
        }

        setApplyingJobId(jobId);
        try {
            const response = await applyJob({
                userId: user.id,
                jobId: jobId
            });

            const score = response.data && response.data.matchScore !== null
                ? `${response.data.matchScore}%`
                : "Calculated";

            alert(`Application submitted successfully! AI Match Score: ${score}`);
            await refreshApplications();
            setActiveTab("applications"); // Switch tab so applicant can view their AI match analysis
        } catch (error) {
            console.error("Application error:", error);
            const msg = error.response?.data?.message || "Application failed. Please try again.";
            alert(msg);
        } finally {
            setApplyingJobId(null);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    const hasApplied = (jobId) => {
        return applications.some(app => app.jobId === jobId);
    };

    return (
        <div className="candidate-container">
            {/* Header */}
            <div className="candidate-header">
                <div>
                    <h2>Welcome, {user?.name || "Candidate"}</h2>
                    <p className="subtitle">AI-Powered Job Portal & ATS Matcher</p>
                </div>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>

            {/* Navigation Tabs */}
            <div className="dashboard-tabs">
                <button
                    className={`tab-btn ${activeTab === "jobs" ? "active" : ""}`}
                    onClick={() => setActiveTab("jobs")}
                >
                    Available Jobs ({jobs.length})
                </button>
                <button
                    className={`tab-btn ${activeTab === "applications" ? "active" : ""}`}
                    onClick={() => {
                        setActiveTab("applications");
                        refreshApplications();
                    }}
                >
                    My Applications & AI Analysis ({applications.length})
                </button>
            </div>

            {/* Resume Upload Status Bar */}
            <div className="resume-box">
                <div className="resume-info">
                    <strong>Resume Profile: </strong>
                    {resumeUploaded ? (
                        <span className="status-badge success">Resume Uploaded & Active</span>
                    ) : (
                        <span className="status-badge warning">No Resume Uploaded</span>
                    )}
                </div>
                <div className="resume-actions">
                    <label className="upload-label">
                        {uploadingResume ? "Uploading..." : (resumeUploaded ? "Update Resume" : "Upload Resume (PDF/DOCX)")}
                        <input
                            type="file"
                            accept=".pdf,.docx,.txt"
                            disabled={uploadingResume}
                            onChange={(e) => handleResumeUpload(e.target.files[0])}
                            style={{ display: "none" }}
                        />
                    </label>
                    {resumeUploaded && (
                        <button
                            className="view-btn"
                            onClick={() => window.open(`http://localhost:8080/api/resume/view/${user.id}`, "_blank")}
                        >
                            View Resume
                        </button>
                    )}
                </div>
            </div>

            {/* TAB 1: Available Jobs */}
            {activeTab === "jobs" && (
                <div className="job-section">
                    <h3 className="section-title">Explore Open Positions</h3>
                    {jobs.length === 0 ? (
                        <p className="empty-msg">No job openings available currently.</p>
                    ) : (
                        <div className="job-grid">
                            {jobs.map((job) => {
                                const applied = hasApplied(job.id);
                                const isApplying = applyingJobId === job.id;

                                return (
                                    <div key={job.id} className="job-card">
                                        <div className="job-card-header">
                                            <h3>{job.title}</h3>
                                            <span className="company-badge">{job.company}</span>
                                        </div>

                                        <p><strong>Location:</strong> {job.location}</p>
                                        <p><strong>Salary:</strong> ₹{job.salary ? job.salary.toLocaleString() : "Not specified"}</p>

                                        {job.skills && (
                                            <div className="skills-block">
                                                <strong>Required Skills:</strong>
                                                <div className="skills-tags">
                                                    {job.skills.split(/[,;]+/).map((s, idx) => s.trim() && (
                                                        <span key={idx} className="skill-tag">{s.trim()}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <p className="job-description-preview">
                                            {job.description && job.description.length > 140
                                                ? `${job.description.substring(0, 140)}...`
                                                : job.description}
                                        </p>

                                        <div className="card-buttons">
                                            <button
                                                className="details-btn"
                                                onClick={() => setSelectedJobDetails(job)}
                                            >
                                                Full Description
                                            </button>

                                            <button
                                                className={`apply-btn ${applied ? "applied" : ""}`}
                                                disabled={!resumeUploaded || applied || isApplying}
                                                onClick={() => handleApply(job.id)}
                                            >
                                                {isApplying
                                                    ? "Analyzing with Groq AI..."
                                                    : (applied
                                                        ? "Applied"
                                                        : (resumeUploaded ? "Apply Now" : "Upload Resume to Apply"))}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: My Applications & Groq AI Results */}
            {activeTab === "applications" && (
                <div className="applications-section">
                    <h3 className="section-title">My Job Applications & AI Matching Results</h3>
                    {applications.length === 0 ? (
                        <div className="empty-box">
                            <p>You haven't applied to any jobs yet.</p>
                            <button className="apply-btn" onClick={() => setActiveTab("jobs")}>Browse Jobs</button>
                        </div>
                    ) : (
                        <div className="applications-list">
                            {applications.map((app) => (
                                <div key={app.applicationId || app.id} className="application-card">
                                    <div className="app-card-top">
                                        <div>
                                            <h4>{app.jobTitle}</h4>
                                            <p className="company-text">{app.company} &bull; {app.location}</p>
                                            <p className="applied-date">
                                                Applied on: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "Recently"}
                                            </p>
                                        </div>

                                        <div className="score-badge-container">
                                            <div className={`score-circle ${getScoreClass(app.matchScore)}`}>
                                                <span className="score-num">{app.matchScore !== null ? `${app.matchScore}%` : "Pending"}</span>
                                                <span className="score-label">AI Match</span>
                                            </div>
                                            <span className="app-status-badge">{app.status || "APPLIED"}</span>
                                        </div>
                                    </div>

                                    {/* Matching and Missing Skills */}
                                    <div className="skills-summary">
                                        <div className="skill-group">
                                            <span className="group-label">Matching Skills:</span>
                                            <div className="skills-tags">
                                                {app.matchingSkills ? (
                                                    app.matchingSkills.split(/[,;]+/).map((s, idx) => s.trim() && (
                                                        <span key={idx} className="skill-tag match">{s.trim()}</span>
                                                    ))
                                                ) : <span className="none-text">None detected</span>}
                                            </div>
                                        </div>

                                        <div className="skill-group">
                                            <span className="group-label">Missing Skills:</span>
                                            <div className="skills-tags">
                                                {app.missingSkills ? (
                                                    app.missingSkills.split(/[,;]+/).map((s, idx) => s.trim() && (
                                                        <span key={idx} className="skill-tag missing">{s.trim()}</span>
                                                    ))
                                                ) : <span className="none-text">None</span>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="app-card-actions">
                                        <button
                                            className="analysis-btn"
                                            onClick={() => setSelectedAiApp(app)}
                                        >
                                            View Full AI Analysis & Feedback
                                        </button>
                                        <button
                                            className="resume-link-btn"
                                            onClick={() => window.open(`http://localhost:8080/api/applications/${app.applicationId || app.id}/resume`, "_blank")}
                                        >
                                            View Submitted Resume
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* AI Analysis Modal */}
            {selectedAiApp && (
                <div className="modal-overlay" onClick={() => setSelectedAiApp(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Groq AI Match Breakdown</h3>
                            <button className="close-btn" onClick={() => setSelectedAiApp(null)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="modal-score-banner">
                                <div className={`big-score ${getScoreClass(selectedAiApp.matchScore)}`}>
                                    {selectedAiApp.matchScore !== null ? `${selectedAiApp.matchScore}%` : "N/A"}
                                </div>
                                <div>
                                    <h4>{selectedAiApp.jobTitle}</h4>
                                    <p>{selectedAiApp.company}</p>
                                </div>
                            </div>

                            <div className="modal-section">
                                <h5>Matching Skills</h5>
                                <p className="modal-text">{selectedAiApp.matchingSkills || "No exact keyword matches found."}</p>
                            </div>

                            <div className="modal-section">
                                <h5>Missing Required Skills</h5>
                                <p className="modal-text">{selectedAiApp.missingSkills || "All posted key skills detected!"}</p>
                            </div>

                            <div className="modal-section">
                                <h5>AI Explanation & Recommendations</h5>
                                <div className="explanation-box">
                                    {selectedAiApp.aiExplanation
                                        ? selectedAiApp.aiExplanation.split("\n\n").map((para, i) => (
                                            <p key={i}>{para}</p>
                                        ))
                                        : "Detailed evaluation completed."}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Full Job Description Modal */}
            {selectedJobDetails && (
                <div className="modal-overlay" onClick={() => setSelectedJobDetails(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{selectedJobDetails.title}</h3>
                            <button className="close-btn" onClick={() => setSelectedJobDetails(null)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <p><strong>Company:</strong> {selectedJobDetails.company}</p>
                            <p><strong>Location:</strong> {selectedJobDetails.location}</p>
                            <p><strong>Salary:</strong> ₹{selectedJobDetails.salary ? selectedJobDetails.salary.toLocaleString() : "Not specified"}</p>
                            <p><strong>Required Skills:</strong> {selectedJobDetails.skills}</p>
                            <hr />
                            <h5>Job Description</h5>
                            <p style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>{selectedJobDetails.description}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function getScoreClass(score) {
    if (score === null || score === undefined) return "score-neutral";
    if (score >= 75) return "score-high";
    if (score >= 50) return "score-mid";
    return "score-low";
}

export default CandidateDashboard;

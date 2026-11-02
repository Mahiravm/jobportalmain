import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getApplicantDetailsByRecruiter } from "../services/applicationService";
import { getJobById } from "../services/JobService";
import "./RecruiterApplicants.css";

function RecruiterApplicants() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const jobId = searchParams.get("jobId");
    const user = JSON.parse(localStorage.getItem("user"));

    const [applicants, setApplicants] = useState([]);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    const [selectedAiApplicant, setSelectedAiApplicant] = useState(null); // Modal state

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        if (!jobId) {
            setErrorMsg("No Job ID specified.");
            setLoading(false);
            return;
        }
        loadJobAndApplicants();
    }, [jobId]);

    const loadJobAndApplicants = async () => {
        setLoading(true);
        setErrorMsg("");

        try {
            // Load job details
            try {
                const jobRes = await getJobById(jobId);
                setJob(jobRes.data);
            } catch (e) {
                console.warn("Could not fetch job metadata:", e);
            }

            // Load applicants with recruiter ownership validation
            const response = await getApplicantDetailsByRecruiter(jobId, user.id);
            // Sort by matchScore descending
            const sorted = (response.data || []).sort((a, b) => {
                const scoreA = a.matchScore !== null ? a.matchScore : -1;
                const scoreB = b.matchScore !== null ? b.matchScore : -1;
                return scoreB - scoreA;
            });
            setApplicants(sorted);
        } catch (err) {
            console.error("Error loading applicants:", err);
            if (err.response && err.response.status === 403) {
                setErrorMsg("Access Denied: You are not authorized to view applicants for this job opening.");
            } else {
                setErrorMsg(err.response?.data?.message || err.response?.data || "Failed to load applicants.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleViewResume = (applicant) => {
        if (applicant.id) {
            window.open(`http://localhost:8080/api/applications/${applicant.id}/resume`, "_blank");
        } else if (applicant.userId) {
            window.open(`http://localhost:8080/api/resume/view/${applicant.userId}`, "_blank");
        } else {
            alert("No resume available for this candidate.");
        }
    };

    return (
        <div className="applicant-container">
            {/* Top Navigation */}
            <div className="nav-bar">
                <button className="back-btn" onClick={() => navigate("/recruiter")}>
                    &larr; Back to Recruiter Dashboard
                </button>
            </div>

            {/* Job Header */}
            <div className="job-header-card">
                <h2>{job ? job.title : `Applicants for Job #${jobId}`}</h2>
                {job && (
                    <div className="job-meta-info">
                        <span><strong>Company:</strong> {job.company}</span> &bull;
                        <span><strong>Location:</strong> {job.location}</span> &bull;
                        <span><strong>Required Skills:</strong> {job.skills}</span>
                    </div>
                )}
                <p className="ranking-note">
                    Candidates are ranked automatically by <strong>Groq AI ATS Matching Score</strong> in descending order.
                </p>
            </div>

            {/* Error / Unauthorized Notice */}
            {errorMsg && (
                <div className="error-box">
                    <p>{errorMsg}</p>
                    <button onClick={() => navigate("/recruiter")}>Return to Dashboard</button>
                </div>
            )}

            {/* Loading */}
            {loading && <p className="loading-text">Loading applicants & analyzing scores...</p>}

            {/* Applicants Table */}
            {!loading && !errorMsg && (
                <>
                    {applicants.length === 0 ? (
                        <div className="no-applicants-box">
                            <p>No candidates have applied for this position yet.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="applicants-table">
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Applicant Name</th>
                                        <th>Email Address</th>
                                        <th>Applied Date</th>
                                        <th>AI Match Score</th>
                                        <th>Matching Skills</th>
                                        <th>Missing Skills</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applicants.map((app, index) => (
                                        <tr key={app.id || index}>
                                            <td className="rank-col">#{index + 1}</td>
                                            <td className="name-col">
                                                <strong>{app.name}</strong>
                                            </td>
                                            <td>{app.email}</td>
                                            <td>
                                                {app.appliedAt
                                                    ? new Date(app.appliedAt).toLocaleDateString()
                                                    : "N/A"}
                                            </td>
                                            <td>
                                                <div className={`score-badge ${getScoreBadgeClass(app.matchScore)}`}>
                                                    {app.matchScore !== null && app.matchScore !== undefined
                                                        ? `${app.matchScore}%`
                                                        : "Pending"}
                                                </div>
                                            </td>
                                            <td className="skills-cell">
                                                {app.matchingSkills ? (
                                                    <div className="skills-inline">
                                                        {app.matchingSkills.split(/[,;]+/).map((s, idx) => s.trim() && (
                                                            <span key={idx} className="skill-pill match">{s.trim()}</span>
                                                        ))}
                                                    </div>
                                                ) : <span className="muted-text">None</span>}
                                            </td>
                                            <td className="skills-cell">
                                                {app.missingSkills ? (
                                                    <div className="skills-inline">
                                                        {app.missingSkills.split(/[,;]+/).map((s, idx) => s.trim() && (
                                                            <span key={idx} className="skill-pill missing">{s.trim()}</span>
                                                        ))}
                                                    </div>
                                                ) : <span className="muted-text">None</span>}
                                            </td>
                                            <td>
                                                <span className="status-pill">{app.status || "APPLIED"}</span>
                                            </td>
                                            <td className="actions-cell">
                                                <button
                                                    className="action-btn resume-btn"
                                                    onClick={() => handleViewResume(app)}
                                                >
                                                    View Resume
                                                </button>
                                                <button
                                                    className="action-btn ai-btn"
                                                    onClick={() => setSelectedAiApplicant(app)}
                                                >
                                                    AI Analysis
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {/* AI Analysis Modal */}
            {selectedAiApplicant && (
                <div className="modal-overlay" onClick={() => setSelectedAiApplicant(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Groq AI Candidate Assessment</h3>
                            <button className="close-btn" onClick={() => setSelectedAiApplicant(null)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="candidate-summary">
                                <div>
                                    <h4>{selectedAiApplicant.name}</h4>
                                    <p className="candidate-email">{selectedAiApplicant.email}</p>
                                </div>
                                <div className={`modal-score-box ${getScoreBadgeClass(selectedAiApplicant.matchScore)}`}>
                                    <span className="modal-score-val">
                                        {selectedAiApplicant.matchScore !== null ? `${selectedAiApplicant.matchScore}%` : "N/A"}
                                    </span>
                                    <span className="modal-score-sub">Match Score</span>
                                </div>
                            </div>

                            <div className="modal-section">
                                <h5>Matching Skills:</h5>
                                <div className="skills-inline">
                                    {selectedAiApplicant.matchingSkills ? (
                                        selectedAiApplicant.matchingSkills.split(/[,;]+/).map((s, idx) => s.trim() && (
                                            <span key={idx} className="skill-pill match">{s.trim()}</span>
                                        ))
                                    ) : <span>None</span>}
                                </div>
                            </div>

                            <div className="modal-section">
                                <h5>Missing Requirements:</h5>
                                <div className="skills-inline">
                                    {selectedAiApplicant.missingSkills ? (
                                        selectedAiApplicant.missingSkills.split(/[,;]+/).map((s, idx) => s.trim() && (
                                            <span key={idx} className="skill-pill missing">{s.trim()}</span>
                                        ))
                                    ) : <span>None missing</span>}
                                </div>
                            </div>

                            <div className="modal-section">
                                <h5>AI Explanation & ATS Evaluation:</h5>
                                <div className="explanation-content">
                                    {selectedAiApplicant.aiExplanation ? (
                                        selectedAiApplicant.aiExplanation.split("\n\n").map((para, i) => (
                                            <p key={i}>{para}</p>
                                        ))
                                    ) : (
                                        <p>Candidate skills evaluated against job description requirements.</p>
                                    )}
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button className="action-btn resume-btn" onClick={() => handleViewResume(selectedAiApplicant)}>
                                    Open Candidate Resume
                                </button>
                                <button className="close-modal-btn" onClick={() => setSelectedAiApplicant(null)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function getScoreBadgeClass(score) {
    if (score === null || score === undefined) return "badge-gray";
    if (score >= 75) return "badge-green";
    if (score >= 50) return "badge-yellow";
    return "badge-red";
}

export default RecruiterApplicants;

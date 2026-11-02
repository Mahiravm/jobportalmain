import { useEffect, useState } from "react";
import { createJob, getRecruiterJobs } from "../services/JobService";
import { useNavigate } from "react-router-dom";
import "./RecruiterDashboard.css";

function RecruiterDashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const [job, setJob] = useState({
        title: "",
        company: "",
        location: "",
        salary: "",
        description: "",
        skills: ""
    });

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        fetchRecruiterJobs();
    }, []);

    const fetchRecruiterJobs = async () => {
        try {
            setLoading(true);
            const res = await getRecruiterJobs(user.id);
            setJobs(res.data || []);
        } catch (error) {
            console.error("Error fetching recruiter jobs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setJob({
            ...job,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...job,
                salary: parseFloat(job.salary) || 0,
                recruiterId: user.id
            };

            await createJob(payload);
            alert("Job opening posted successfully!");
            setJob({
                title: "",
                company: "",
                location: "",
                salary: "",
                description: "",
                skills: ""
            });
            setShowCreateForm(false);
            fetchRecruiterJobs();
        } catch (error) {
            console.error("Error creating job:", error);
            alert("Failed to create job posting. Please verify inputs.");
        }
    };

    const viewApplicants = (jobId) => {
        navigate(`/applications?jobId=${jobId}`);
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="recruiter-container">
            {/* Header */}
            <div className="recruiter-header">
                <div>
                    <h2>Recruiter Dashboard</h2>
                    <p className="recruiter-sub">Welcome, {user?.name || "Recruiter"} &bull; {user?.email}</p>
                </div>
                <div className="header-actions">
                    <button
                        className="toggle-form-btn"
                        onClick={() => setShowCreateForm(!showCreateForm)}
                    >
                        {showCreateForm ? "Cancel Posting" : "+ Post New Job Opening"}
                    </button>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            {/* Create Job Form (Toggleable or Visible) */}
            {showCreateForm && (
                <div className="form-card">
                    <h3>Post a New Job Opening</h3>
                    <form className="job-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <input
                                type="text"
                                name="title"
                                placeholder="Job Title (e.g. Senior Java Developer)"
                                value={job.title}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="company"
                                placeholder="Company Name"
                                value={job.company}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <input
                                type="text"
                                name="location"
                                placeholder="Location (e.g. Bangalore / Remote)"
                                value={job.location}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="number"
                                name="salary"
                                placeholder="Salary (Annual in ₹)"
                                value={job.salary}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <input
                            type="text"
                            name="skills"
                            placeholder="Required Skills (e.g. Java, Spring Boot, MySQL, REST API, Microservices)"
                            value={job.skills}
                            onChange={handleChange}
                            required
                        />

                        <textarea
                            name="description"
                            placeholder="Complete Job Description, responsibilities, and qualifications..."
                            value={job.description}
                            onChange={handleChange}
                            required
                        />

                        <div className="form-buttons">
                            <button type="submit" className="submit-btn">Publish Job Opening</button>
                            <button type="button" className="cancel-btn" onClick={() => setShowCreateForm(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Recruiter's Posted Jobs Section */}
            <div className="posted-jobs-section">
                <div className="section-header">
                    <h3>My Posted Job Openings ({jobs.length})</h3>
                    <span className="info-text">Showing only jobs created by you</span>
                </div>

                {loading ? (
                    <p className="loading-text">Loading your job postings...</p>
                ) : jobs.length === 0 ? (
                    <div className="empty-state">
                        <p>You haven't posted any jobs yet.</p>
                        <button className="toggle-form-btn" onClick={() => setShowCreateForm(true)}>
                            Post Your First Job
                        </button>
                    </div>
                ) : (
                    <div className="recruiter-jobs-grid">
                        {jobs.map((j) => (
                            <div key={j.id} className="recruiter-job-card">
                                <div className="card-top">
                                    <div>
                                        <h4 className="job-title">{j.title}</h4>
                                        <span className="job-company">{j.company}</span>
                                    </div>
                                    <div className="applicant-badge">
                                        <span className="badge-count">{j.applicantCount}</span>
                                        <span className="badge-label">Applicants</span>
                                    </div>
                                </div>

                                <div className="job-meta">
                                    <p><strong>Location:</strong> {j.location}</p>
                                    <p><strong>Salary:</strong> ₹{j.salary ? j.salary.toLocaleString() : "Not specified"}</p>
                                    <p><strong>Posted Date:</strong> {j.postedDate ? new Date(j.postedDate).toLocaleDateString() : "Recently"}</p>
                                </div>

                                {j.skills && (
                                    <div className="job-skills-list">
                                        <strong>Skills:</strong>
                                        <div className="skills-tags">
                                            {j.skills.split(/[,;]+/).map((s, idx) => s.trim() && (
                                                <span key={idx} className="rec-skill-tag">{s.trim()}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <p className="job-desc-preview">
                                    {j.description && j.description.length > 150
                                        ? `${j.description.substring(0, 150)}...`
                                        : j.description}
                                </p>

                                <div className="card-footer">
                                    <button
                                        type="button"
                                        className="view-applicants-btn"
                                        onClick={() => viewApplicants(j.id)}
                                    >
                                        View Applicants ({j.applicantCount})
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default RecruiterDashboard;

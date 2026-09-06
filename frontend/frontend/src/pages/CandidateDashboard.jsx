// import { useEffect, useState } from "react";
// import { getAllJobs } from "../services/jobService";
// import "./CandidateDashboard.css";
// function CandidateDashboard() {

//     const [jobs, setJobs] = useState([]);

//     useEffect(() => {

//         fetchJobs();

//     }, []);

//     const fetchJobs = async () => {

//         try {

//             const response = await getAllJobs();

//             setJobs(response.data);

//         } catch (error) {

//             console.error(error);

//         }
//     };

//     return (
//     <div className="candidate-container">

//         <h1 className="candidate-title">
//             Available Jobs
//         </h1>

//         <div className="job-grid">

//             {jobs.map((job) => (

//                 <div
//                     key={job.id}
//                     className="job-card"
//                 >
//                     <h3>{job.title}</h3>

//                     <p>
//                         <strong>Company:</strong> {job.company}
//                     </p>

//                     <p>
//                         <strong>Location:</strong> {job.location}
//                     </p>

//                     <p>
//                         <strong>Salary:</strong> ₹{job.salary}
//                     </p>

//                     <p>{job.description}</p>

//                     <button className="apply-btn">
//                         Apply Now
//                     </button>

//                 </div>

//             ))}

//         </div>

//     </div>
// );
// }

// export default CandidateDashboard;










// import { useEffect, useState } from "react";
// import { getAllJobs } from "../services/jobService";
// import { applyJob } from "../services/applicationService";
// import "./CandidateDashboard.css";
// import { useNavigate } from "react-router-dom";
// import ResumeUpload from "./ResumeUpload";

// function CandidateDashboard() {
//     const navigate = useNavigate();
//     const [jobs, setJobs] = useState([]);
//     const hasApplied = (jobId) => {
//         return false;
//     };

//     useEffect(() => {
//         fetchJobs();
//     }, []);

//     const fetchJobs = async () => {
//         try {
//             const response = await getAllJobs();
//             setJobs(response.data);
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     const handleApply = async (jobId) => {

//        const user =
//         JSON.parse(localStorage.getItem("user"));

//     try {

//         await applyJob({
//             userId: user.id,
//             jobId: jobId
//         });

//         alert("Applied Successfully");

//         } catch (error) {

//             console.error(error);

//             alert("Application Failed");
//         }
//     };
//     const handleLogout = () => {

//         localStorage.removeItem("user");

//         navigate("/login");
//     };


//     return (
//         <div className="candidate-container">

//             <h1 className="candidate-title">
//                 Available Jobs
//             </h1>

//             <div className="job-grid">

//                 {jobs.map((job) => (

//                     <div
//                         key={job.id}
//                         className="job-card"
//                     >

//                         <h3>{job.title}</h3>

//                         <p>
//                             <strong>Company:</strong>
//                             {job.company}
//                         </p>

//                         <p>
//                             <strong>Location:</strong>
//                             {job.location}
//                         </p>

//                         <p>
//                             <strong>Salary:</strong>
//                             ₹{job.salary}
//                         </p>

//                         <p>{job.description}</p>

//                         <button onClick={() => navigate("/resume")}>
//     Upload Resume
// </button>
//                         <button
//                             className="apply-btn"
//                             onClick={() =>
//                                 handleApply(job.id)
//                             }
//                         >
//                             Apply Now
//                         </button>


                        

//                         {/* <button disabled={hasApplied(job.id)}>
//     Apply Now
// </button> */}

//                     </div>

//                 ))}
//                 <button onClick={handleLogout}>
//     Logout
// </button>

//             </div>

//         </div>
//     );
// }

// export default CandidateDashboard;





import { useEffect, useState } from "react";
import { getAllJobs } from "../services/jobService";
import { applyJob } from "../services/applicationService";
import "./CandidateDashboard.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CandidateDashboard() {

    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [resumeUploaded, setResumeUploaded] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));
useEffect(() => {
    if (!user) {
        navigate("/login");
        return;
    }
    fetchJobs();
    checkResume();
}, []);
    // Get jobs
    const fetchJobs = async () => {
        try {
            const response = await getAllJobs();
            setJobs(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Check resume already uploaded or not
    const checkResume = async () => {
        try {
            const res = await axios.get(
                `http://localhost:8080/api/user/${user.id}`
            );

            if (res.data.resumePath) {
                setResumeUploaded(true);
            }

        } catch (err) {
            console.log(err);
        }
    };

    // Upload resume (same page)
    const handleResumeUpload = async (file) => {

        const formData = new FormData();
        formData.append("file", file);

        try {
            await axios.post(
                `http://localhost:8080/api/resume/upload/${user.id}`,
                formData
            );

            alert("Resume Uploaded Successfully");

            setResumeUploaded(true);

        } catch (error) {
            console.log(error);
            alert("Resume Upload Failed");
        }
    };

    // Apply job
    const handleApply = async (jobId) => {

        if (!resumeUploaded) {
            alert("Please upload resume first");
            return;
        }

        try {
            await applyJob({
                userId: user.id,
                jobId: jobId
            });

            alert("Applied Successfully");

        } catch (error) {
            console.error(error);
            alert("Application Failed");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="candidate-container">

            <h1 className="candidate-title">
                Available Jobs
            </h1>

            {/* Resume Section (ONE TIME) */}
            <div className="resume-box">
                <h3>Resume Status</h3>

                {resumeUploaded ? (
                    <p style={{ color: "green" }}>
                        Resume Uploaded ✅
                    </p>
                ) : (
                    <>
                        <p style={{ color: "red" }}>
                            Resume Not Uploaded ❌
                        </p>

                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) =>
                                handleResumeUpload(e.target.files[0])
                            }
                        />
                    </>
                )}
            </div>

            {/* Jobs */}
            <div className="job-grid">

                {jobs.map((job) => (

                    <div key={job.id} className="job-card">

                        <h3>{job.title}</h3>

                        <p><b>Company:</b> {job.company}</p>
                        <p><b>Location:</b> {job.location}</p>
                        <p><b>Salary:</b> ₹{job.salary}</p>

                        <p>{job.description}</p>

                        <button
                            className="apply-btn"
                            disabled={!resumeUploaded}
                            onClick={() => handleApply(job.id)}
                        >
                            {resumeUploaded
                                ? "Apply Now"
                                : "Upload Resume First"}
                        </button>

                    </div>
                ))}

            </div>

            <button onClick={handleLogout}>
                Logout
            </button>

        </div>
    );
}

export default CandidateDashboard;
// import { useState } from "react";
// import { createJob } from "../services/jobService";
// import "./RecruiterDashboard.css";
// import { useNavigate } from "react-router-dom";
// function RecruiterDashboard() {
//     const navigate = useNavigate();
//     const [job, setJob] = useState({
//         title: "",
//         company: "",
//         location: "",
//         salary: "",
//         description: ""
//     });

//     const handleChange = (e) => {
//         setJob({
//             ...job,
//             [e.target.name]: e.target.value
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             await createJob(job);
//             alert("Job Created Successfully");
//         } catch (error) {
//             console.error(error);
//         }
//     };
//     const handleLogout = () => {

//     localStorage.removeItem("user");

//     navigate("/login");
// };

//     return (
//     <div className="recruiter-container">

//         <h2 className="recruiter-title">
//             Recruiter Dashboard
//         </h2>

//         <form className="job-form" onSubmit={handleSubmit}>

//             <input
//                 name="title"
//                 placeholder="Job Title"
//                 onChange={handleChange}
//             />

//             <input
//                 name="company"
//                 placeholder="Company Name"
//                 onChange={handleChange}
//             />

//             <input
//                 name="location"
//                 placeholder="Location"
//                 onChange={handleChange}
//             />

//             <input
//                 name="salary"
//                 placeholder="Salary"
//                 onChange={handleChange}
//             />

//             <textarea
//                 name="description"
//                 placeholder="Job Description"
//                 onChange={handleChange}
//             />

//             <button type="submit">
//                 Create Job
//             </button>

//                 <button
//                     type="button"
//                     onClick={() =>
//                         navigate("/applications")
//                     }
//     >
//         View Applicants
//     </button>


//                 <button
//                 type="button"
//                 onClick={handleLogout}>
//     Logout
// </button>

//         </form>

//     </div>
// );
// }

// export default RecruiterDashboard;




// import { useEffect, useState } from "react";
// import { getAllJobs } from "../services/jobService";
// import { getApplicationsByJob } from "../services/applicationService";
// import "./RecruiterDashboard.css";

// function RecruiterDashboard() {

//     const [jobs, setJobs] = useState([]);
//     const [applications, setApplications] = useState([]);
//     const [selectedJob, setSelectedJob] = useState(null);

//     useEffect(() => {
//         fetchJobs();
//     }, []);

//     const fetchJobs = async () => {
//         const res = await getAllJobs();
//         setJobs(res.data);
//     };

//     const viewApplicants = async (jobId) => {
//         const res = await getApplicationsByJob(jobId);
//         setApplications(res.data);
//         setSelectedJob(jobId);
//     };

//     return (
//         <div>

//             <h2>Recruiter Dashboard</h2>

//             <h3>Jobs</h3>

//             {jobs.map(job => (
//                 <div key={job.id} className="job-card">

//                     <h4>{job.title}</h4>
//                     <p>{job.company}</p>

//                     <button
//                         type="button"
//                         onClick={() => viewApplicants(job.id)}
//                     >
//                         View Applicants
//                     </button>

//                 </div>
//             ))}

//             {selectedJob && (
//                 <div>
//                     <h3>Applicants</h3>

//                     {applications.length === 0 ? (
//                         <p>No applicants yet</p>
//                     ) : (
//                        applications.map((app,index) => (
//     <div key={index} className="applicant-card">

//         <p><b>Name:</b> {app.name}</p>

//         <p><b>Email:</b> {app.email}</p>

//         <p><b>Status:</b> {app.status}</p>

//     </div>
// ))
//                     )}

//                 </div>
//             )}

//         </div>
//     );
// }

// export default RecruiterDashboard;








// import { useEffect, useState } from "react";
// import { createJob, getAllJobs } from "../services/jobService";
// import { getApplicationsByJob } from "../services/applicationService";
// import "./RecruiterDashboard.css";

// function RecruiterDashboard() {

//     const [jobs, setJobs] = useState([]);
//     const [applications, setApplications] = useState([]);
//     const [selectedJob, setSelectedJob] = useState(null);

//     const [job, setJob] = useState({
//         title: "",
//         company: "",
//         location: "",
//         salary: "",
//         description: "",
//         skills: ""
//     });

//     useEffect(() => {
//         fetchJobs();
//     }, []);

//     const fetchJobs = async () => {
//         try {
//             const res = await getAllJobs();
//             setJobs(res.data);
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     const handleChange = (e) => {
//         setJob({
//             ...job,
//             [e.target.name]: e.target.value
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {

//             await createJob(job);

//             alert("Job Created Successfully");

//             setJob({
//                 title: "",
//                 company: "",
//                 location: "",
//                 salary: "",
//                 description: "",
//                 skills: ""
//             });

//             fetchJobs();

//         } catch (error) {
//             console.error(error);
//         }
//     };

//     const viewApplicants = async (jobId) => {
//         try {

//             const res = await getApplicationsByJob(jobId);

//             console.log(res.data);

//             setApplications(res.data);
//             setSelectedJob(jobId);

//         } catch (error) {
//             console.error(error);
//         }
//     };






//     return (
//         <div className="recruiter-container">

//             <h2>Recruiter Dashboard</h2>

//             {/* Create Job Form */}

//             <form className="job-form" onSubmit={handleSubmit}>

//                 <input
//                     type="text"
//                     name="title"
//                     placeholder="Job Title"
//                     value={job.title}
//                     onChange={handleChange}
//                     required
//                 />

//                 <input
//                     type="text"
//                     name="company"
//                     placeholder="Company Name"
//                     value={job.company}
//                     onChange={handleChange}
//                     required
//                 />

//                 <input
//                     type="text"
//                     name="location"
//                     placeholder="Location"
//                     value={job.location}
//                     onChange={handleChange}
//                     required
//                 />

//                 <input
//                     type="text"
//                     name="salary"
//                     placeholder="Salary"
//                     value={job.salary}
//                     onChange={handleChange}
//                     required
//                 />

//                 <textarea
//                     name="description"
//                     placeholder="Job Description"
//                     value={job.description}
//                     onChange={handleChange}
//                     required
//                 />

//                 <input
//                     type="text"
//                     name="skills"
//                     placeholder="Required Skills"
//                     value={job.skills}
//                     onChange={handleChange}
//                     required
//                 />

//                 <button type="submit">
//                     Create Job
//                 </button>

//             </form>

//             <hr />

//             <h3>Posted Jobs</h3>

//             {jobs.length === 0 ? (
//                 <p>No Jobs Found</p>
//             ) : (
//                 jobs.map(job => (
//                     <div
//                         key={job.id}
//                         className="job-card"
//                     >

//                         <h4>{job.title}</h4>

//                         <p>
//                             <strong>Company:</strong> {job.company}
//                         </p>

//                         <p>
//                             <strong>Location:</strong> {job.location}
//                         </p>

//                         <p>
//                             <strong>Salary:</strong> {job.salary}
//                         </p>

//                         <button
//                             type="button"
//                             onClick={() =>
//                                 viewApplicants(job.id)
//                             }
//                         >
//                             View Applicants
//                         </button>

//                     </div>
//                 ))
//             )}

//             {selectedJob && (
//                 <div className="applicant-section">

//                     <h3>
//                         Applicants for Job ID: {selectedJob}
//                     </h3>

//                     {applications.length === 0 ? (
//                         <p>No applicants yet</p>
//                     ) : (

//                         applications.map((app, index) => (

//                             <div
//                                 key={index}
//                                 className="applicant-card"
//                             >

//                                 <p>
//                                     <strong>Name:</strong>
//                                     {" "}
//                                     {app.name}
//                                 </p>

//                                 <p>
//                                     <strong>Email:</strong>
//                                     {" "}
//                                     {app.email}
//                                 </p>

//                                 <p>
//                                     <strong>Status:</strong>
//                                     {" "}
//                                     {app.status}
//                                 </p>





//                                 <button
//                                     onClick={() =>
//                                         window.open(
//                                             `http://localhost:8080/api/resume/view/${app.userId}`,
//                                             "_blank"
//                                         )
//                                     }
//                                 >
//                                         View Resume
//                                 </button>

//                             </div>
//                         ))
//                     )}

//                 </div>
//             )}

//         </div>
//     );
// }

// export default RecruiterDashboard;




import { useEffect, useState } from "react";
import { createJob, getAllJobs } from "../services/jobService";
import { useNavigate } from "react-router-dom"; // 👈 1. useNavigate இம்போர்ட் பண்ணியாச்சு
import "./RecruiterDashboard.css";

function RecruiterDashboard() {
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate(); // 👈 2. ஹூக் இனிஷியலைஸ் பண்ணியாச்சு

    const [job, setJob] = useState({
        title: "",
        company: "",
        location: "",
        salary: "",
        description: "",
        skills: ""
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await getAllJobs();
            setJobs(res.data);
        } catch (error) {
            console.error(error);
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
            await createJob(job);
            alert("Job Created Successfully");
            setJob({
                title: "",
                company: "",
                location: "",
                salary: "",
                description: "",
                skills: ""
            });
            fetchJobs();
        } catch (error) {
            console.error(error);
        }
    };

    // 👈 3. இந்த ஃபங்க்ஷனை மட்டும் தான் மாத்தியிருக்கேன்!
    const viewApplicants = (jobId) => {
        // கிளிக் பண்ண உடனே நேரா /applications பேஜுக்கு ஃப்ளோவை திருப்பி விட்றோம்
        navigate(`/applications?jobId=${jobId}`); 
    };

    return (
        <div className="recruiter-container">
            <h2>Recruiter Dashboard</h2>

            {/* Create Job Form */}
            <form className="job-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    placeholder="Job Title"
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
                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={job.location}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="salary"
                    placeholder="Salary"
                    value={job.salary}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Job Description"
                    value={job.description}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="skills"
                    placeholder="Required Skills"
                    value={job.skills}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Create Job</button>
            </form>

            <hr />

            <h3>Posted Jobs</h3>

            {jobs.length === 0 ? (
                <p>No Jobs Found</p>
            ) : (
                jobs.map(job => (
                    <div key={job.id} className="job-card">
                        <h4>{job.title}</h4>
                        <p><strong>Company:</strong> {job.company}</p>
                        <p><strong>Location:</strong> {job.location}</p>
                        <p><strong>Salary:</strong> {job.salary}</p>
                        
                        {/* View Applicants பட்டன் */}
                        <button
                            type="button"
                            onClick={() => viewApplicants(job.id)}
                        >
                            View Applicants
                        </button>
                    </div>
                ))
            )}
            
            {/* 🛠️ கீழே இருந்த அப்ளிகன்ட்ஸ் செக்ஷன் தேவையில்லை, ஏன்னா அது தனி பேஜுக்கு போயிடுச்சு! */}
        </div>
    );
}

export default RecruiterDashboard;
// import { useEffect, useState } from "react";
// import { getAllApplications } from "../services/applicationService";
// import "./RecruiterApplicants.css";
// // import { getAllJobs } from "../services/jobService";
// // import { useNavigate } from "react-router-dom";
// // import { applyJob } from "../services/applicationService";
// // import { getApplicationsByJob } from "../services/applicationService";


// function RecruiterApplicants() {

//     const [applications, setApplications] = useState([]);

//     useEffect(() => {

//         fetchApplications();

//     }, []);

//     const fetchApplications = async () => {

//         try {

//             const response =
//                 await getAllApplications();

//             setApplications(response.data);

//         } catch (error) {

//             console.error(error);
//         }
//     };


// //     const viewResume = (userId) => {
// //     window.open(
// //         `http://localhost:8080/api/resume/view/${userId}`,
// //         "_blank"
// //     );
// // };



//     return (
//         <div className="applicant-container">

//             <h1>
//                 Job Applications
//             </h1>

//             <table>

//                 <thead>

//                 {/* <tr>
//                     <th>Application ID</th>
//                     <th>User ID</th>
//                     <th>Job ID</th>
//                     <th>Status</th>
//                     <th>Applied Date</th>
//                 </tr> */}

//                 </thead>

//                 <tbody>

//                 {/* {applications.map((app) => (

//                     <tr key={app.id}>

//                         <td>{app.id}</td>

//                         <td>{app.userId}</td>

//                         <td>{app.jobId}</td>

//                         <td>{app.status}</td>

//                         <td>{app.appliedAt}</td>

//                     </tr>

    
//     ))} */}

// {applications.map(app => (
//    <div key={app.id} className="applicant-card">

//        <p><b>Name:</b> {app.name}</p>
//         <p><b>Email:</b> {app.email}</p>
//         <p><b>Status:</b> {app.status}</p>
// {/* 
//          <button onClick={() => viewResume(app.userId)}>
//             View Resume
//         </button> */}


//     </div>
// ))}








//                 </tbody>

//             </table>

//         </div>
//     );
// }

// export default RecruiterApplicants;






import { useEffect, useState } from "react";
import "./RecruiterApplicants.css";
import { useSearchParams } from "react-router-dom";
// 👈 1. இங்க getApplicationsByJob மெத்தடையும் சேர்த்து இம்போர்ட் பண்ணியாச்சு
import { getAllApplications, getApplicationsByJob } from "../services/applicationService"; 

function RecruiterApplicants() {
    const [applications, setApplications] = useState([]);
    const [searchParams] = useSearchParams();
    const jobId = searchParams.get("jobId"); // URL-இல் இருந்து jobId-ஐ பெறுகிறோம்

    useEffect(() => {
        fetchApplications();
    }, [jobId]); // jobId மாறும்போது fetchApplications மீண்டும் ஓடும்

    const fetchApplications = async () => {
        try {
            let response;
            if (jobId) {
                console.log("Fetching specific applicants for Job ID:", jobId);
                // 👈 2. இங்க தான் தப்பு இருந்தது! கரெக்டான மெத்தடை இப்போ மாத்தியாச்சு
                response = await getApplicationsByJob(jobId); 
            } else {
                console.log("Fetching all applications");
                response = await getAllApplications();
            }
            
            console.log("Applications fetched:", response.data);
            setApplications(response.data);
        } catch (error) {
            console.error("Error in fetching:", error);
        }
    };

    return (
        <div className="applicant-container">
            <h1>AI Resume Matching Applicants</h1>

            {applications.length === 0 ? (
                <p>No applicants found for this job</p>
            ) : (
                applications.map((app) => (
                    <div key={app.id} className="applicant-card">
                        <p>
                            <b>Name:</b> {app.name}
                        </p>

                        <p>
                            <b>Email:</b> {app.email}
                        </p>

                        <p>
                            <b>Application Status:</b> {app.status}
                        </p>

                        <p>
                            <b>Resume Match:</b>{" "}
                            {app.matchScore !== null ? `${app.matchScore} %` : "Not Analyzed"}
                        </p>

                        <p>
                            <b>AI Recommendation:</b>{" "}
                            {app.recommendation || "Resume analysis pending"}
                        </p>

                        <button
                            onClick={() => {
                                if (app.userId) {
                                    window.open(`http://localhost:8080/api/resume/view/${app.userId}`, "_blank");
                                } else {
                                    alert("User ID missing for this applicant!");
                                }
                            }}
                        >
                            View Resume
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}

export default RecruiterApplicants;
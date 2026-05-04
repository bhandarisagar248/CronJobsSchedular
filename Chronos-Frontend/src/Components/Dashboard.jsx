import { useContext, useEffect, useState } from "react";
import { CreateJobModal } from "./CreateJobModal";
import { getAllJob } from "../API_Axios/Job";
import { updateJob } from "../API_Axios/Job";
import { DeleteJob } from "../API_Axios/Job";
import ContextAPI from "../ContextApi/ContextAPI";
import '../Css/Notification.css';

export const Dashboard = ({ onJobCreate, onviewJob,setShowLogin }) => {
  const{user, setRefresh,showNotification,setNotification,notification}=useContext(ContextAPI)
      // Notification State
  // const [notification, setNotification] = useState({
  //   message: "",
  //   type: "", // success, error, info
  //   visible: false,
  // });

  //   const showNotification = (message, type) => {
  //   setNotification({
  //     message: message,
  //     type: type,
  //     visible: true,
  //   });
  //     };
  //       // Automatically hide the notification after 5 seconds
  //   setTimeout(() => {
  //     setNotification({
  //       message: "",
  //       type: "",
  //       visible: false,
  //     });
  //   }, 7000);


  const [jobs, setJobs] = useState([
    {
      id: 1,
      name: "Daily Backup",
      cronExpression: "0 0 * * *",
      status: "ACTIVE",
      nextRunTime: "2026-04-07 00:00",
    },
  ]);

useEffect(() => {
   fetchJobs();
}, [user]);

  const fetchJobs = async () => {
    if (!user) {
      // User logged out, clear jobs
      setJobs([]);
      return;
    }

    try {
      const jobs = await getAllJob();
      setJobs(jobs || []); // fallback to empty array
      console.log("Fetched jobs:", jobs);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setJobs([]); // clear jobs on error
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const handleCreateJob = (job) => {
    setJobs((prev) => [
      ...prev,
      {
        ...job,
        id: Date.now(),
        status: "ACTIVE",
        nextRunTime: "Calculating...",
      },
    ]);
  };



const handlePauseJob = async (job, e) => {
  e.preventDefault(); // prevent default behavior if needed (optional for button)
  
  const confirmed = window.confirm("Do you want to pause job?");
  if (!confirmed) return;

  const jobData = { ...job, status: "PAUSED" };

  try {
    await updateJob(job.id, jobData);
      showNotification("Job paused successfully.","success");
    // Update the local state to reflect the change
    setJobs((prev) =>
      prev.map((j) => (j.id === job.id ? { ...j, status: "PAUSED" } : j))
    );
  } catch (e) {
       showNotification("Unable to pause job.", "error");
  }
};
const handleActiveJob = async (job, e) => {
  e.preventDefault(); // prevent default behavior if needed (optional for button)
  
  const confirmed = window.confirm("Do you want to active job?");
  if (!confirmed) return;

  const jobData = { ...job, status: "ACTIVE" };

  try {
    await updateJob(job.id, jobData);
   showNotification("Job activated successfully.","success");

    // Update the local state to reflect the change
    setJobs((prev) =>
      prev.map((j) => (j.id === job.id ? { ...j, status: "ACTIVE" } : j))
    );
  } catch (e) {
 showNotification("Unable to active job.", "error");
  }
};
const DeleteJobFun = async (job, e) => {
  e.preventDefault(); // prevent default behavior if needed (optional for button)
  
  const confirmed = window.confirm("Do you want to delete job?");
  if (!confirmed) return;

  try {
    await DeleteJob(job.id);
    await fetchJobs();
    showNotification("Job deleted successfully.", "success");

    // Update the local state to reflect the change
    setJobs((prev) => prev.filter((j) => j.id !== job.id));
  } catch (e) {
 showNotification("Unable to delete job.", "error");
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#050505] to-[#0a0a0a] text-white p-6">
            {/* Notification */}
      {/* Notification */}
      {notification.visible && (
        <div
          className={`notification ${notification.type} visible`}
        >
          <span>{notification.message}</span>
          <button className="close-btn" onClick={() => setNotification({ ...notification, visible: false })}>
            &times;
          </button>
        </div>
      )}
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Scheduler Dashboard
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Manage and automate your jobs
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedJob(null); // 👈 important (create mode)
            setIsModalOpen(true);
          }}
          className="bg-[#00f5ff] hover:bg-[#00d9e6] transition-all text-black px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-[#00f5ff]/20"
        >
          + Create Job
        </button>
      </div>

      {/* Table / Empty State */}
      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <p className="text-white/50 mb-4">No jobs created yet</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#00f5ff] text-black px-5 py-2 rounded-xl"
          >
            Create your first job
          </button>
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-xl">
          <table className="w-full">
            <thead className="bg-white/5 text-left text-sm text-white/60">
              <tr>
                <th className="p-4">Job</th>
                <th>Cron</th>
                <th>Status</th>
                <th>Next Run</th>
                <th className="pr-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className="border-t border-white/10 hover:bg-white/5 transition"
                >
                  <td className="p-4 font-medium">{job.name}</td>
                  <td className="text-white/70">{job.cronExpression}</td>

                  {/* Status */}
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        job.status === "ACTIVE"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>

                  <td className="text-white/70">{job.nextRunTime}</td>

                  {/* Actions */}
                  <td className="flex gap-3 pr-4">
                    <button
                      onClick={() => {
                        setSelectedJob(job); // 👈 set clicked job
                        setIsModalOpen(true); // 👈 open modal
                      }}
                      className="text-[#00f5ff] hover:text-white transition"
                    >
                      View
                    </button>

               {job.status=="ACTIVE"  ?   <button
                      onClick={(e) => handlePauseJob(job, e)}
                      className="text-yellow-400 hover:text-yellow-300 transition"
                    >
                      Pause
                    </button>
                    :
                    <button
                      onClick={(e) => handleActiveJob(job, e)}
                      className="text-green-400 hover:text-green-300 transition"
                    >
                      Active
                    </button>
}
                    <button
                      onClick={(e) =>
                        DeleteJobFun(job,e)
                      }
                      className="text-red-400 hover:text-red-300 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
         <iframe
  src="http://localhost:3000/public-dashboards/8bf13bf88b134fbe9334e0f7c55c54f9"
  width="100%"
  height="900"
  style={{ border: "none" }}
/>
        </div>
        
      )}

      {/* Modal */}
      <CreateJobModal 
      showNotification={showNotification}
        job={selectedJob} // 👈 pass job (can be null)
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateJob}
        fetchJobs={fetchJobs}
        setShowLogin={setShowLogin}
      />
    </div>
  );
};

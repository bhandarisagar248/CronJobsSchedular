
import { useContext, useEffect, useState } from "react";
import { createJob } from "../API_Axios/Job";
import { data } from "react-router-dom";
import { updateJob } from "../API_Axios/Job";
import ContextAPI from "../ContextApi/ContextAPI";


export const CreateJobModal = ({ job,isOpen, onClose,fetchJobs,showNotification,setShowLogin }) => {
  // Job form state
  const {setRefresh,user}=useContext(ContextAPI);

  const [name, setName] = useState("");
  const [cron, setCron] = useState("");
  const [status, setStatus] = useState("ACTIVE"); // default active
  const [payload, setPayload] = useState("");
  const [maxRetries, setMaxRetries] = useState(3);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  if (job) {
    setName(job.name || "");
    setCron(job.cronExpression || "");
    setStatus(job.status || "ACTIVE");
    setPayload(job.payload || "");
    setMaxRetries(job.maxRetries || 3);
  } else {
    // reset when creating new
    setName("");
    setCron("");
    setStatus("ACTIVE");
    setPayload("");
    setMaxRetries(3);
  }
}, [job]);

  // const handleCreate = async () => {
  //   if (!name || !cron) {
  //     setError("Job Name and Cron Expression are required");
  //     return;
  //   }

  //   setLoading(true);
  //   setError("");

  //   try {
  //     const jobData = {
  //       name,
  //       cronExpression: cron,
  //       status,
  //       payload,
  //       maxRetries,
  //       // email: user?.email, // attach current user email
  //     };

  //     // call backend API
  //     const res = createJob(jobData)
  //     console.log("Job created:", res);
  //     onClose(); // close modal
  //   } catch (err) {
  //     console.error(err);
  //     setError(err.response?.data?.message || "Failed to create job");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
// const handleCreate = async () => {
//   if (!name || !cron) {
//     setError("Job Name and Cron Expression are required");
//     return;
//   }

//   setLoading(true);
//   setError("");

//   try {
//     const jobData = {
//       name,
//       cronExpression: cron,
//       status,
//       payload,
//       maxRetries
//     };

//     const token=localStorage.getItem('token');
//     console.log("Token is:"+token);
//     console.log("The job Data: "+JSON.stringify(jobData));

//     const res = await createJob(jobData);
//     console.log("Job created:", res);
//     onClose();
//   } catch (err) {
//     console.error(err);
//     setError(err.response?.data?.message || "Failed to create job");
//   } finally {
//     setLoading(false);
//   }
// };
const handleCreate = async () => {
 
  if(!user){
    showNotification("Please Login to Create Job","info");
    // Navigate("/login");
    setShowLogin();
    return;
    
  }

  if (!name || !cron) {
    setError("Job Name and Cron Expression are required");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const jobData = {
      name,
      cronExpression: cron,
      status,
      payload,
      maxRetries,
      user
    };

    let res;

    if (job) {
      // 🔥 UPDATE MODE
      res = await updateJob(job.id, jobData);
        showNotification("Job updated successfully.", "success");
      setRefresh(true);
      await fetchJobs();
      console.log("Updated:", res);
    } else {
      // 🔥 CREATE MODE
      res = await createJob(jobData);
       showNotification("Job Created successfully.", "success");
        await fetchJobs();
      console.log("Created:", res);
    }

    onClose();

  } catch (err) {
    setError(err.response?.data?.message || "Failed");
  } finally {
    setLoading(false);
  }
};

  if (!isOpen) return null;
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#111] p-8 rounded-3xl w-full max-w-lg border border-white/10 shadow-lg"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-xl hover:text-red-400"
        >
          ✕
        </button>

        <h2 className="text-2xl text-white mb-6 font-bold">Create Job</h2>

        {error && (
          <div className="mb-4 p-2 bg-red-500 text-white rounded">{error}</div>
        )}

        <div className="space-y-4">
          {/* Job Name */}
          <input
            placeholder="Job Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-white p-4 rounded-2xl bg-black border border-white/20"
            required
          />

          {/* Cron Expression */}
          {/* <input
            placeholder="Cron Expression (e.g. 0 0 * * *)"
            value={cron}
            onChange={(e) => setCron(e.target.value)}
            className="w-full text-white p-4 rounded-2xl bg-black border border-white/20"
            required
          /> */}

          <CronBuilder cron={cron} setCron={setCron} />

          {/* Status */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full text-white p-4 rounded-2xl bg-black border border-white/20"
          >
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
          </select>

          {/* Payload */}
          <textarea
            placeholder="Payload (JSON or string)"
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            className="w-full text-white p-4 rounded-2xl bg-black border border-white/20 h-24 resize-none"
          />

          {/* Max Retries */}
          <input
            type="number"
            min={0}
            value={maxRetries}
            onChange={(e) => setMaxRetries(Number(e.target.value))}
            className="w-full text-white p-4 rounded-2xl bg-black border border-white/20"
            placeholder="Max Retries"
          />

          {/* Submit */}
          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full bg-[#00f5ff] text-black p-4 rounded-2xl font-semibold hover:bg-[#00d3ff] disabled:opacity-50"
          >
            {job ? "Update Job" : "Create Job"}
          </button>
        </div>
      </div>
    </div>
  );
};

const CronBuilder = ({ cron, setCron }) => {
  const [second, setSecond] = useState("0");
  const [minute, setMinute] = useState("0");
  const [hour, setHour] = useState("*");
  const [day, setDay] = useState("*");
  const [month, setMonth] = useState("*");

  // ❗ ALWAYS FIXED FOR QUARTZ
  const WEEK = "?";

  // ✅ build safe cron (Quartz format)
  const buildCron = (s, m, h, d, mo) => {
    return `${s} ${m} ${h} ${d} ${mo} ${WEEK}`;
  };

  // ✅ safer parser (handles bad DB data)
  const parseCron = (cronStr) => {
    if (!cronStr) return ["0", "0", "*", "*", "*", "?"];

    const parts = cronStr.trim().split(/\s+/);

    if (parts.length !== 6) {
      return ["0", "0", "*", "*", "*", "?"];
    }

    return parts;
  };

  // ✅ load existing cron safely
  useEffect(() => {
    if (cron) {
      const [sec, min, hr, d, mo] = parseCron(cron);

      setSecond(sec);
      setMinute(min);
      setHour(hr);
      setDay(d);
      setMonth(mo);
    }
  }, [cron]);

  // ✅ update cron safely
  useEffect(() => {
    const safeCron = buildCron(second, minute, hour, day, month);
    setCron(safeCron);
  }, [second, minute, hour, day, month]);

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-black border border-white/10">
      <p className="text-white font-semibold">Cron Builder (Quartz Safe)</p>

      <div className="grid grid-cols-3 gap-2 text-xs">

        {/* SECOND */}
        <select value={second} onChange={(e) => setSecond(e.target.value)} className="bg-[#111] text-white p-2 rounded">
          <option value="0">0 sec</option>
          <option value="*/10">Every 10 sec</option>
          <option value="*/30">Every 30 sec</option>
        </select>

        {/* MINUTE */}
        <select value={minute} onChange={(e) => setMinute(e.target.value)} className="bg-[#111] text-white p-2 rounded">
          <option value="0">0 min</option>
          <option value="*/5">Every 5 min</option>
          <option value="*/10">Every 10 min</option>
          <option value="*">Every min</option>
        </select>

        {/* HOUR */}
        <select value={hour} onChange={(e) => setHour(e.target.value)} className="bg-[#111] text-white p-2 rounded">
          <option value="*">Every hour</option>
          <option value="0">12 AM</option>
          <option value="12">12 PM</option>
        </select>

        {/* DAY OF MONTH */}
        <select value={day} onChange={(e) => setDay(e.target.value)} className="bg-[#111] text-white p-2 rounded">
          <option value="*">Every day</option>
          <option value="1">1st</option>
          <option value="15">15th</option>
        </select>

        {/* MONTH */}
        <select value={month} onChange={(e) => setMonth(e.target.value)} className="bg-[#111] text-white p-2 rounded">
          <option value="*">Every month</option>
          <option value="1">Jan</option>
          <option value="6">June</option>
        </select>

      </div>

      {/* SAFE OUTPUT */}
      <div className="text-[#00f5ff] text-sm mt-2">
        Preview: <b>{buildCron(second, minute, hour, day, month)}</b>
      </div>
    </div>
  );
};
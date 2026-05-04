import { useState } from "react";

export const JobsTable = () => {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      name: "Daily Backup",
      cron: "0 0 * * *",
      status: "ACTIVE",
      nextRun: "2026-04-07 00:00",
    },
  ]);

  const toggleStatus = (id) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id
          ? { ...job, status: job.status === "ACTIVE" ? "PAUSED" : "ACTIVE" }
          : job
      )
    );

    // 🔗 call backend
    // await api.patch(`/jobs/${id}/toggle`)
  };

  return (
    <div className="bg-[#111] rounded-3xl border border-white/10 overflow-hidden">
      <table className="w-full">
        <thead className="bg-white/5 text-white/60 text-sm">
          <tr>
            <th className="p-4">Job</th>
            <th>Cron</th>
            <th>Status</th>
            <th>Next Run</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {jobs.map((job) => (
            <tr key={job.id} className="border-t border-white/10">
              <td className="p-4">{job.name}</td>
              <td className="font-mono text-[#00f5ff]">{job.cron}</td>

              {/* Status */}
              <td>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    job.status === "ACTIVE"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {job.status}
                </span>
              </td>

              <td>{job.nextRun}</td>

              {/* Pause / Resume */}
              <td>
                <button
                  onClick={() => toggleStatus(job.id)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm"
                >
                  {job.status === "ACTIVE" ? "Pause" : "Resume"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
// import { useState } from "react";

// export const CronEditor = ({ value, onChange }) => {
//   const [minute, setMinute] = useState("0");
//   const [hour, setHour] = useState("0");
//   const [day, setDay] = useState("*");

//   const generateCron = (m, h, d) => {
//     const cron = `${m} ${h} ${d} * *`;
//     onChange(cron);
//   };

//   return (
//     <div className="bg-[#111] p-6 rounded-3xl border border-white/10 space-y-4">
      
//       <h3 className="text-lg text-[white]">Cron Builder</h3>

//       <div className="grid grid-cols-3 gap-4">
        
//         {/* Minute */}
//         <select
//           value={minute}
//           onChange={(e) => {
//             setMinute(e.target.value);
//             generateCron(e.target.value, hour, day);
//           }}
//           aria-placeholder="Minute"
//           className="border text-white/70 bg-white/5 border-white/20 p-3 rounded-xl"
//         >
//           {[...Array(60)].map((_, i) => (
//             <option className="bg-white/5 text-white/70" key={i}>{i}</option>
//           ))}
//         </select>

//         {/* Hour */}
//         <select
//           value={hour}
//           onChange={(e) => {
//             setHour(e.target.value);
//             generateCron(minute, e.target.value, day);
//           }}
//           aria-placeholder="Hour"
//           className="border text-white/70 bg-white/5 border-white/20 p-3 rounded-xl"
//         >
//           {[...Array(24)].map((_, i) => (
//             <option className="bg-white/5 text-white/70" key={i}>{i}</option>
//           ))}
//         </select>

//         {/* Day */}
//         <select
//           value={day}
//           onChange={(e) => {
//             setDay(e.target.value);
//             generateCron(minute, hour, e.target.value);
//           }}
//           className=" border bg-white/5 text-white/70 border-white/20 p-3 rounded-xl"
//           aria-placeholder="Day"
//         >
//           <option className="bg-white/5 text-white/70" value="*">Every Day</option>
//           <option className="bg-white/5 text-white/70" value="1">Monday</option>
//           <option className="bg-white/5 text-white/70" value="2">Tuesday</option>
//           <option className="bg-white/5 text-white/70" value="3">Wednesday</option>
//           <option className="bg-white/5 text-white/70" value="4">Thursday</option>
//           <option className="bg-white/5 text-white/70" value="5">Friday</option>
//           <option className="bg-white/5 text-white/70" value="6">Saturday</option>
//           <option className="bg-white/5 text-white/70" value="7">Sunday</option>
//         </select>
//       </div>

//       {/* Preview */}
//       <div className="bg-black p-4 rounded-xl font-mono text-[white]">
//         {value}
//       </div>
//     </div>
//   );
// };

import { useState, useRef, useEffect } from "react";

/* ------------------ Reusable Dropdown ------------------ */
const Dropdown = ({ value, options, onChange, placeholder }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!ref.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full ">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left border border-white/20 bg-white/5 text-white/70 p-3 rounded-xl 
                   hover:bg-white/10 transition-all duration-200 flex justify-between items-center"
      >
        <span>{value ?? placeholder}</span>
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>

      {/* Dropdown */}
      <div
        className={`absolute z-50 mt-2 w-full rounded-xl border border-white/10 bg-[#111] shadow-xl 
                   overflow-hidden transition-all duration-200 ${
                     open
                       ? "opacity-100 scale-100"
                       : "opacity-0 scale-95 pointer-events-none"
                   }`}
      >
        <div className="max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer text-white/70 
                         hover:bg-white/10 hover:text-white transition-all
                         ${
                           value === opt.value
                             ? "bg-white/10 text-white"
                             : ""
                         }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ------------------ Cron Editor ------------------ */
export const CronEditor = ({ isOpen, onClose, value, onChange }) => {
  const [minute, setMinute] = useState(0);
  const [hour, setHour] = useState(0);
  const [day, setDay] = useState("*");

  const generateCron = (m, h, d) => {
    const cron = `${m} ${h} ${d} * *`;
    onChange(cron);
  };

  // Options
  const minuteOptions = [...Array(60)].map((_, i) => ({
    label: i,
    value: i,
  }));

  const hourOptions = [...Array(24)].map((_, i) => ({
    label: i,
    value: i,
  }));

  const dayOptions = [
    { label: "Every Day", value: "*" },
    { label: "Monday", value: "1" },
    { label: "Tuesday", value: "2" },
    { label: "Wednesday", value: "3" },
    { label: "Thursday", value: "4" },
    { label: "Friday", value: "5" },
    { label: "Saturday", value: "6" },
    { label: "Sunday", value: "7" },
  ];

    if (!isOpen) return null;

  return (
    <div className="bg-gradient-to-br from-black via-[#050505] to-[#0a0a0a] p-6 rounded-3xl border border-white/10 space-y-4">
      <h3 className="text-lg text-white">Cron Builder</h3>

      <div className="grid grid-cols-3 gap-4">
        {/* Minute */}
        <Dropdown
          value={minute}
          options={minuteOptions}
          placeholder="Minute"
          onChange={(val) => {
            setMinute(val);
            generateCron(val, hour, day);
          }}
        />

        {/* Hour */}
        <Dropdown
          value={hour}
          options={hourOptions}
          placeholder="Hour"
          onChange={(val) => {
            setHour(val);
            generateCron(minute, val, day);
          }}
        />

        {/* Day */}
        <Dropdown
          value={
            dayOptions.find((d) => d.value === day)?.label || "Select Day"
          }
          options={dayOptions}
          placeholder="Day"
          onChange={(val) => {
            setDay(val);
            generateCron(minute, hour, val);
          }}
        />
      </div>

      {/* Preview */}
      <div className="bg-white/5 p-4 rounded-xl font-mono text-white">
        {value}
      </div>


      {/* update and cancel button */}
      {/* Actions */}
<div className="flex justify-end gap-3 pt-4">
  
  {/* Cancel Button */}
  <button
    onClick={onClose}
    className="group flex items-center gap-2 px-4 py-2 rounded-xl 
               bg-white/5 border border-white/10 text-white/70 
               hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400
               transition-all duration-200"
  >
    {/* Icon */}
    <svg
      className="w-4 h-4 transition-transform group-hover:rotate-90"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
    </svg>
    Cancel
  </button>

  {/* Update Button */}
  <button
    onClick={() => {
      onClose?.(); // keep logic untouched, just closes
    }}
    className="group flex items-center gap-2 px-5 py-2 rounded-xl 
               bg-gradient-to-r from-emerald-400 to-cyan-400
               text-white font-medium shadow-lg shadow-purple-500/20
               hover:shadow-purple-500/40 hover:scale-[1.03]
               active:scale-[0.97]
               transition-all duration-200"
  >
    {/* Icon */}
    <svg
      className="w-4 h-4 transition-transform group-hover:rotate-12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
    Update
  </button>
</div>
    </div>
  );
};
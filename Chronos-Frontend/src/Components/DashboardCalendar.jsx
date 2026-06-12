import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "../Css/DashboardCalendar.css";
import ContextAPI from "../ContextApi/ContextAPI";
import api from "../API_Axios/AxiosApi";
import { useContext } from "react";
import { useEffect } from "react";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function DashboardCalendar() {

     const{user, setRefresh,showNotification,setNotification,notification,setHistory,history}=useContext(ContextAPI)

useEffect(() => {
  loadHistory();
}, []);

const loadHistory = async () => {
  try {
    const res = await api.get("/job/history");

    setHistory(res.data);

  } catch (err) {
    console.error(err);
  }
};

console.log(history)
const events = history.map(item => ({
  id: item.id,

  title: item.jobName,

  start: new Date(item.startTime),

  end: new Date(item.endTime),

  resource: {
    status: item.status,
    durationMs: item.durationMs
  }
}));

// const events = jobs.map(job => ({
//   title: job.jobName,
//   start: new Date(job.next_run_time ),
//   end: new Date(job.next_run_time ),
//   resource: {
//     status: job.status,
//   },
// }));

//   const events = [
//     {
//       title: "Database Backup",
//       start: new Date(2026, 5, 15, 10, 0),
//       end: new Date(2026, 5, 15, 11, 0),
//       resource: {
//              status: "ACTIVE"
//             }
//     },
//     {
//       title: "Email Scheduler",
//       start: new Date(2026, 5, 18, 14, 0),
//       end: new Date(2026, 5, 18, 18, 0),
//       resource:{
//         status: "FAILED"
//       }
//     },
//   ];

//   const eventPropGetter = (event) => {

//   let backgroundColor = "#00f5ff";
//   let color = "#000";

//   switch (event.resource?.status) {
//     case "ACTIVE":
//       backgroundColor = "#22c55e";
//       break;

//     case "FAILED":
//       backgroundColor = "#ef4444";
//       color = "#fff";
//       break;

//     case "PAUSED":
//       backgroundColor = "#f59e0b";
//       break;

//     case "COMPLETED":
//       backgroundColor = "#3b82f6";
//       color = "#fff";
//       break;

//     default:
//       backgroundColor = "#00f5ff";
//   }

//   return {
//     style: {
//       backgroundColor,
//       color,
//       border: "none",
//       borderRadius: "8px",
//       fontWeight: 600,
//     },
//   };
// };

const eventPropGetter = (event) => {
  return {
    className: `event-${event.resource?.status?.toLowerCase()}`
  };
};

  return (
    <div className="calendar-card">
      <div className="calendar-header">
        <h3>Upcoming executions</h3>
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={["month", "week", "day"]}
         eventPropGetter={eventPropGetter}
      />
    </div>
  );
}
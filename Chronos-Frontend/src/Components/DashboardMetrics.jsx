import {
  Activity,
  Briefcase,
  PauseCircle,
  CheckCircle,
  AlertTriangle,
  HeartPulse,
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  RadialBarChart,
  RadialBar,
} from "recharts";
import "../Css/DashboardMetrics.css";
import ContextAPI from "../ContextApi/ContextAPI";
import { useContext } from "react";
import api from "../API_Axios/AxiosApi";
import { useEffect } from "react";
import DashboardCalendar from "./DashboardCalendar";


export default function DashboardMetrics() {
        const{user, setRefresh,showNotification,setNotification,notification,setMetrics,metrics}=useContext(ContextAPI)


        
  useEffect(() => {
     loadMetrics();
  }, []);



    const loadMetrics = async () => {
    try {
const res = await api.get("/job/dashboard/metrics");
  
      setMetrics(res.data);
  
    } catch (err) {
      console.error(err);
      //show notification for error
    }
  };

  const pieData = [
    {
      name: "Success",
      value: metrics ? metrics.successfulExecutions : 0,
    },
    {
      name: "Failed",
      value: metrics ? metrics.failedExecutions: 0,
    },
  ];

  const radialData = [
    {
      name: "Health",
      value: metrics ? metrics.healthScore : 0,
      fill: "#00f5ff",
    },
  ];

  const cards = [
    {
      title: "Total Jobs",
      value: metrics ? metrics.totalJobs : 'NA',
      icon: Briefcase,
    },
    {
      title: "Active Jobs",
      value: metrics ? metrics.activeJobs : 'NA',
      icon: Activity,
    },
    {
      title: "Paused Jobs",
      value: metrics ? metrics.pausedJobs : 'NA',
      icon: PauseCircle,
    },
    {
      title: "Success Rate",
      value: `${metrics ? metrics.successRate.toFixed(1) : 'NA'}%`,
      icon: CheckCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#050505] to-[#0a0a0a] text-white p-6">
         
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
        </div>
      
    <div className="dashboard-overview">

      <div className="metrics-grid">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div key={card.title} className="metric-card">

              <div className="metric-header">
                <span>{card.title}</span>
                <Icon size={20} />
              </div>

              <h2>{card.value}</h2>

            </div>
          );
        })}
      </div>

      <div className="charts-grid">

        <DashboardCalendar />
  

        <div className="glass-card">

          <h3>Execution Breakdown</h3>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
              >
                <Cell fill="#00f5ff" />
                <Cell fill="#ff4d6d" />
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

        </div>

        <div className="glass-card">

          <h3>System Health</h3>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <RadialBarChart
              innerRadius="70%"
              outerRadius="100%"
              data={radialData}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar dataKey="value" />
            </RadialBarChart>
          </ResponsiveContainer>

          <div className="health-center">

            <HeartPulse size={28} />

            <h2>{metrics ? metrics.healthScore.toFixed(2) : 'NA'}%</h2>

            <span
              className={`health-badge ${metrics ? metrics.healthStatus.toLowerCase():""}`}
            >
              {metrics ? metrics.healthStatus: 'NA'}
            </span>

          </div>

        </div>
              <div className="metrics-grid secondary">

        <div className="metric-card">
          <div className="metric-header">
            <span>Executions Today</span>
            <Activity size={20} />
          </div>

          <h2>{metrics ? metrics.executionsToday : 'NA'}</h2>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Failed Executions</span>
            <AlertTriangle size={20} />
          </div>

          <h2>{metrics ? metrics.failedExecutions : 'NA'}</h2>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Successful Executions</span>
            <CheckCircle size={20} />
          </div>

          <h2>{metrics ? metrics.successfulExecutions : 'NA'}</h2>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Failure Rate</span>
            <AlertTriangle size={20} />
          </div>

          <h2>{metrics ? metrics.failureRate.toFixed(1) : 'NA'}%</h2>
        </div>

      </div>
      </div>



    </div>

    </div> 
  );
}
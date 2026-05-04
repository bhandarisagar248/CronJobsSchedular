import React from "react";

const features = [
  {
    title: "Cron Scheduling",
    description:
      "Efficiently run cron jobs, including advanced scheduling options, retries, and custom triggers.",
    icon: "fa-solid fa-clock",
  },
  {
    title: "Distributed Job Execution",
    description:
      "Execute tasks at scale with multiple worker nodes, ensuring high availability and fault tolerance.",
    icon: "fa-solid fa-network-wired",
  },
  {
    title: "Retry Mechanism",
    description:
      "Automatic retries with exponential backoff for failed jobs to ensure reliability.",
    icon: "fa-solid fa-redo-alt",
  },
  {
    title: "Real-Time Monitoring",
    description:
      "Monitor job execution and job queue status in real-time with metrics and logs.",
    icon: "fa-solid fa-chart-line",
  },
];

const Features = () => {
  return (
    <section className="features-section bg-gradient-to-b from-[#050505]/95 to-[#000000]/70 backdrop-blur-xl py-16">
      <div className="max-w-screen-xl mx-auto px-8">
        <h2 className="text-3xl font-semibold text-center text-white mb-8">
          Key Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card p-6 bg-[#1f1f1f] rounded-lg shadow-xl hover:scale-105 transform transition-all duration-300"
            >
              <div className="icon-container mb-4">
                <i className={`text-4xl text-[#01d3dc] ${feature.icon}`}></i>
              </div>
              <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              <p className="text-white/80 mt-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
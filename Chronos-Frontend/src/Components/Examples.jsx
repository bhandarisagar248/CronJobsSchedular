import React from "react";

const examples = [
  {
    title: "Send Reminder Email",
    description:
      "Send a reminder email to users at a scheduled time, ensuring no important tasks are missed.",
    icon: "fa-solid fa-envelope",
  },
  {
    title: "Process Payment Retry",
    description:
      "Automatically retry failed payment transactions with exponential backoff to ensure payment success.",
    icon: "fa-solid fa-credit-card",
  },
  {
    title: "Run Daily Reports",
    description:
      "Generate and send reports every day at a scheduled time, ensuring your team is always up-to-date.",
    icon: "fa-solid fa-file-alt",
  },
  {
    title: "Trigger Workflow Automation",
    description:
      "Trigger workflows based on job status, ensuring your processes are automated and efficient.",
    icon: "fa-solid fa-cogs",
  },
];

const Examples = () => {
  return (
    <section className="examples-section bg-gradient-to-b from-[#050505]/95 to-[#000000]/70 backdrop-blur-xl py-16">
      <div className="max-w-screen-xl mx-auto px-8">
        <h2 className="text-3xl font-semibold text-center text-white mb-8">
          Real-World Examples
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {examples.map((example, index) => (
            <div
              key={index}
              className="example-card p-6 bg-[#1f1f1f] rounded-lg shadow-xl hover:scale-105 transform transition-all duration-300"
            >
              <div className="icon-container mb-4">
                <i className={`text-4xl text-[#01d3dc] ${example.icon}`}></i>
              </div>
              <h3 className="text-xl font-semibold text-white">{example.title}</h3>
              <p className="text-white/80 mt-2">{example.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Examples;
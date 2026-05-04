import React from "react";

const docs = [
  {
    title: "Getting Started",
    description:
      "Step-by-step guide to get Chronos up and running with your first job setup.",
    link: "/docs/getting-started",
  },
  {
    title: "API Reference",
    description: "Comprehensive API documentation for integrating Chronos with your application.",
    link: "/docs/api",
  },
  {
    title: "Setup Instructions",
    description: "Learn how to set up Chronos on your server or cloud environment.",
    link: "/docs/setup",
  },
  {
    title: "Advanced Features",
    description:
      "Explore advanced features like retries, job dependencies, and rate limiting.",
    link: "/docs/advanced",
  },
];

const Docs = () => {
  return (
    <section className="docs-section bg-gradient-to-b from-[#050505]/95 to-[#000000]/70 backdrop-blur-xl py-16">
      <div className="max-w-screen-xl mx-auto px-8">
        <h2 className="text-3xl font-semibold text-center text-white mb-8">
          Documentation
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {docs.map((doc, index) => (
            <div
              key={index}
              className="doc-card p-6 bg-[#1f1f1f] rounded-lg shadow-xl hover:scale-105 transform transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-white">{doc.title}</h3>
              <p className="text-white/80 mt-2">{doc.description}</p>
              <a
                href={doc.link}
                className="text-[#01d3dc] mt-4 inline-block hover:underline"
              >
                Read more
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Docs;

const FEATURES = [
  {
    icon: "fa-network-wired",
    color: "#00f5ff",
    title: "Distributed by design",
    desc: "Multi-region, multi-cluster execution. Your jobs survive entire datacenter outages.",
    tags: ["Kafka", "etcd", "Raft consensus"],
  },
  {
    icon: "fa-rotate-right",
    color: "emerald",
    title: "Smart retries + backoff",
    desc: "Exponential backoff, circuit breakers, dead-letter queues, and automatic recovery built in.",
    extra: "progress",
  },
  {
    icon: "fa-timeline",
    color: "purple",
    title: "Cron + DAG workflows",
    desc: "Visual workflow builder with dependencies and approvals.",
    workflows: [
      "daily-report → email-team",
      "payment → receipt + analytics",
    ],
  },
];

const EXAMPLES = [
  {
    icon: "fa-envelope",
    color: "#00f5ff",
    title: "9:00 AM reminder emails for 2.4 million users",
    meta: "Stripe • 100% delivery rate • 0.3s latency",
  },
  {
    icon: "fa-credit-card",
    color: "amber",
    title: "Automatic retry of failed subscription payments",
    meta: "Notion • Saved $187k last month",
  },
  {
    icon: "fa-chart-bar",
    color: "purple",
    title: "Daily analytics + billing pipeline",
    meta: "Vercel • Runs in 9 minutes",
  },
  {
    icon: "fa-robot",
    color: "cyan",
    title: "AI training data ingestion pipeline",
    meta: "OpenAI • 1.8 TB daily",
  },
];

/* ================= COMPONENT ================= */

export const Features_Example = () => {
  return (
    <>
      {/* FEATURES */}
      <section id="features" className="py-24 bg-[#050505]">
        <div className="max-w-screen-2xl mx-auto px-8">

          <Header
            badge="BUILT FOR SCALE"
            title={
              <>
                Everything you need.<br />Nothing you don’t.
              </>
            }
          />

          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((feature, i) => (
              <FeatureCard key={i} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* EXAMPLES */}
      <section id="examples" className="py-24 border-t border-white/10">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="grid md:grid-cols-12 gap-8 items-center">

            <div className="md:col-span-5">
              <h2 className="heading-font text-5xl font-semibold tracking-[-1px]">
                Real jobs.<br />Real impact.
              </h2>
              <p className="mt-6 text-xl text-white/70">
                See how leading companies use Chronos every day.
              </p>
            </div>

            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {EXAMPLES.map((item, i) => (
                <ExampleCard key={i} {...item} />
              ))}
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

/* ================= SUB COMPONENTS ================= */

const Header = ({ badge, title}) => (
  <div className="text-center mb-16">
    <span className="px-4 py-2 text-xs tracking-[1px] font-mono bg-white/5 text-[#01d3dc] rounded-3xl">
      {badge}
    </span>
    <h2 className="heading-font text-6xl tracking-[-1px] font-semibold mt-4 text-[#ffffffe6]">
      {title}
    </h2>
  </div>
);

const FeatureCard = ({ icon, title, desc, tags, extra, workflows }) => (
  <div className="card-hover glass border border-white/10 rounded-3xl p-8">
    
    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
      <i className={`fa-solid ${icon} text-3xl text-[#dcdcdd]`}></i>
    </div>

    <h3 className="text-2xl font-semibold mb-3 text-[#ffffffe6]">{title}</h3>
    <p className="text-white/70">{desc}</p>

    {tags && (
      <div className="mt-8 text-xs font-mono uppercase text-white/40 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="px-3 py-1 bg-white/10 rounded-3xl">
            {tag}
          </span>
        ))}
      </div>
    )}

    {extra === "progress" && (
      <>
        <div className="mt-10 h-2 bg-white/10 rounded-3xl overflow-hidden">
          <div className="h-full w-3/4 bg-gradient-to-r from-emerald-400 to-cyan-400"></div>
        </div>
        <p className="text-xs mt-2 text-white/40">
          Average recovery time: 380ms
        </p>
      </>
    )}

    {workflows && (
      <div className="mt-8 flex gap-2">
        {workflows.map((wf) => (
          <div
            key={wf}
            className=" text-[#fff6] text-xs px-4 py-2 bg-white/5 rounded-3xl flex-1 text-center"
          >
            {wf}
          </div>
        ))}
      </div>
    )}
  </div>
);

const ExampleCard = ({ icon, title, meta }) => (
  <div className="glass border border-white/10 rounded-3xl p-6">
    <i className={`fa-solid ${icon} text-4xl mb-6`}></i>
    <p className="font-semibold">{title}</p>
    <p className="text-xs text-white/50 mt-1">{meta}</p>
  </div>
);
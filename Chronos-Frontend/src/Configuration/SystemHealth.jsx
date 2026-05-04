export const SystemHealth = () => {
  return (
    <div className="grid grid-cols-3 gap-4 mt-6">

      {/* Kafka */}
      <div className="bg-[#111] p-6 rounded-2xl border border-white/10">
        <h3 className="text-sm text-white/60">Kafka</h3>
        <p className="text-green-400">Connected</p>
        <p className="text-xs text-white/40">Partitions: 12</p>
      </div>

      {/* Redis */}
      <div className="bg-[#111] p-6 rounded-2xl border border-white/10">
        <h3 className="text-sm text-white/60">Redis</h3>
        <p className="text-green-400">Healthy</p>
        <p className="text-xs text-white/40">Latency: 2ms</p>
      </div>

      {/* Workers */}
      <div className="bg-[#111] p-6 rounded-2xl border border-white/10">
        <h3 className="text-sm text-white/60">Workers</h3>
        <p className="text-[#00f5ff]">8 Active</p>
      </div>

    </div>

// For priority
//     <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
//   HIGH
// </span>


// for retry
// <button className="text-yellow-400">Retry</button> 


//dead letter queen panel
// <div className="text-red-400">Failed Jobs Queue</div>
  );
};
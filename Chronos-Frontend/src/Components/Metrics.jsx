export const Metrics = () => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      
      <div className="bg-[#111] p-6 rounded-2xl border border-white/10">
        <p className="text-white/60">Success Rate</p>
        <h2 className="text-2xl text-green-400">98%</h2>
      </div>

      <div className="bg-[#111] p-6 rounded-2xl border border-white/10">
        <p className="text-white/60">Failures</p>
        <h2 className="text-2xl text-red-400">12</h2>
      </div>

      <div className="bg-[#111] p-6 rounded-2xl border border-white/10">
        <p className="text-white/60">Avg Latency</p>
        <h2 className="text-2xl text-[#00f5ff]">320ms</h2>
      </div>

    </div>
  );
};
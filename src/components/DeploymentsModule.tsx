import { useEffect, useState } from 'react';
import { api } from '../api';
import { Deployment, Project } from '../types';
import { Terminal, CheckCircle2, AlertCircle, RefreshCcw } from 'lucide-react';

export default function DeploymentsModule() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [projects, setProjects] = useState<Record<string, Project>>({});
  
  useEffect(() => {
    Promise.all([
      api.getDeployments(),
      api.getProjects()
    ]).then(([deps, projs]) => {
      setDeployments(deps);
      const projMap = projs.reduce((acc, p) => ({...acc, [p.id]: p}), {});
      setProjects(projMap);
    });
  }, []);

  return (
    <div className="w-full max-w-[1440px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight mb-2">Global Pipeline</h1>
          <p className="text-gray-500 text-base md:text-lg font-medium">Real-time status of cross-project automated deployments.</p>
        </div>
        <button className="bg-white border border-[#EEEEEE] text-black px-6 py-3.5 rounded-full font-bold hover:bg-gray-50 transition-all sm:w-auto w-full flex items-center justify-center space-x-2 shadow-sm">
          <RefreshCcw size={16} />
          <span>Sync Logs</span>
        </button>
      </div>

      <div className="bg-white border border-[#EEEEEE] rounded-[32px] shadow-sm overflow-hidden p-2 sm:p-4">
        <div className="overflow-x-auto bg-white rounded-[24px] md:border border-transparent md:border-[#EEEEEE]">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[#EEEEEE]">
                <th className="px-6 py-5 font-bold text-[10px] uppercase tracking-widest text-gray-400 bg-[#FAFAFA] rounded-tl-[16px]">Time (UTC)</th>
                <th className="px-6 py-5 font-bold text-[10px] uppercase tracking-widest text-gray-400 bg-[#FAFAFA]">Ref ID</th>
                <th className="px-6 py-5 font-bold text-[10px] uppercase tracking-widest text-gray-400 bg-[#FAFAFA]">Environment</th>
                <th className="px-6 py-5 font-bold text-[10px] uppercase tracking-widest text-gray-400 bg-[#FAFAFA]">Target</th>
                <th className="px-6 py-5 font-bold text-[10px] uppercase tracking-widest text-gray-400 bg-[#FAFAFA] rounded-tr-[16px]">State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEEEEE] font-sans text-sm">
              {deployments.map(d => (
                <tr key={d.id} className="hover:bg-[#FAFAFA] transition-colors group">
                  <td className="px-6 py-5 text-gray-500 font-mono text-xs">{new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
                  <td className="px-6 py-5 font-mono font-bold text-xs">
                     <span className="bg-[#EEEEEE]/50 group-hover:bg-white border border-transparent group-hover:border-[#EEEEEE] px-2 py-1 rounded transition-colors">
                       {d.id.substring(0, 8)}
                     </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                      {d.env}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-bold text-sm tracking-tight text-black max-w-[200px] truncate">
                    {projects[d.projectId]?.name || d.projectId}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-3">
                      {d.status === 'success' && <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center shadow-sm"><CheckCircle2 className="text-white" size={14} /></div>}
                      {d.status === 'failed' && <div className="w-8 h-8 rounded-full bg-white border border-[#EEEEEE] flex items-center justify-center shadow-sm"><AlertCircle className="text-gray-400" size={14} /></div>}
                      <span className="capitalize font-bold text-xs tracking-wide">{d.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {deployments.length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center text-gray-400">
            <div className="w-16 h-16 rounded-3xl bg-[#FAFAFA] border border-[#EEEEEE] flex items-center justify-center mb-6 shadow-sm">
               <Terminal size={24} className="opacity-50" />
            </div>
            <p className="font-mono text-xs uppercase tracking-widest font-bold">Awaiting pipeline telemetry</p>
          </div>
        )}
      </div>
    </div>
  );
}

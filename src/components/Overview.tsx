import { useEffect, useState } from 'react';
import { api } from '../api';
import { SystemStatus, Project, Deployment } from '../types';
import { Activity, ServerCrash, CheckCircle2, AlertCircle, Clock, ChevronRight, MoreVertical } from 'lucide-react';
import { cn } from './Layout';
import { Link } from 'react-router-dom';

export default function Overview() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getSystemStatus(),
      api.getProjects(),
      api.getDeployments()
    ]).then(([sysStatus, projs, deps]) => {
      setStatus(sysStatus);
      setProjects(projs);
      setDeployments(deps);
      setLoading(false);
    });
  }, []);

  if (loading || !status) {
    return (
      <div className="h-full flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-black border-r-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* 2-Column Main Layout similar to screenshot */}
      <div className="flex flex-col xl:flex-row gap-8">
        
        {/* Left Column (Main Content Area) */}
        <div className="flex-1 space-y-8 min-w-0">
          
          {/* Hero Banner */}
          <div className="bg-black text-white rounded-[32px] p-8 md:p-12 relative overflow-hidden shadow-lg border border-gray-800">
            {/* Abstract ambient shapes (using pure CSS for mono style) */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-[0.03] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="relative z-10 max-w-xl">
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4 block">System Core</span>
              <h1 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight mb-6 leading-[1.1]">
                Master System Dashboard & Control Interface
              </h1>
              <p className="text-gray-400 text-sm md:text-base font-medium mb-8 max-w-md">
                Monitor connected environments, track deployment pipelines, and configure central registries from a unified console.
              </p>
              <button className="bg-white text-black px-6 py-3.5 rounded-full font-bold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2 text-sm shadow-md">
                <span>View Global Matrix</span>
                <div className="bg-black text-white rounded-full p-1 border-2 border-white">
                  <ChevronRight size={14} />
                </div>
              </button>
            </div>
          </div>

          {/* Quick Stats Row (The equivalent of "UI/UX Design", "Branding" cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
             <MetricCard title="System Load" value={status.system_load} icon={<ServerCrash size={20} />} />
             <MetricCard title="Healthy Services" value={status.healthy_services.toString()} icon={<CheckCircle2 size={20} />} trend="Stable" />
             <MetricCard title="Pending Tasks" value={status.tasks_pending.toString()} icon={<Clock size={20} />} />
          </div>

          {/* Active Registries Area (Equivalent of "Continue Watching") */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">Active Registries</h2>
              <div className="flex space-x-2">
                 <button className="w-10 h-10 rounded-full border border-[#EEEEEE] bg-white flex items-center justify-center hover:bg-gray-50 transition-colors">
                   <ChevronRight size={18} className="rotate-180 text-gray-400" />
                 </button>
                 <button className="w-10 h-10 rounded-full border border-black bg-black text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm">
                   <ChevronRight size={18} />
                 </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 3).map((p) => (
                <Link key={p.id} to={`/projects/${p.id}`} className="group relative bg-white border border-[#EEEEEE] rounded-[24px] p-6 shadow-sm hover:border-black transition-all hover:shadow-md flex flex-col h-full">
                  <div className="absolute top-4 right-4">
                    <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-black transition-colors opacity-0 group-hover:opacity-100">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                  <div className="mb-8">
                    <span className={cn(
                      "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                      p.health === 'healthy' ? "bg-black text-white" : "bg-gray-100 text-black border border-[#EEEEEE]"
                    )}>
                      {p.health}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl tracking-tight mb-2 group-hover:underline decoration-2 underline-offset-4">{p.name}</h3>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed flex-1">
                    Environment instance managing internal routing and data persistence modules.
                  </p>
                  
                  <div className="mt-8 pt-4 border-t border-[#EEEEEE] flex justify-between items-center text-xs font-mono font-semibold">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-black">A</div>
                      <span>Admin</span>
                    </div>
                    <span className="text-black">v{p.version}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar (Analytics / Logs) */}
        <aside className="w-full xl:w-[380px] space-y-8 shrink-0">
          
          {/* Health Statistic Ring */}
          <div className="bg-white border border-[#EEEEEE] rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold tracking-tight">System Health</h3>
              <MoreVertical size={18} className="text-gray-400" />
            </div>
            
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                {/* SVG Ring mapped directly to "Healthy Services / Total" */}
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="#EEEEEE" strokeWidth="12" fill="none" />
                  <circle 
                    cx="80" cy="80" r="70" 
                    stroke="#000000" strokeWidth="12" fill="none" 
                    strokeLinecap="round"
                    strokeDasharray="439.8" 
                    strokeDashoffset={439.8 - ((status.healthy_services / status.projects) || 1) * 439.8} 
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-display font-extrabold">{status.healthy_services}</span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Healthy</span>
                </div>
                
                {/* Simulated floating badge */}
                <div className="absolute top-2 right-2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-full border-2 border-white shadow-sm">
                  100%
                </div>
              </div>
              
              <h4 className="font-display font-bold text-xl tracking-tight mb-2">Systems Operational</h4>
              <p className="text-sm text-gray-500 text-center font-medium max-w-[250px]">
                Global registry instances are resolving correctly with optimal latency.
              </p>
            </div>
          </div>

          {/* Activity Graph (Stylized Bar Chart) */}
          <div className="bg-white border border-[#EEEEEE] rounded-[32px] p-8 shadow-sm">
            <h3 className="text-lg font-bold tracking-tight mb-8">Network IO</h3>
            <div className="h-40 flex items-end justify-between gap-2 px-2 relative font-mono text-[10px] text-gray-400 font-bold">
               {/* Y-axis labels */}
               <div className="absolute left-0 bottom-0 top-0 w-8 flex flex-col justify-between items-end pr-2 py-2">
                 <span>60</span>
                 <span>40</span>
                 <span>20</span>
               </div>
               
               {/* Grid lines */}
               <div className="absolute inset-0 pl-10 right-4 flex flex-col justify-between py-2 pointer-events-none">
                 <div className="border-b border-gray-100 w-full h-0" />
                 <div className="border-b border-gray-100 w-full h-0" />
                 <div className="border-b border-gray-100 w-full h-0" />
               </div>

               {/* Bars */}
               <div className="flex-1 flex items-end justify-around pl-10 relative z-10 space-x-2">
                 {[30, 45, 60, 25, 40, 20].map((val, i) => (
                    <div key={i} className="w-full bg-[#FAFAFA] rounded-t-md border border-[#EEEEEE] border-b-0 relative group flex items-end justify-center h-full">
                       <div 
                         className="w-full bg-black rounded-t-[4px] transition-all duration-700 ease-out absolute bottom-0 hover:bg-gray-800" 
                         style={{ height: `${(val / 60) * 100}%` }}
                       />
                       <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-black text-white text-[10px] py-1 px-2 rounded font-bold shadow-md transform -translate-y-2 transition-all">
                         {val}Mb
                       </div>
                    </div>
                 ))}
               </div>
            </div>
            <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-6 pl-12 pr-4 font-mono">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>
          </div>

          {/* Event Logs List */}
          <div className="bg-white border border-[#EEEEEE] rounded-[32px] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold tracking-tight flex items-center space-x-2">
                <span>Recent Deployments</span>
              </h3>
              <button className="w-8 h-8 rounded-full border border-[#EEEEEE] flex items-center justify-center hover:bg-gray-50 text-black">
                <ChevronRight size={14} />
              </button>
            </div>
            
            <div className="space-y-4">
              {deployments.slice(0, 3).map((d) => (
                <div key={d.id} className="flex items-center justify-between p-4 rounded-[16px] border border-[#EEEEEE] hover:border-black transition-colors bg-[#FAFAFA]/50 group">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-white border border-[#EEEEEE] flex items-center justify-center text-black group-hover:border-black transition-colors shadow-sm">
                      <Activity size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Instance {projects.find(p => p.id === d.projectId)?.name.split(' ')[0] || d.projectId}</h4>
                      <p className="text-xs text-gray-500 font-medium mt-0.5 capitalize">{d.env}</p>
                    </div>
                  </div>
                  <button className="px-4 py-1.5 rounded-full border border-[#EEEEEE] bg-white text-xs font-bold shadow-sm hover:bg-black hover:text-white transition-colors">
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, trend }: { title: string; value: string | number; icon: React.ReactNode; trend?: string }) {
  return (
    <div className="bg-white border border-[#EEEEEE] p-6 rounded-[24px] shadow-sm flex items-center justify-between group hover:-translate-y-1 transition-transform duration-300 hover:border-black">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-[#FAFAFA] border border-[#EEEEEE] rounded-2xl flex items-center justify-center text-black shadow-sm group-hover:bg-black group-hover:text-white transition-colors">
          {icon}
        </div>
        <div>
          <div className="text-2xl font-display font-extrabold tracking-tight">
            {value}
          </div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</div>
        </div>
      </div>
      <MoreVertical size={16} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}

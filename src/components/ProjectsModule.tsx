import { useEffect, useState } from 'react';
import { api } from '../api';
import { Project } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Settings, Plus } from 'lucide-react';
import { cn } from './Layout';

export default function ProjectsModule() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isInitializing, setIsInitializing] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    api.getProjects().then(setProjects);
  }, []);

  const handleCreateProject = async () => {
    try {
      setIsInitializing(true);
      const newProj = await api.createProject({
        name: `Registry-${Math.random().toString(36).substring(7).toUpperCase()}`
      });
      setProjects([...projects, newProj]);
      navigate(`/projects/${newProj.id}`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight mb-2">Project Matrix</h1>
          <p className="text-gray-500 text-base md:text-lg font-medium">Manage connected environments and registry instances.</p>
        </div>
        <button 
          onClick={handleCreateProject}
          disabled={isInitializing}
          className="bg-black text-white px-6 py-3.5 rounded-full font-bold hover:opacity-80 transition-all sm:w-auto w-full flex items-center justify-center space-x-2 shadow-md disabled:opacity-50"
        >
          {isInitializing ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Plus size={18} />
          )}
          <span>Initialize Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map(p => (
          <Link key={p.id} to={`/projects/${p.id}`} className="group block">
            <div className="bg-white border border-[#EEEEEE] rounded-[32px] p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:border-black flex flex-col h-[280px]">
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 rounded-2xl bg-[#FAFAFA] border border-[#EEEEEE] flex items-center justify-center text-2xl font-display font-bold shadow-sm">
                  {p.name.charAt(0)}
                </div>
                <div className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider",
                  p.health === 'healthy' ? "bg-black text-white" : "bg-gray-100 text-black border border-[#EEEEEE]"
                )}>
                  {p.health}
                </div>
              </div>
              
              <h3 className="text-2xl font-display font-bold tracking-tight mb-2 group-hover:underline decoration-2 underline-offset-4">{p.name}</h3>
              <p className="text-gray-400 font-mono text-xs uppercase tracking-widest font-bold">Status: {p.status}</p>

              <div className="mt-auto pt-6 border-t border-[#EEEEEE] flex items-center justify-between">
                <span className="font-mono text-sm text-black font-bold bg-[#FAFAFA] px-3 py-1 rounded-md border border-[#EEEEEE]">v{p.version}</span>
                <div className="w-8 h-8 rounded-full border border-[#EEEEEE] flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors text-gray-400">
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          </Link>
        ))}
        
        {/* Empty state / placeholder card */}
        <div onClick={handleCreateProject} className="border border-dashed border-[#CCCCCC] rounded-[32px] p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer h-[280px]">
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#EEEEEE] shadow-sm flex items-center justify-center text-black mb-4 group-hover:scale-105 transition-transform">
            <Plus size={22} className="opacity-80" />
          </div>
          <h3 className="font-display font-bold text-lg mb-1">Add Resource</h3>
          <p className="text-gray-400 text-sm font-medium px-4">Initialize a new project environment into the matrix.</p>
        </div>
      </div>
    </div>
  );
}

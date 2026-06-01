import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Project, Task, Deployment } from '../types';
import { ArrowLeft, CheckCircle2, Clock, Play, Code2, Copy, Trash2, Globe } from 'lucide-react';
import { cn } from './Layout';

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [urlInput, setUrlInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [isLaunched, setIsLaunched] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.getProject(id),
      api.getTasks(id),
      api.getDeployments(id)
    ]).then(([p, t, d]) => {
      setProject(p);
      setUrlInput(p.url || '');
      setNameInput(p.name || '');
      setTasks(t);
      setDeployments(d);
      setLoading(false);
    });
  }, [id]);

  const handleUrlBlur = async () => {
    if (!project || !id) return;
    if (urlInput !== project.url) {
      const updated = await api.updateProject(id, { url: urlInput });
      setProject(updated);
    }
  };

  const handleNameBlur = async () => {
    if (!project || !id || !nameInput.trim()) return;
    if (nameInput !== project.name) {
      const updated = await api.updateProject(id, { name: nameInput });
      setProject(updated);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm("Are you sure you want to delete this project resource?")) return;
    try {
      setIsDeleting(true);
      await api.deleteProject(id);
      navigate('/projects');
    } catch (e) {
      console.error(e);
      setIsDeleting(false);
    }
  };

  const handleLaunch = () => {
    if (project?.url) {
      setIsLaunched(true);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading || !project) return (
    <div className="h-full flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-black border-r-transparent rounded-full animate-spin" />
    </div>
  );

  const apiBase = window.location.origin;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 md:space-y-12 animate-in fade-in duration-500">
      <Link to="/projects" className="inline-flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-black transition-colors">
        <ArrowLeft size={16} />
        <span>Back to Directory</span>
      </Link>

      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-[#EEEEEE] mb-8">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-3">
            <input 
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={handleNameBlur}
              onKeyDown={(e) => e.key === 'Enter' && handleNameBlur()}
              className="text-4xl md:text-5xl font-extrabold tracking-tight bg-transparent border-none outline-none focus:ring-2 focus:ring-[#EEEEEE] rounded py-1 px-2 -ml-2"
              placeholder="Project Name"
            />
            <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-fit",
                  project.health === 'healthy' ? "bg-black text-white" : "bg-gray-100 text-black border border-gray-200"
                )}>
              {project.health}
            </span>
          </div>
          <p className="text-gray-500 font-mono text-sm break-all pl-2">Registry ID: {project.id} &nbsp;|&nbsp; Version: {project.version}</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button 
            disabled={isDeleting}
            onClick={handleDelete}
            className="border border-red-200 bg-red-50 text-red-600 px-6 py-3 rounded-full font-bold hover:bg-red-100 transition-colors w-full sm:w-auto flex items-center justify-center space-x-2"
          >
            <Trash2 size={16} />
            <span>{isDeleting ? "Terminating..." : "Terminate"}</span>
          </button>
        </div>
      </header>

      {/* App Preview Container */}
      <section className="col-span-full mb-8 sm:mb-12 w-full">
        <div className="bg-[#FAFAFA] p-2 sm:p-4 rounded-[24px] md:rounded-[32px] border border-[#EEEEEE] shadow-sm">
          <div className="aspect-square sm:aspect-video lg:aspect-[21/9] bg-white rounded-[16px] md:rounded-[24px] border border-[#EEEEEE] overflow-hidden flex flex-col shadow-sm w-full">
            <div className="h-10 md:h-12 border-b border-[#EEEEEE] flex items-center px-4 space-x-2 sm:space-x-4">
              <div className="flex space-x-1.5 sm:space-x-2 flex-shrink-0">
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-gray-300" />
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-gray-300" />
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-gray-300" />
              </div>
              <div className="flex-1 max-w-[200px] sm:max-w-sm mx-auto h-6 md:h-8">
                <input
                  type="url"
                  placeholder="https://your-live-project.com"
                  className="w-full h-full bg-[#FAFAFA] border border-[#EEEEEE] rounded-md px-2 sm:px-3 text-[10px] sm:text-xs font-mono text-gray-500 text-center outline-none focus:border-black transition-colors"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onBlur={handleUrlBlur}
                  onKeyDown={(e) => e.key === 'Enter' && handleUrlBlur()}
                />
              </div>
            </div>
            {isLaunched && project.url ? (
              <div className="flex-1 w-full bg-white relative">
                <iframe src={project.url} className="absolute inset-0 w-full h-full border-0 bg-white" title={`Preview of ${project.name}`} sandbox="allow-scripts allow-same-origin allow-forms" />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[#FAFAFA] flex items-center justify-center mb-3 sm:mb-4 border border-[#EEEEEE]">
                  <span className="font-display font-bold text-xl sm:text-2xl text-black">{project.name.charAt(0)}</span>
                </div>
                <p className="font-mono text-xs sm:text-sm text-black font-medium text-center px-2">Application Environment Live</p>
                <button
                  onClick={handleLaunch}
                  disabled={!project.url}
                  className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-2.5 bg-white border border-[#EEEEEE] shadow-sm text-black rounded-full font-bold text-xs sm:text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <Play size={16} className={project.url ? "text-black" : "text-gray-300"} />
                  <span>Launch Container</span>
                </button>
                {!project.url && <p className="text-[10px] sm:text-xs font-mono text-gray-400 mt-3 max-w-xs">Enter a valid URL in the address bar above to launch.</p>}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 mb-12">
        {/* API Provisioning Section */}
        <section className="col-span-full">
          <div className="bg-black text-white rounded-[32px] p-6 sm:p-10 shadow-lg border border-gray-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white opacity-[0.02] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Code2 size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-extrabold tracking-tight">API & Services</h2>
                  <p className="text-gray-400 text-sm font-medium">Connected applications can use Nexus to CRUD data or access AI models.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#121212] border border-gray-800 rounded-[20px] p-6">
                  <h3 className="font-bold text-sm tracking-widest uppercase text-gray-500 mb-4 flex justify-between items-center">
                    <span>Generic Document Store</span>
                    <Globe size={16} />
                  </h3>
                  <div className="space-y-4 font-mono text-xs">
                    <div className="flex flex-col">
                      <span className="text-gray-500 mb-1">Create Record (POST) / Read (GET)</span>
                      <div className="flex items-center justify-between bg-black border border-gray-800 px-3 py-2.5 rounded-lg text-gray-300">
                        <span className="truncate max-w-[200px] sm:max-w-xs">{apiBase}/api/projects/{project.id}/data/:collection</span>
                        <button onClick={() => copyToClipboard(`${apiBase}/api/projects/${project.id}/data/:collection`)} className="hover:text-white p-1">
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#121212] border border-gray-800 rounded-[20px] p-6">
                  <h3 className="font-bold text-sm tracking-widest uppercase text-gray-500 mb-4 flex justify-between items-center">
                    <span>AI Model Proxy (Gemini)</span>
                    <Globe size={16} />
                  </h3>
                  <div className="space-y-4 font-mono text-xs">
                    <div className="flex flex-col">
                      <span className="text-gray-500 mb-1">Generate text from prompt (POST)</span>
                      <div className="flex items-center justify-between bg-black border border-gray-800 px-3 py-2.5 rounded-lg text-gray-300">
                        <span className="truncate max-w-[200px] sm:max-w-xs">{apiBase}/api/projects/{project.id}/ai/generate</span>
                        <button onClick={() => copyToClipboard(`${apiBase}/api/projects/${project.id}/ai/generate`)} className="hover:text-white p-1">
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="text-gray-500 text-[10px] mt-2 leading-relaxed">
                      Body: <code className="text-gray-300">{"{ \"prompt\": \"your text here\" }"}</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Task Board */}
        <section className="bg-white border border-[#EEEEEE] rounded-[32px] p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-display font-bold tracking-tight">Active Workloads</h2>
            <button className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Add</button>
          </div>
          <div className="space-y-4">
            {tasks.length === 0 && <p className="text-gray-400 font-mono text-sm py-4 text-center">No active tasks tracked.</p>}
            {tasks.map(t => (
              <div key={t.id} className="bg-[#FAFAFA] border border-[#EEEEEE] rounded-[20px] p-5 flex items-center justify-between group hover:border-black transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-white border border-[#EEEEEE] flex items-center justify-center shadow-sm text-gray-300">
                    {t.status === 'completed' ? <CheckCircle2 className="text-black" size={18} /> : t.status === 'in-progress' ? <Play className="text-black fill-black" size={16} /> : <Clock size={18} className="text-gray-400" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm tracking-tight">{t.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 uppercase font-bold tracking-widest">{t.status}</p>
                  </div>
                </div>
                <div className="bg-white px-3 py-1.5 border border-[#EEEEEE] rounded-md text-xs font-bold text-black shadow-sm">
                  {t.assignee}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Deployments History */}
        <section className="bg-white border border-[#EEEEEE] rounded-[32px] p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-display font-bold tracking-tight mb-8">Pipeline Log</h2>
          <div className="space-y-0">
            {deployments.length === 0 && <p className="text-gray-400 font-mono text-sm py-4 text-center">No deployment history.</p>}
            {deployments.map((d, idx) => (
              <div key={d.id} className={cn("flex items-start justify-between py-5", idx !== deployments.length - 1 && "border-b border-[#EEEEEE]")}>
                <div className="flex space-x-4">
                   <div className="mt-1">
                      <div className={cn(
                        "w-2.5 h-2.5 rounded-full border-[2px]",
                        d.status === 'success' ? "bg-black border-black" : "bg-white border-gray-300"
                      )}/>
                   </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <span className="font-bold text-sm tracking-tight">Deploy to {d.env.toLowerCase()}</span>
                    </div>
                    <div className="text-xs text-gray-500 font-medium">Auto-triggered via hooks</div>
                    <div className="text-[10px] text-gray-400 font-mono uppercase tracking-widest mt-2">{new Date(d.timestamp).toLocaleString()}</div>
                  </div>
                </div>
                <div className="font-mono text-xs font-bold bg-[#FAFAFA] border border-[#EEEEEE] px-2 py-1 rounded shadow-sm text-black">
                  {d.id.substring(0, 7)}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

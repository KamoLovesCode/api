import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Activity, Search, Bell, Settings } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="scroll-smooth min-h-screen bg-[#FAFAFA] flex flex-col md:flex-row font-sans text-[#121212]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed top-0 left-0 bottom-0 w-[280px] bg-white border-r border-[#EEEEEE] flex-col py-8 px-6 z-40">
        <div className="flex items-center space-x-3 mb-10 pl-2">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
            <span className="text-white font-display font-bold text-xl leading-none">N</span>
          </div>
          <span className="font-display font-bold text-2xl tracking-tight">NEXUS</span>
        </div>

        <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4 pl-4">Menu</span>
        <nav className="flex-1 space-y-1.5">
          <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Overview" />
          <NavItem to="/projects" icon={<FolderKanban size={20} />} label="Projects" />
          <NavItem to="/deployments" icon={<Activity size={20} />} label="Deployments" />
        </nav>

        <div className="mt-auto pt-8">
          <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4 pl-4 block">System</span>
          <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" />
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="md:hidden bg-white border-b border-[#EEEEEE] p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
            <span className="text-white font-display font-bold text-lg leading-none">N</span>
          </div>
          <span className="font-display font-bold text-lg tracking-tight">NEXUS</span>
        </div>
        <button className="w-8 h-8 rounded-full border border-[#EEEEEE] flex items-center justify-center bg-white text-gray-500">
           <Bell size={16} />
        </button>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#EEEEEE] flex justify-around items-center p-2 z-50 pb-safe">
         <MobileNavItem to="/" icon={<LayoutDashboard size={20} />} label="Overview" />
         <MobileNavItem to="/projects" icon={<FolderKanban size={20} />} label="Projects" />
         <MobileNavItem to="/deployments" icon={<Activity size={20} />} label="Deployments" />
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-[280px] flex flex-col min-h-[100dvh]">
        {/* Top Header - Desktop Only */}
        <header className="hidden md:flex items-center justify-between px-8 lg:px-12 py-6 sticky top-0 z-30 bg-[#FAFAFA]/90 backdrop-blur-md">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search registries, environments..." 
              className="w-full bg-white border border-[#EEEEEE] rounded-full pl-11 pr-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-black transition-colors shadow-sm"
            />
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <button className="w-11 h-11 rounded-full border border-[#EEEEEE] flex items-center justify-center bg-white hover:bg-gray-50 text-gray-600 transition-colors shadow-sm">
                <Bell size={18} />
              </button>
            </div>
            <div className="flex items-center space-x-4 pl-6 border-l border-[#EEEEEE]">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-bold text-black">Administrator</p>
                <p className="text-xs font-mono text-gray-500">System Manager</p>
              </div>
              <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center font-display font-bold text-lg shadow-sm">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-8 pb-28 md:pb-12 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center space-x-4 px-4 py-3.5 rounded-[16px] transition-all duration-200 font-semibold text-sm",
          isActive 
            ? "bg-black text-white shadow-md" 
            : "text-gray-500 hover:bg-white hover:text-black hover:shadow-sm"
        )
      }
    >
      {({ isActive }) => (
        <>
          <div className={cn("flex items-center justify-center", isActive ? "text-white" : "text-gray-400")}>
            {icon}
          </div>
          <span>{label}</span>
          {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
        </>
      )}
    </NavLink>
  );
}

function MobileNavItem({ to, icon, label }: { to: string; icon: ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex flex-col items-center justify-center space-y-1 p-2 rounded-xl transition-all duration-200 w-full",
          isActive 
            ? "text-black bg-gray-50/50" 
            : "text-gray-400 hover:text-black"
        )
      }
    >
      {({ isActive }) => (
        <>
          <div className={cn("p-1.5 rounded-full transition-colors", isActive && "bg-black text-white shadow-sm")}>
            {icon}
          </div>
          <span className={cn("text-[10px] font-bold tracking-wider uppercase", isActive ? "text-black" : "text-gray-400")}>
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
}

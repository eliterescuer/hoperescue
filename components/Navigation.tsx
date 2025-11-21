import React from 'react';
import { LayoutDashboard, AlertTriangle, Users, Database, Settings, Activity } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Command Deck', icon: LayoutDashboard },
    { id: 'incidents', label: 'Operations & Map', icon: AlertTriangle },
    { id: 'victims', label: 'Victim Reg', icon: Users },
    { id: 'eo-data', label: 'EO Analysis', icon: Database },
    { id: 'admin', label: 'System Admin', icon: Settings },
  ];

  return (
    <aside className="w-20 lg:w-64 bg-command-panel border-r border-slate-700 flex flex-col h-screen sticky top-0 z-50">
      <div className="p-4 flex items-center justify-center lg:justify-start gap-3 border-b border-slate-700 h-16">
        <Activity className="text-alert-red animate-pulse w-8 h-8" />
        <span className="text-xl font-bold tracking-wider hidden lg:block text-white">SENTINEL</span>
      </div>
      
      <nav className="flex-1 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center p-3 transition-colors duration-200
                ${isActive 
                  ? 'bg-tech-blue/20 text-tech-blue border-r-4 border-tech-blue' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <div className="w-full flex items-center justify-center lg:justify-start lg:px-4">
                <Icon className={`w-6 h-6 ${isActive ? 'text-tech-blue' : ''}`} />
                <span className="ml-3 font-medium hidden lg:block">{item.label}</span>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold text-white">
            HQ
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-white">Ops Commander</p>
            <p className="text-xs text-slate-400">ID: CMD-001</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
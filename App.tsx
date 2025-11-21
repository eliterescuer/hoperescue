import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { TacticalMap } from './components/TacticalMap';
import { EODashboard } from './components/EODashboard';
import { VictimRegistration } from './components/VictimRegistration';
import { MOCK_INCIDENTS } from './constants';
import { AlertTriangle, Bell, Search, Menu } from 'lucide-react';

// Main App Component acting as the "Command Center" container
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeIncidentsCount = MOCK_INCIDENTS.filter(i => i.status === 'ACTIVE').length;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="p-6 space-y-6 overflow-y-auto h-[calc(100vh-80px)]">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-command-panel p-4 rounded-xl border border-slate-700">
                <span className="text-slate-400 text-xs uppercase tracking-wider">Active Incidents</span>
                <div className="text-3xl font-bold text-white mt-1">{activeIncidentsCount}</div>
              </div>
              <div className="bg-command-panel p-4 rounded-xl border border-slate-700">
                <span className="text-slate-400 text-xs uppercase tracking-wider">Rescuers Deployed</span>
                <div className="text-3xl font-bold text-tech-blue mt-1">142</div>
              </div>
              <div className="bg-command-panel p-4 rounded-xl border border-slate-700">
                <span className="text-slate-400 text-xs uppercase tracking-wider">Victims Registered</span>
                <div className="text-3xl font-bold text-safe-green mt-1">893</div>
              </div>
              <div className="bg-command-panel p-4 rounded-xl border border-alert-red/50 bg-alert-red/10">
                <span className="text-alert-red text-xs uppercase tracking-wider font-bold">Threat Level</span>
                <div className="text-3xl font-bold text-white mt-1">HIGH</div>
              </div>
            </div>

            {/* Main Visualizer */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h3 className="text-white font-semibold mb-3">Live Tactical Map</h3>
                <TacticalMap />
              </div>
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Priority Alerts</h3>
                <div className="bg-slate-800 rounded-lg p-3 border-l-4 border-alert-red shadow-lg">
                  <div className="flex justify-between items-start">
                    <span className="text-alert-red font-bold text-xs uppercase">Flood Warning</span>
                    <span className="text-slate-500 text-xs">2m ago</span>
                  </div>
                  <p className="text-sm text-white mt-1">Sector 4 river gauge exceeding safety levels. Prepare evacuation teams.</p>
                </div>
                <div className="bg-slate-800 rounded-lg p-3 border-l-4 border-alert-orange shadow-lg">
                  <div className="flex justify-between items-start">
                    <span className="text-alert-orange font-bold text-xs uppercase">Landslide Risk</span>
                    <span className="text-slate-500 text-xs">15m ago</span>
                  </div>
                  <p className="text-sm text-white mt-1">Eastern Highlands slope saturation > 90%. Road closure recommended.</p>
                </div>

                <div className="bg-command-panel border border-slate-700 rounded-xl p-4 mt-6">
                   <h4 className="text-slate-400 text-xs uppercase mb-3">Team Chat / Logs</h4>
                   <div className="space-y-3 text-xs">
                      <div className="flex gap-2">
                        <span className="font-bold text-blue-400">Alpha-1:</span>
                        <span className="text-slate-300">Arrived at Delta point. Setting up comms.</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-bold text-green-400">Medic-2:</span>
                        <span className="text-slate-300">Triage center operational. Need 2 more stretchers.</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-bold text-yellow-400">Dispatch:</span>
                        <span className="text-slate-300">Copy Medic-2. Logistics inbound ETA 10m.</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'incidents':
        return (
          <div className="p-6 h-[calc(100vh-80px)] overflow-hidden flex flex-col">
            <h2 className="text-2xl font-bold text-white mb-4">Operations Map</h2>
            <TacticalMap />
          </div>
        );
      case 'eo-data':
        return <EODashboard />;
      case 'victims':
        return <VictimRegistration />;
      default:
        return <div className="p-10 text-slate-500">Module under development</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-200">
      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black/50 z-40 lg:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`} onClick={() => setMobileMenuOpen(false)}></div>
      
      {/* Navigation (Sidebar) */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:block transition-transform duration-300`}>
        <Navigation activeTab={activeTab} setActiveTab={(t) => { setActiveTab(t); setMobileMenuOpen(false); }} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-20 border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-30 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
             <button className="lg:hidden p-2 text-slate-400" onClick={() => setMobileMenuOpen(true)}>
               <Menu />
             </button>
             <h1 className="text-xl font-semibold text-white tracking-tight hidden sm:block">
               National Disaster Response System
             </h1>
          </div>

          <div className="flex items-center gap-4">
             {/* Scrolling Ticker for fun */}
             <div className="hidden md:flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full overflow-hidden max-w-md">
               <AlertTriangle className="w-4 h-4 text-alert-red" />
               <div className="whitespace-nowrap overflow-hidden text-xs text-alert-red font-bold animate-pulse">
                 FLOOD WARNING: SECTOR 4 - EVACUATION IN PROGRESS
               </div>
             </div>

             <div className="relative">
               <Bell className="w-6 h-6 text-slate-400 hover:text-white cursor-pointer" />
               <span className="absolute -top-1 -right-1 w-3 h-3 bg-alert-red rounded-full border-2 border-slate-900"></span>
             </div>
             <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center border border-slate-500">
               <span className="font-bold text-white">OP</span>
             </div>
          </div>
        </header>

        {/* Dynamic View */}
        <div className="flex-1 bg-slate-900 relative">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { MOCK_SENSORS, MOCK_INCIDENTS } from '../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Brain, Satellite, CloudRain, Droplets, Zap } from 'lucide-react';
import { analyzeRiskFromSensors } from '../services/geminiService';

export const EODashboard: React.FC = () => {
  const [aiAnalysis, setAiAnalysis] = useState<string>('System initializing... Waiting for EO data ingestion.');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const waterSensor = MOCK_SENSORS.find(s => s.type === 'WATER_LEVEL');
  const rainSensor = MOCK_SENSORS.find(s => s.type === 'RAINFALL');

  // Format data for charts
  const waterData = waterSensor?.trend.map((val, i) => ({ time: `T-${7-i}h`, value: val })) || [];
  const rainData = rainSensor?.trend.map((val, i) => ({ time: `T-${7-i}h`, value: val })) || [];

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setAiAnalysis("Processing sensor fusion data... Querying Gemini 2.5...");
    const result = await analyzeRiskFromSensors(MOCK_SENSORS, MOCK_INCIDENTS);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  useEffect(() => {
    // Auto run analysis on mount for demo effect
    runAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      
      {/* AI Insight Panel */}
      <div className="lg:col-span-2 bg-gradient-to-r from-slate-900 to-slate-800 border border-tech-blue/30 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Brain className="w-32 h-32 text-tech-blue" />
        </div>
        <div className="flex items-center gap-3 mb-4">
           <div className="bg-tech-blue/20 p-2 rounded-lg">
             <Satellite className="w-6 h-6 text-tech-blue" />
           </div>
           <h2 className="text-xl font-bold text-white">Gemini EO Predictive Analysis</h2>
        </div>
        
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-slate-700 min-h-[100px]">
           {isAnalyzing ? (
             <div className="flex items-center gap-3 text-tech-blue animate-pulse">
               <Zap className="w-5 h-5" />
               <span>Analyzing multispectral satellite imagery & sensor arrays...</span>
             </div>
           ) : (
             <p className="text-slate-200 leading-relaxed font-mono text-sm border-l-4 border-alert-orange pl-4">
               {aiAnalysis}
             </p>
           )}
        </div>
        
        <button 
          onClick={runAnalysis}
          disabled={isAnalyzing}
          className="mt-4 bg-tech-blue hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Brain className="w-4 h-4" />
          Refresh Risk Model
        </button>
      </div>

      {/* Chart 1: River Levels */}
      <div className="bg-command-panel border border-slate-700 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-400" />
            River Gauge: Sector 4
          </h3>
          <span className="text-xs font-mono text-alert-red animate-pulse px-2 py-1 bg-alert-red/10 rounded">
            CRITICAL THRESHOLD NEAR
          </span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={waterData}>
              <defs>
                <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
              />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorWater)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Rainfall */}
      <div className="bg-command-panel border border-slate-700 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-cyan-400" />
            Precipitation Rate (mm/h)
          </h3>
          <span className="text-xs font-mono text-alert-orange px-2 py-1 bg-alert-orange/10 rounded">
            HEAVY RAIN WARNING
          </span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rainData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
              />
              <Line type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
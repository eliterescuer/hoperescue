import React, { useState } from 'react';
import { Camera, Save, UserPlus, FileText, CheckCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { Victim, VictimStatus } from '../types';
import { extractVictimFromID } from '../services/geminiService';

export const VictimRegistration: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<Partial<Victim>>({
    fullName: '',
    nationalId: '',
    address: '',
    status: VictimStatus.SAFE,
    notes: ''
  });
  const [savedVictims, setSavedVictims] = useState<Victim[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsProcessing(true);
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        try {
          const extractedData = await extractVictimFromID(base64String);
          setFormData(prev => ({
            ...prev,
            ...extractedData
          }));
        } catch (error) {
          alert("OCR Failed or API Key missing. Please enter manually.");
        } finally {
          setIsProcessing(false);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.fullName || !formData.nationalId) {
      alert("Name and ID are required");
      return;
    }

    const newVictim: Victim = {
      id: `VIC-${Date.now()}`,
      fullName: formData.fullName,
      nationalId: formData.nationalId,
      address: formData.address || 'Unknown',
      status: formData.status || VictimStatus.SAFE,
      registeredAt: new Date().toISOString(),
      registeredBy: 'OFFICER-101',
      disasterId: 'INC-2023-001',
      notes: formData.notes
    };

    setSavedVictims([newVictim, ...savedVictims]);
    setFormData({ fullName: '', nationalId: '', address: '', status: VictimStatus.SAFE, notes: '' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 h-[calc(100vh-80px)] overflow-y-auto">
      
      {/* Registration Form */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-command-panel border border-slate-700 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <UserPlus className="text-tech-blue" />
              New Victim Registration
            </h2>
            <div className="flex items-center gap-2 text-xs text-safe-green bg-green-900/20 px-3 py-1 rounded-full border border-green-900/50">
              <ShieldCheck className="w-3 h-3" />
              PDPA Secured & Encrypted
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* OCR Section */}
            <div className="col-span-1 md:col-span-2 bg-slate-800/50 border border-dashed border-slate-600 rounded-lg p-6 flex flex-col items-center justify-center text-center">
              <input 
                type="file" 
                id="id-scan" 
                accept="image/*" 
                capture="environment"
                className="hidden" 
                onChange={handleFileChange}
              />
              <label 
                htmlFor="id-scan" 
                className={`cursor-pointer flex flex-col items-center gap-3 px-6 py-4 rounded-lg transition-all
                  ${isProcessing ? 'opacity-50 pointer-events-none' : 'hover:bg-slate-700'}
                `}
              >
                {isProcessing ? (
                  <Loader2 className="w-10 h-10 text-tech-blue animate-spin" />
                ) : (
                  <Camera className="w-10 h-10 text-slate-400" />
                )}
                <span className="text-sm font-medium text-slate-300">
                  {isProcessing ? 'Extracting Data via Gemini AI...' : 'Tap to Scan National ID (OCR)'}
                </span>
              </label>
            </div>

            {/* Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-tech-blue"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">National ID / NRIC</label>
                <input 
                  type="text" 
                  value={formData.nationalId}
                  onChange={e => setFormData({...formData, nationalId: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-tech-blue"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Current Status</label>
                <select 
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value as VictimStatus})}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-tech-blue"
                >
                  {Object.values(VictimStatus).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Address (Extracted)</label>
                <textarea 
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-tech-blue h-24 resize-none"
                />
              </div>
               <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Medical/Evacuation Notes</label>
                <input 
                  type="text" 
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-tech-blue"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button 
              onClick={handleSave}
              className="bg-safe-green hover:bg-green-600 text-white px-6 py-2 rounded font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-green-900/20"
            >
              <Save className="w-4 h-4" />
              Register Victim
            </button>
          </div>
        </div>
      </div>

      {/* Recent List */}
      <div className="bg-command-panel border border-slate-700 rounded-xl p-4 flex flex-col">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <FileText className="text-slate-400" />
          Recently Registered ({savedVictims.length})
        </h3>
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {savedVictims.length === 0 && (
            <p className="text-slate-500 text-sm text-center py-10">No records this session.</p>
          )}
          {savedVictims.map(victim => (
            <div key={victim.id} className="bg-slate-800 p-3 rounded border border-slate-700 hover:border-slate-500 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white font-medium text-sm">{victim.fullName}</p>
                  <p className="text-xs text-slate-400 font-mono">{victim.nationalId}</p>
                </div>
                {victim.status === VictimStatus.SAFE ? (
                  <CheckCircle className="w-4 h-4 text-safe-green" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-alert-orange" />
                )}
              </div>
              <div className="mt-2 text-xs text-slate-500 flex justify-between">
                <span>{new Date(victim.registeredAt).toLocaleTimeString()}</span>
                <span>{victim.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Icon helper
const AlertCircle = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
);


import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  CheckSquare, 
  MessageSquare, 
  ChevronRight, 
  AlertCircle,
  FileText,
  Search,
  CheckCircle2,
  Download,
  Menu,
  X,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PCI_REQUIREMENTS } from './constants';
import { ComplianceStatus, AssessmentState, AssessmentItem } from './types';
import { getComplianceAdvice } from './services/geminiService';

const STATUS_COLORS: Record<ComplianceStatus, string> = {
  'in-place': '#10b981', 
  'not-in-place': '#ef4444', 
  'partially-in-place': '#f59e0b', 
  'not-applicable': '#94a3b8', 
  'not-started': '#e2e8f0', 
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'assessment'>('dashboard');
  const [activeReqId, setActiveReqId] = useState<number>(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [assessment, setAssessment] = useState<AssessmentState>(() => {
    const saved = localStorage.getItem('pci_assessment_v4');
    return saved ? JSON.parse(saved) : { items: {} };
  });

  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('pci_assessment_v4', JSON.stringify(assessment));
  }, [assessment]);

  const stats = useMemo(() => {
    const counts = { 'in-place': 0, 'not-in-place': 0, 'partially-in-place': 0, 'not-applicable': 0, 'not-started': 0 };
    let total = 0;
    PCI_REQUIREMENTS.forEach(req => {
      req.subRequirements.forEach(sub => {
        counts[assessment.items[sub.id]?.status || 'not-started']++;
        total++;
      });
    });
    return { counts, total };
  }, [assessment]);

  const chartData = [
    { name: 'In Place', value: stats.counts['in-place'], color: STATUS_COLORS['in-place'] },
    { name: 'Partial', value: stats.counts['partially-in-place'], color: STATUS_COLORS['partially-in-place'] },
    { name: 'Not In Place', value: stats.counts['not-in-place'], color: STATUS_COLORS['not-in-place'] },
    { name: 'N/A', value: stats.counts['not-applicable'], color: STATUS_COLORS['not-applicable'] },
    { name: 'Pending', value: stats.counts['not-started'], color: STATUS_COLORS['not-started'] },
  ].filter(d => d.value > 0);

  const handleUpdateStatus = (subId: string, status: ComplianceStatus) => {
    setAssessment(prev => ({
      ...prev,
      items: {
        ...prev.items,
        [subId]: { ...(prev.items[subId] || { requirementId: subId, evidence: '', notes: '' }), status, updatedAt: new Date().toISOString() }
      }
    }));
  };

  const handleAskAi = async () => {
    if (!aiQuery) return;
    setIsAiLoading(true);
    const activeReq = PCI_REQUIREMENTS.find(r => r.id === activeReqId);
    const advice = await getComplianceAdvice(activeReq?.title || '', activeReqId.toString(), aiQuery);
    setAiResponse(advice || 'No advice available.');
    setIsAiLoading(false);
  };

  const exportAssessment = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(assessment, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `pci_dss_assessment_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="h-screen flex text-slate-800 overflow-hidden">
      {/* Dynamic Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-slate-900 text-white transition-all duration-300 flex flex-col h-full shadow-2xl z-20`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight">PCI DSS v4.0.1</span>
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest leading-none">Compliance Tool</span>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          <button 
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'dashboard' ? 'bg-blue-600 shadow-lg shadow-blue-600/20 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <LayoutDashboard className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="font-medium">Dashboard</span>}
          </button>
          
          <div className="pt-6 pb-2">
            {isSidebarOpen && <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4">Standard Modules</span>}
          </div>

          {PCI_REQUIREMENTS.map(req => (
            <button 
              key={req.id}
              onClick={() => { setActiveView('assessment'); setActiveReqId(req.id); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm group ${activeView === 'assessment' && activeReqId === req.id ? 'bg-slate-800 text-blue-400' : 'hover:bg-slate-800 text-slate-400'}`}
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 font-mono text-[10px] border transition-colors ${activeView === 'assessment' && activeReqId === req.id ? 'border-blue-400 bg-blue-400/10' : 'border-slate-700 bg-slate-800 group-hover:border-slate-500'}`}>
                {req.id}
              </div>
              {isSidebarOpen && <span className="truncate text-left font-medium">{req.title}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          {isSidebarOpen && (
             <button onClick={exportAssessment} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-colors border border-slate-700">
               <Download className="w-4 h-4" /> Export Assessment
             </button>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full py-2 flex items-center justify-center text-slate-500 hover:text-white transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 h-full overflow-y-auto">
        {activeView === 'dashboard' ? (
          <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
            <header className="flex items-end justify-between">
              <div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Compliance Status</h1>
                <p className="text-slate-500 mt-2 text-lg">Overall progress of your PCI DSS v4.0.1 audit cycle.</p>
              </div>
              <div className="hidden lg:block text-right">
                <span className="block text-xs font-bold text-slate-400 uppercase">Assessment Lifecycle</span>
                <span className="text-sm font-semibold text-blue-600">Active Audit 2025</span>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm col-span-1 md:col-span-2 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Readiness</span>
                  <div className="text-6xl font-black mt-4 text-slate-900">
                    {Math.round((stats.counts['in-place'] / stats.total) * 100)}<span className="text-2xl text-slate-400">%</span>
                  </div>
                </div>
                <div className="mt-8 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>Audit Threshold</span>
                    <span>{stats.counts['in-place']} / {stats.total} Controls</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full transition-all duration-1000 ease-out" 
                      style={{ width: `${(stats.counts['in-place'] / stats.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-center">
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value" stroke="none">
                        {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Key Metrics</span>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-medium"><div className="w-2 h-2 rounded-full bg-emerald-500" /> In Place</div>
                    <span className="text-sm font-bold">{stats.counts['in-place']}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-medium"><div className="w-2 h-2 rounded-full bg-amber-500" /> Partial</div>
                    <span className="text-sm font-bold">{stats.counts['partially-in-place']}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-medium"><div className="w-2 h-2 rounded-full bg-red-500" /> Failing</div>
                    <span className="text-sm font-bold">{stats.counts['not-in-place']}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Module Completion Status</h3>
                <span className="text-xs text-slate-400 font-medium">12 Core Requirements</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Requirement</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Progress</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {PCI_REQUIREMENTS.map(req => {
                      const completed = req.subRequirements.filter(s => assessment.items[s.id]?.status === 'in-place').length;
                      return (
                        <tr key={req.id} className="group hover:bg-slate-50/50 transition-all">
                          <td className="px-8 py-5">
                            <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{req.id}. {req.title}</div>
                            <div className="text-xs text-slate-400 mt-1 line-clamp-1">{req.description}</div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 bg-slate-100 h-1.5 rounded-full min-w-[80px]">
                                <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${(completed / req.subRequirements.length) * 100}%` }} />
                              </div>
                              <span className="text-[10px] font-bold font-mono text-slate-500 whitespace-nowrap">{completed}/{req.subRequirements.length}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <button onClick={() => { setActiveView('assessment'); setActiveReqId(req.id); }} className="p-2 rounded-lg text-slate-400 hover:bg-white hover:text-blue-600 hover:shadow-sm border border-transparent hover:border-slate-200 transition-all">
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full animate-in slide-in-from-right-10 duration-500">
            {/* Assessment Workspace */}
            <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-8 border-r border-slate-200">
              <header className="flex items-start justify-between bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
                    <ShieldCheck className="w-4 h-4" /> PCI Requirement Group {activeReqId}
                  </div>
                  <h1 className="text-3xl font-black text-slate-900 leading-tight">
                    {PCI_REQUIREMENTS.find(r => r.id === activeReqId)?.title}
                  </h1>
                  <p className="text-slate-500 mt-3 leading-relaxed">
                    {PCI_REQUIREMENTS.find(r => r.id === activeReqId)?.description}
                  </p>
                </div>
              </header>

              <div className="space-y-6 pb-20">
                {PCI_REQUIREMENTS.find(r => r.id === activeReqId)?.subRequirements.map((sub) => (
                  <div key={sub.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden group">
                    <div className="p-8 space-y-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-mono font-bold text-slate-400">
                            {sub.id}
                          </div>
                          <h3 className="font-bold text-xl text-slate-900">{sub.title}</h3>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="hidden lg:block text-[10px] font-bold text-slate-400 uppercase text-right">Control Status</div>
                           <select 
                            value={assessment.items[sub.id]?.status || 'not-started'}
                            onChange={(e) => handleUpdateStatus(sub.id, e.target.value as ComplianceStatus)}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer"
                          >
                            <option value="not-started">Pending</option>
                            <option value="in-place">Compliant</option>
                            <option value="partially-in-place">Partial</option>
                            <option value="not-in-place">Failing</option>
                            <option value="not-applicable">N/A</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <div className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                            {sub.description}
                          </div>
                          <div className="space-y-3">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <CheckSquare className="w-3.5 h-3.5" /> Testing Criteria
                            </h4>
                            <ul className="space-y-2">
                              {sub.testingProcedures.map((proc, i) => (
                                <li key={i} className="flex gap-3 text-sm text-slate-600">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                  {proc}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <FileText className="w-3.5 h-3.5" /> Compliance Notes & Evidence
                            </label>
                            {assessment.items[sub.id]?.updatedAt && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                Updated {new Date(assessment.items[sub.id]?.updatedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <textarea 
                            value={assessment.items[sub.id]?.notes || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setAssessment(prev => ({
                                ...prev,
                                items: {
                                  ...prev.items,
                                  [sub.id]: { ...(prev.items[sub.id] || { requirementId: sub.id, status: 'not-started', evidence: '' }), notes: val, updatedAt: new Date().toISOString() }
                                }
                              }));
                            }}
                            placeholder="Describe implementation details, document filenames, or remediation timelines..."
                            className="w-full h-full min-h-[160px] bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Auditor Side Panel */}
            <div className="w-[380px] bg-slate-900 flex flex-col h-full shadow-2xl relative">
              <div className="p-8 border-b border-slate-800">
                <div className="flex items-center gap-3 text-blue-400 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <span className="font-black text-sm uppercase tracking-widest">AI Audit Copilot</span>
                </div>
                <h4 className="text-white font-bold">Standard Interpretation</h4>
                <p className="text-slate-500 text-xs mt-1">Get specific advice for Requirement {activeReqId}</p>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                {!aiResponse ? (
                  <div className="space-y-6 text-center py-12">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                      <HelpCircle className="w-8 h-8 text-slate-600" />
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Ask about implementation evidence, documentation templates, or specific scoping questions for this requirement.
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {['What evidence do I need?', 'How do I handle CDE?', 'Give remediation tips'].map(q => (
                        <button key={q} onClick={() => setAiQuery(q)} className="text-[10px] font-bold text-blue-400 bg-blue-400/5 hover:bg-blue-400/10 border border-blue-400/20 py-2 rounded-lg transition-all">
                          "{q}"
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="text-xs font-mono text-slate-400 leading-relaxed whitespace-pre-wrap bg-slate-800/50 p-6 rounded-2xl border border-slate-800 border-l-4 border-l-blue-500">
                      {aiResponse}
                    </div>
                    <button onClick={() => setAiResponse('')} className="text-[10px] font-bold text-slate-500 hover:text-white underline underline-offset-4">
                      Clear Assistant Output
                    </button>
                  </div>
                )}
              </div>

              <div className="p-6 bg-slate-800/50 border-t border-slate-800 space-y-4">
                <textarea 
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAskAi())}
                  placeholder="Type your question..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-xs text-slate-200 outline-none focus:border-blue-500 transition-all min-h-[100px] resize-none"
                />
                <button 
                  onClick={handleAskAi}
                  disabled={isAiLoading || !aiQuery}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 group"
                >
                  {isAiLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Consult Standard <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform" /></>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

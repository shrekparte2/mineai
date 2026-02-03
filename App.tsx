
import React, { useState } from 'react';
import { generateAddonData } from './services/geminiService';
import { GenerationState } from './types';
import RickRoll from './components/RickRoll';
import FileBrowser from './components/FileBrowser';
import JSZip from 'jszip';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    error: false,
    result: null,
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setState(prev => ({ ...prev, isGenerating: true, error: false }));
    try {
      const data = await generateAddonData(prompt);
      setState({
        isGenerating: false,
        error: false,
        result: data,
      });
    } catch (err) {
      console.error(err);
      setState({
        isGenerating: false,
        error: true,
        result: null,
      });
    }
  };

  const handleDownload = async () => {
    if (!state.result) return;
    setIsDownloading(true);

    try {
      const zip = new JSZip();
      
      // Add all generated files to the zip
      state.result.files.forEach(file => {
        zip.file(file.path, file.content);
      });

      // Generate the blob
      const content = await zip.generateAsync({ type: "blob" });
      
      // Create download link
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      // Sanitize filename
      const fileName = state.result.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      link.download = `${fileName}.mcaddon`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
      alert("Failed to bundle files. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (state.error) {
    return <RickRoll onRetry={() => setState({ isGenerating: false, error: false, result: null })} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-200">
      {/* Dynamic Background Ornament */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/20 blur-[120px] rounded-full"></div>
      </div>

      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/40 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-cube text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white">
                MINE<span className="text-blue-500">AI</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] -mt-1">Architect v2.0</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex px-3 py-1 bg-slate-800 rounded-full text-[10px] font-bold text-slate-400 border border-slate-700">
              BEDROCK EDITION READY
            </span>
            <button className="text-slate-400 hover:text-white transition-colors">
              <i className="fa-solid fa-circle-question text-xl"></i>
            </button>
          </div>
        </div>
      </header>

      <main className="relative flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 space-y-12">
        {/* Input Hero */}
        <section className="text-center py-12 space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight">
              Imagine it.<br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">We'll craft the code.</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
              The world's first AI dedicated to generating professional Minecraft Addons. Instant behavior packs, resource packs, and 4K renders.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
            <div className="relative flex flex-col md:flex-row gap-3 bg-slate-900/90 p-3 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-sm">
              <div className="flex-1 flex items-center px-4 bg-slate-950/50 rounded-xl border border-slate-800 focus-within:border-blue-500/50 transition-colors">
                <i className="fa-solid fa-sparkles text-blue-500/50 mr-3"></i>
                <input 
                  type="text" 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  placeholder="A giant rideable mechanical spider with laser eyes..."
                  className="w-full bg-transparent border-none outline-none py-4 text-white placeholder-slate-600 font-medium"
                />
              </div>
              <button 
                onClick={handleGenerate}
                disabled={state.isGenerating || !prompt.trim()}
                className="px-10 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-black rounded-xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-50"
              >
                {state.isGenerating ? (
                  <i className="fa-solid fa-spinner fa-spin text-xl"></i>
                ) : (
                  <>
                    <span>CRAFT PACK</span>
                    <i className="fa-solid fa-hammer"></i>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Results */}
        {state.result && (
          <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Preview & Identity */}
              <div className="lg:col-span-3 space-y-6">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-white/5 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                    <img 
                      src={state.result.imageUrl} 
                      className="w-full aspect-video object-cover" 
                      alt="AI Render" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between gap-6">
                      <div className="space-y-2">
                        <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-md uppercase tracking-widest">Generated Pack</span>
                        <h3 className="text-3xl font-black text-white drop-shadow-lg">{state.result.name}</h3>
                        <p className="text-slate-300 text-sm line-clamp-2 max-w-xl font-medium opacity-90">{state.result.description}</p>
                      </div>
                      <button 
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="h-16 px-8 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl flex items-center gap-3 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
                      >
                        {isDownloading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-download text-xl"></i>}
                        <span className="hidden sm:inline">GET .MCADDON</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis Sidebar */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl space-y-6">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Architecture Analysis</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                        <i className="fa-solid fa-folder-tree"></i>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-white">Folder Structure</div>
                        <div className="text-xs text-slate-500">Dual-pack architecture detected</div>
                      </div>
                      <div className="text-xs font-bold text-blue-400">OPTIMIZED</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                        <i className="fa-solid fa-fingerprint"></i>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-white">Unique UUIDs</div>
                        <div className="text-xs text-slate-500">Manifest identities generated</div>
                      </div>
                      <div className="text-xs font-bold text-emerald-400">VALIDATED</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/20">
                        <i className="fa-solid fa-microchip"></i>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-white">AI Controllers</div>
                        <div className="text-xs text-slate-500">Custom behavior logic injected</div>
                      </div>
                      <div className="text-xs font-bold text-purple-400">READY</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-3xl shadow-xl shadow-blue-600/10 relative overflow-hidden">
                  <i className="fa-solid fa-shield-halved absolute -right-4 -bottom-4 text-8xl text-white/10 rotate-12"></i>
                  <h4 className="text-white font-black text-lg mb-2">Import Guide</h4>
                  <p className="text-blue-100 text-xs leading-relaxed opacity-80">
                    Your .mcaddon file contains both behavior and resource packs. Simply double-click it once downloaded, and Minecraft will handle the rest.
                  </p>
                </div>
              </div>
            </div>

            {/* Code Explorer */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-white flex items-center gap-3">
                  <i className="fa-solid fa-code text-blue-500"></i> Code Explorer
                </h3>
                <span className="text-xs font-bold text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                  {state.result.files.length} Files Generated
                </span>
              </div>
              <FileBrowser files={state.result.files} />
            </div>
          </div>
        )}

        {/* Features Placeholder */}
        {!state.result && !state.isGenerating && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-80">
            {[
              { icon: 'fa-brain-circuit', title: 'Semantic Generation', text: 'Gemini 3 Flash interprets your ideas into production-ready JSON schemas.' },
              { icon: 'fa-wand-magic-sparkles', title: 'Visual Renders', text: 'Gemini 2.5 Image creates hyper-realistic previews of your mod in action.' },
              { icon: 'fa-box-archive', title: 'Full Bundling', text: 'Instantly packs BP and RP into a single .mcaddon for one-click installation.' }
            ].map((f, i) => (
              <div key={i} className="bg-slate-900/30 p-8 rounded-3xl border border-slate-800/50 hover:bg-slate-900/50 hover:border-slate-700 transition-all group">
                <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 transition-all">
                  <i className={`fa-solid ${f.icon} text-blue-400 group-hover:text-white text-xl`}></i>
                </div>
                <h4 className="text-white font-black text-lg mb-3 tracking-tight">{f.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{f.text}</p>
              </div>
            ))}
          </section>
        )}

        {/* Loading Modal */}
        {state.isGenerating && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md">
            <div className="relative">
              <div className="w-32 h-32 border-4 border-blue-500/20 rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-blue-600 rounded-2xl animate-float flex items-center justify-center shadow-2xl shadow-blue-500/50">
                  <i className="fa-solid fa-hammer text-white text-3xl"></i>
                </div>
              </div>
            </div>
            <div className="mt-12 text-center space-y-3">
              <h3 className="text-3xl font-black text-white">Crafting Addon...</h3>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Consulting the AI Architect</p>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950/50 p-12 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 opacity-50">
              <div className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center">
                <i className="fa-solid fa-cubes text-[10px] text-blue-400"></i>
              </div>
              <span className="text-[10px] font-black tracking-widest uppercase">MINEAI ARCHITECT LAB</span>
            </div>
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">Part of the Gemini Developers Ecosystem</p>
          </div>
          <div className="flex gap-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <a href="#" className="hover:text-blue-500 transition-colors">Documentation</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Github</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

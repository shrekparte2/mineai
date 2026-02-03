
import React, { useState } from 'react';
import { AddonFile } from '../types';

interface FileBrowserProps {
  files: AddonFile[];
}

const FileBrowser: React.FC<FileBrowserProps> = ({ files }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[500px] bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
      <div className="col-span-1 border-r border-slate-800 overflow-y-auto custom-scrollbar p-2">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Project Files</h3>
        {files.map((file, idx) => (
          <button
            key={file.path}
            onClick={() => setSelectedIndex(idx)}
            className={`w-full text-left p-3 rounded-lg text-sm mb-1 transition-all flex items-center gap-3 ${
              selectedIndex === idx 
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                : 'text-slate-400 hover:bg-slate-800 border border-transparent'
            }`}
          >
            <i className={`fa-solid ${file.path.endsWith('.json') ? 'fa-file-code' : 'fa-file'} text-lg`}></i>
            <span className="truncate font-mono">{file.path}</span>
          </button>
        ))}
      </div>
      <div className="col-span-2 overflow-hidden flex flex-col">
        <div className="bg-slate-950 p-2 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-500">{files[selectedIndex]?.path}</span>
          <button 
            onClick={() => navigator.clipboard.writeText(files[selectedIndex].content)}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800 px-2 py-1 rounded"
          >
            <i className="fa-regular fa-copy"></i> Copy
          </button>
        </div>
        <pre className="flex-1 p-4 overflow-auto custom-scrollbar font-mono text-sm text-green-400 bg-slate-950 leading-relaxed">
          <code>{files[selectedIndex]?.content}</code>
        </pre>
      </div>
    </div>
  );
};

export default FileBrowser;

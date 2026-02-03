
import React from 'react';

const RickRoll: React.FC<{ onRetry: () => void }> = ({ onRetry }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black p-4 text-center">
      <div className="max-w-4xl w-full aspect-video mb-8 border-4 border-red-600 rounded-xl overflow-hidden shadow-2xl shadow-red-500/20">
        <iframe 
          className="w-full h-full"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
          title="Oops! Error occurred." 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
      </div>
      <h2 className="text-3xl font-bold mb-4 text-red-500">CRITICAL SYSTEM FAILURE</h2>
      <p className="text-gray-400 mb-8 max-w-md">
        An error occurred while communicating with the AI. You've been temporarily relocated to a safe zone.
      </p>
      <button 
        onClick={onRetry}
        className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 active:scale-95"
      >
        Try Again
      </button>
    </div>
  );
};

export default RickRoll;

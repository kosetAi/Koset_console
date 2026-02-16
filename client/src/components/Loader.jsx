import React from "react";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-[1000] bg-[#09090B] flex flex-col items-center justify-center overflow-hidden">
      {/* 1. LAYERED AMBIENT GLOW */}
      <div className="absolute w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute w-[200px] h-[200px] bg-indigo-500/5 rounded-full blur-[80px] -translate-x-20 translate-y-20" />

      <div className="relative flex flex-col items-center">
        
        {/* 2. THE KINETIC GEOMETRIC LOGO */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          
          {/* Outer Rotating Hexagon Frame */}
          <svg className="absolute w-full h-full animate-spin-slow opacity-20" viewBox="0 0 100 100">
            <path 
              d="M50 5 L90 27.5 L90 72.5 L50 95 L10 L72.5 L10 27.5 Z" 
              fill="none" 
              stroke="#8b5cf6" 
              strokeWidth="1"
            />
          </svg>

          {/* Middle Pulsing Hexagon */}
          <svg className="absolute w-20 h-20 animate-reverse-spin opacity-40" viewBox="0 0 100 100">
            <path 
              d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" 
              fill="none" 
              stroke="#8b5cf6" 
              strokeWidth="2"
              strokeDasharray="10 5"
            />
          </svg>

          {/* Central 3D Cube Icon */}
          <div className="relative w-12 h-12">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-full h-full text-violet-500 drop-shadow-[0_0_20px_rgba(139,92,246,0.8)]"
            >
              <path
                d="M12 2L21 7V17L12 22L3 17V7L12 2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-cube-morph"
              />
              <path
                d="M12 22V12M12 12L21 7M12 12L3 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-draw-path"
              />
            </svg>
            
            {/* Internal Core Glow Point */}
            <div className="absolute inset-0 m-auto w-2 h-2 bg-white rounded-full blur-[2px] animate-ping" />
          </div>
        </div>

        {/* 3. BRANDING & PROGRESS TEXT */}
        <div className="mt-12 text-center">
          <div className="relative">
            <h2 className="text-3xl font-black text-white tracking-[0.3em] uppercase italic italic-glitch">
              Koset<span className="text-violet-500">.</span>
            </h2>
            {/* Subtle reflection under text */}
            <h2 className="text-3xl font-black text-violet-500/10 tracking-[0.3em] uppercase italic absolute top-1 scale-y-[-1] blur-[2px] select-none">
              Koset
            </h2>
          </div>
          
          <div className="mt-8 flex flex-col items-center">
            {/* Tech Loading Bar */}
            <div className="w-48 h-[1px] bg-white/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-500 to-transparent w-full animate-scanner" />
            </div>
            
            <div className="flex items-center gap-3 mt-4">
               <span className="w-1 h-1 bg-violet-500 rounded-full animate-flicker" />
               <p className="text-[10px] text-gray-400 font-mono tracking-[0.5em] uppercase animate-pulse">
                 Establishing_Secure_Link
               </p>
               <span className="w-1 h-1 bg-violet-500 rounded-full animate-flicker" style={{animationDelay: '0.5s'}} />
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes scanner {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes cube-morph {
          0%, 100% { stroke-width: 1.5; transform: scale(1); }
          50% { stroke-width: 2.5; transform: scale(1.1); filter: brightness(1.3); }
        }
        @keyframes draw-path {
          0% { stroke-dasharray: 0 50; opacity: 0.5; }
          50% { stroke-dasharray: 50 0; opacity: 1; }
          100% { stroke-dasharray: 0 50; opacity: 0.5; }
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        .animate-reverse-spin {
          animation: reverse-spin 8s linear infinite;
        }
        .animate-scanner {
          animation: scanner 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .animate-cube-morph {
          animation: cube-morph 3s ease-in-out infinite;
        }
        .animate-draw-path {
          animation: draw-path 4s ease-in-out infinite;
        }
        .animate-flicker {
          animation: flicker 1s infinite;
        }
        .italic-glitch {
           text-shadow: 0.05em 0 0 rgba(255,0,0,.75),
                        -0.025em -0.05em 0 rgba(0,255,0,.75),
                        0.025em 0.05em 0 rgba(0,0,255,.75);
           animation: glitch 500ms infinite;
        }
        @keyframes glitch {
          0% { text-shadow: 1px 0 0 violet, -1px 0 0 cyan; }
          25% { text-shadow: -1px 0 0 violet, 1px 0 0 cyan; }
          50% { text-shadow: 1px 1px 0 violet, -1px -1px 0 cyan; }
          75% { text-shadow: -1px -1px 0 violet, 1px 1px 0 cyan; }
          100% { text-shadow: 1px 0 0 violet, -1px 0 0 cyan; }
        }
      `}} />
    </div>
  );
}
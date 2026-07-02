import React, { useState, useEffect } from 'react';
import { Leaf, Shield, Cpu, ChevronRight, Activity, Zap, Globe } from 'lucide-react';

interface WelcomePortalProps {
  onEnter: () => void;
}

export const WelcomePortal: React.FC<WelcomePortalProps> = ({ onEnter }) => {
  const [isEntering, setIsEntering] = useState(false);
  const [carbonSaved, setCarbonSaved] = useState(0);
  const [nodes, setNodes] = useState(49);

  // Animate counters on load
  useEffect(() => {
    const timer = setInterval(() => {
      setCarbonSaved(prev => (prev < 128 ? prev + 3 : 128));
    }, 40);
    const timer2 = setInterval(() => {
      setNodes(prev => (prev < 49 ? prev + 1 : 49));
    }, 60);
    return () => { clearInterval(timer); clearInterval(timer2); };
  }, []);

  const handleStart = () => {
    setIsEntering(true);
    setTimeout(() => onEnter(), 900);
  };

  return (
    <div
      className={`relative min-h-screen flex flex-col overflow-hidden text-white transition-all duration-1000 ${isEntering ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'}`}
      style={{ background: 'linear-gradient(135deg, #0a0014 0%, #0d0028 40%, #060020 70%, #0a0014 100%)' }}
    >

      {/* Custom Animations and Keyframes */}
      <style>{`
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes pulse-glow-vivid {
          0%, 100% { opacity: 0.18; filter: blur(40px); transform: scale(1); }
          50% { opacity: 0.38; filter: blur(55px); transform: scale(1.1); }
        }
        @keyframes pulse-slow-button {
          0%, 100% { transform: scale(1); box-shadow: 0 0 40px rgba(139,92,246,0.5), 0 0 80px rgba(6,182,212,0.2); }
          50% { transform: scale(1.02); box-shadow: 0 0 55px rgba(139,92,246,0.65), 0 0 95px rgba(6,182,212,0.3); }
        }
        .animate-float {
          animation: float-gentle 6s ease-in-out infinite;
        }
        .animate-glow-pulse {
          animation: pulse-glow-vivid 8s ease-in-out infinite;
        }
        .animate-pulse-button {
          animation: pulse-slow-button 4s ease-in-out infinite;
        }
      `}</style>

      {/* ── Vivid Background Blobs ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Main violet blob */}
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        {/* Cyan right blob */}
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        {/* Hot amber bottom blob */}
        <div className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.15) 0%, transparent 70%)', filter: 'blur(70px)' }} />
        {/* Pink accent blob */}
        <div className="absolute top-[55%] left-[5%] w-[300px] h-[300px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />

        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(to right, #a78bfa 1px, transparent 1px), linear-gradient(to bottom, #a78bfa 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Animated scan line */}
        <div className="absolute left-0 right-0 h-px animate-scan-line"
          style={{ background: 'linear-gradient(to right, transparent, rgba(139,92,246,0.6), rgba(6,182,212,0.6), transparent)' }} />
      </div>

      {/* ── Header ── */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #0891b2)', boxShadow: '0 0 24px rgba(139,92,246,0.5)' }}>
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tight"
              style={{ background: 'linear-gradient(to right, #c4b5fd, #67e8f9, #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              VerdeKube AI
            </span>
            <div className="text-[9px] font-bold uppercase tracking-[0.2em] mt-0.5"
              style={{ color: '#a78bfa' }}>
              Eco-Centric Cluster Orchestration
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold"
          style={{ background: 'rgba(139,92,246,0.1)', borderColor: 'rgba(139,92,246,0.3)', color: '#c4b5fd', boxShadow: '0 0 16px rgba(139,92,246,0.2)' }}>
          <span className="w-2 h-2 rounded-full animate-ping" style={{ background: '#a78bfa' }} />
          ⚡ AI Optimizing {nodes} Pods
        </div>
      </header>

      {/* ── Hero ── */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1 py-10">

        {/* Left Column */}
        <div className="lg:col-span-6 space-y-8">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(8,145,178,0.2))', borderColor: 'rgba(139,92,246,0.4)', color: '#c4b5fd', boxShadow: '0 0 20px rgba(139,92,246,0.15)' }}>
            <Zap className="w-3.5 h-3.5 animate-pulse" style={{ color: '#fb923c' }} />
            Machine Learning · Auto-Pilot Carbon Reduction
          </div>

          {/* Headline */}
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              <span className="text-white">Reduce Carbon</span><br />
              <span style={{ background: 'linear-gradient(90deg, #a78bfa 0%, #67e8f9 50%, #fb923c 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Footprints
              </span>
              <br />
              <span className="text-white">in Real-Time</span>
            </h1>
          </div>

          <p className="text-base leading-relaxed max-w-lg" style={{ color: '#cbd5e1' }}>
            VerdeKube AI uses machine learning to detect idle cloud workloads in real-time. It automatically throttles resource usage to stop energy waste and cut greenhouse emissions.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              onClick={handleStart}
              className="group relative inline-flex items-center justify-center gap-3 font-extrabold text-sm rounded-2xl px-9 py-4 transition-all duration-300 overflow-hidden animate-pulse-button"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #0891b2 60%, #f97316 100%)',
                color: 'white',
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 65px rgba(139,92,246,0.85), 0 0 110px rgba(6,182,212,0.45)')}
            >
              {/* Shimmer overlay */}
              <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }} />
              Enter Governance Control Center
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>

          {/* Live Metric Counters (Glowing Card Layout) */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t" style={{ borderColor: 'rgba(139,92,246,0.15)' }}>
            
            {/* Card 1: CO2 Saved */}
            <div className="flex flex-col p-4 rounded-2xl border text-center transition-all hover:scale-105 duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(139,92,246,0.02))',
                borderColor: 'rgba(139,92,246,0.25)',
                boxShadow: '0 4px 20px rgba(139,92,246,0.08), inset 0 0 12px rgba(139,92,246,0.05)'
              }}>
              <div className="flex justify-center mb-1 text-violet-400">
                <Leaf className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-2xl font-black font-mono" style={{ color: '#c4b5fd' }}>{carbonSaved}g</div>
              <div className="text-[9px] font-extrabold uppercase tracking-wider mt-1 text-slate-400">CO₂ Saved</div>
            </div>

            {/* Card 2: Autopilot */}
            <div className="flex flex-col p-4 rounded-2xl border text-center transition-all hover:scale-105 duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(6,182,212,0.06), rgba(6,182,212,0.02))',
                borderColor: 'rgba(6,182,212,0.25)',
                boxShadow: '0 4px 20px rgba(6,182,212,0.08), inset 0 0 12px rgba(6,182,212,0.05)'
              }}>
              <div className="flex justify-center mb-1 text-cyan-400">
                <Zap className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black font-mono" style={{ color: '#67e8f9' }}>100%</div>
              <div className="text-[9px] font-extrabold uppercase tracking-wider mt-1 text-slate-400">Autopilot</div>
            </div>

            {/* Card 3: Scan Interval */}
            <div className="flex flex-col p-4 rounded-2xl border text-center transition-all hover:scale-105 duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(251,146,60,0.06), rgba(251,146,60,0.02))',
                borderColor: 'rgba(251,146,60,0.25)',
                boxShadow: '0 4px 20px rgba(251,146,60,0.08), inset 0 0 12px rgba(251,146,60,0.05)'
              }}>
              <div className="flex justify-center mb-1 text-orange-400">
                <Activity className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black font-mono" style={{ color: '#fb923c' }}>5 sec</div>
              <div className="text-[9px] font-extrabold uppercase tracking-wider mt-1 text-slate-400">Scan Interval</div>
            </div>

          </div>
        </div>

        {/* Right Column: 3D Cube with Network Lines and AI Nodes */}
        <div className="lg:col-span-6 flex justify-center items-center py-8">
          <div className="relative w-[480px] h-[480px] flex items-center justify-center animate-float" style={{ perspective: '1200px' }}>

            {/* ── Animated Network Lines (SVG) ── */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-60" viewBox="0 0 480 480">
              {/* Pulsing connections between nodes and the cube */}
              <line x1="80" y1="120" x2="240" y2="240" stroke="rgba(139,92,246,0.3)" strokeWidth="1.5" strokeDasharray="5,5" className="animate-pulse" />
              <line x1="400" y1="100" x2="240" y2="240" stroke="rgba(6,182,212,0.3)" strokeWidth="1.5" strokeDasharray="5,5" className="animate-pulse" />
              <line x1="380" y1="360" x2="240" y2="240" stroke="rgba(251,146,60,0.3)" strokeWidth="1.5" strokeDasharray="5,5" className="animate-pulse" />
              <line x1="100" y1="380" x2="240" y2="240" stroke="rgba(236,72,153,0.3)" strokeWidth="1.5" strokeDasharray="5,5" className="animate-pulse" />
              
              {/* Circuit paths with moving dash animation */}
              <path d="M 80 120 C 150 80, 330 60, 400 100" fill="none" stroke="rgba(6,182,212,0.25)" strokeWidth="1.5" strokeDasharray="8,8" className="animate-dash" style={{ strokeDashoffset: 100, animation: 'dash 15s linear infinite' }} />
              <path d="M 100 380 C 150 420, 320 430, 380 360" fill="none" stroke="rgba(139,92,246,0.25)" strokeWidth="1.5" strokeDasharray="8,8" className="animate-dash" style={{ strokeDashoffset: 100, animation: 'dash 15s linear infinite' }} />
            </svg>

            {/* Soft Blue Glow and Outer Rim Light behind the cube */}
            <div className="absolute w-[300px] h-[300px] rounded-full animate-glow-pulse"
              style={{
                background: 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, rgba(139,92,246,0.15) 50%, transparent 75%)',
                boxShadow: '0 0 80px rgba(6,182,212,0.35), 0 0 140px rgba(139,92,246,0.2)',
                mixBlendMode: 'screen',
              }} />

            {/* Orbit Ring 1 — violet */}
            <div className="absolute w-[360px] h-[360px] rounded-full border animate-spin"
              style={{ borderColor: 'rgba(139,92,246,0.2)', transform: 'rotateX(75deg) rotateY(15deg)', animationDuration: '14s' }} />

            {/* Orbit Ring 2 — cyan */}
            <div className="absolute w-[320px] h-[320px] rounded-full border animate-spin"
              style={{ borderColor: 'rgba(6,182,212,0.18)', transform: 'rotateX(60deg) rotateY(-30deg)', animationDuration: '9s', animationDirection: 'reverse' }} />

            {/* ── Floating AI Nodes with Hierarchy ── */}
            
            {/* Node 1: CO2 Saved (MOST IMPORTANT - 20% LARGER + GLOW) */}
            <div className="absolute z-20 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border text-[11px] font-black font-mono animate-bounce"
              style={{
                bottom: '95px', right: '15px',
                background: 'linear-gradient(135deg, rgba(35, 12, 5, 0.95), rgba(20, 5, 2, 0.95))',
                borderColor: 'rgba(251, 146, 60, 0.8)',
                boxShadow: '0 0 25px rgba(251, 146, 60, 0.6), inset 0 0 10px rgba(251, 146, 60, 0.2)',
                animationDuration: '4.5s',
                animationDelay: '0.5s'
              }}>
              <Leaf className="w-4 h-4 text-orange-400 animate-pulse" />
              <div className="flex flex-col items-start leading-none">
                <span className="text-[8px] text-orange-300 font-bold uppercase tracking-wider">KPI GOAL</span>
                <span className="text-white mt-0.5">CO2_SAVED: +128g</span>
              </div>
            </div>

            {/* Node 2: AI Anomaly */}
            <div className="absolute z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-bold font-mono animate-bounce"
              style={{
                top: '90px', left: '30px',
                background: 'rgba(15, 5, 30, 0.85)',
                borderColor: 'rgba(139, 92, 246, 0.6)',
                boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)',
                animationDuration: '3.5s'
              }}>
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping" />
              ML_ANOMALY: ACTIVE
            </div>

            {/* Node 3: Eco Governor */}
            <div className="absolute z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-bold font-mono animate-bounce"
              style={{
                top: '70px', right: '20px',
                background: 'rgba(5, 15, 30, 0.85)',
                borderColor: 'rgba(6, 182, 212, 0.6)',
                boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)',
                animationDuration: '4s',
                animationDelay: '1s'
              }}>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              GOVERNOR: ECO
            </div>

            {/* Node 4: Node Health (LEAST IMPORTANT - SUBTLE) */}
            <div className="absolute z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-semibold font-mono opacity-50 hover:opacity-100 transition-opacity duration-300"
              style={{
                bottom: '60px', left: '40px',
                background: 'rgba(5, 15, 8, 0.6)',
                borderColor: 'rgba(52, 211, 153, 0.3)',
              }}>
              <Zap className="w-2.5 h-2.5 text-emerald-500" />
              HEALTH: 100%
            </div>

            {/* Orbiting particles */}
            <div className="absolute w-3.5 h-3.5 rounded-full animate-ping top-16 right-28"
              style={{ background: '#a78bfa', boxShadow: '0 0 12px #a78bfa' }} />
            <div className="absolute w-2 h-2 rounded-full animate-ping bottom-20 left-20"
              style={{ background: '#67e8f9', boxShadow: '0 0 8px #67e8f9', animationDelay: '0.5s' }} />
            <div className="absolute w-2.5 h-2.5 rounded-full animate-ping top-28 left-24"
              style={{ background: '#fb923c', boxShadow: '0 0 8px #fb923c', animationDelay: '1.2s' }} />

            {/* 3D Cube (Enlarged + Brightened 15% with Custom Box Shadow) */}
            <div className="relative w-56 h-56 animate-rotator cursor-pointer filter brightness-110"
              style={{ transformStyle: 'preserve-3d' }}>

              {/* FRONT */}
              <div className="absolute inset-0 rounded-2xl flex flex-col justify-between p-5 border"
                style={{
                  transform: 'translateZ(112px)',
                  background: 'linear-gradient(135deg, rgba(15,5,40,0.95), rgba(30,10,60,0.9))',
                  borderColor: 'rgba(139,92,246,0.6)',
                  boxShadow: 'inset 0 0 35px rgba(139,92,246,0.2), 0 0 25px rgba(139,92,246,0.25)',
                }}>
                <div className="flex justify-between items-center">
                  <Cpu className="w-7 h-7 animate-pulse" style={{ color: '#a78bfa' }} />
                  <span className="text-[9px] px-2.5 py-0.5 rounded font-mono font-bold border"
                    style={{ color: '#c4b5fd', background: 'rgba(139,92,246,0.15)', borderColor: 'rgba(139,92,246,0.3)' }}>CORE-01</span>
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: 'rgba(139,92,246,0.15)' }}>
                    <div className="h-full rounded-full animate-pulse" style={{ width: '75%', background: 'linear-gradient(to right, #7c3aed, #67e8f9)' }} />
                  </div>
                  <div className="flex justify-between text-[9px] font-mono" style={{ color: '#64748b' }}>
                    <span>CPU LOAD</span><span style={{ color: '#a78bfa' }}>75%</span>
                  </div>
                </div>
              </div>

              {/* BACK */}
              <div className="absolute inset-0 rounded-2xl flex flex-col justify-between p-5 border"
                style={{
                  transform: 'rotateY(180deg) translateZ(112px)',
                  background: 'linear-gradient(135deg, rgba(5,15,30,0.95), rgba(5,25,45,0.9))',
                  borderColor: 'rgba(6,182,212,0.5)',
                  boxShadow: 'inset 0 0 35px rgba(6,182,212,0.15)',
                }}>
                <div className="flex justify-between items-center">
                  <Shield className="w-7 h-7" style={{ color: '#67e8f9' }} />
                  <span className="text-[9px] px-2.5 py-0.5 rounded font-mono font-bold border"
                    style={{ color: '#67e8f9', background: 'rgba(6,182,212,0.1)', borderColor: 'rgba(6,182,212,0.3)' }}>ML-DECT</span>
                </div>
                <div className="text-[11px] font-semibold leading-relaxed" style={{ color: '#94a3b8' }}>
                  Isolation Forest:<br />
                  <span style={{ color: '#34d399' }} className="font-bold">✓ NORMAL</span>
                </div>
              </div>

              {/* RIGHT */}
              <div className="absolute inset-0 rounded-2xl flex flex-col justify-center items-center p-5 border"
                style={{
                  transform: 'rotateY(90deg) translateZ(112px)',
                  background: 'linear-gradient(135deg, rgba(10,5,30,0.95), rgba(20,10,50,0.9))',
                  borderColor: 'rgba(251,146,60,0.4)',
                  boxShadow: 'inset 0 0 30px rgba(251,146,60,0.1)',
                }}>
                <Globe className="w-11 h-11 mb-2 animate-spin" style={{ color: '#fb923c', animationDuration: '10s' }} />
                <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#fb923c' }}>ECO ACTIVE</div>
              </div>

              {/* LEFT */}
              <div className="absolute inset-0 rounded-2xl flex flex-col justify-between p-5 border"
                style={{
                  transform: 'rotateY(-90deg) translateZ(112px)',
                  background: 'rgba(5,5,20,0.95)',
                  borderColor: 'rgba(236,72,153,0.35)',
                }}>
                <div className="text-[9px] font-mono" style={{ color: '#64748b' }}>METRICS OUTPUT</div>
                <div>
                  <div className="text-xl font-black font-mono" style={{ color: '#f472b6' }}>36.5 g/h</div>
                  <div className="text-[9px] font-bold uppercase tracking-wider mt-0.5" style={{ color: '#64748b' }}>Active Emission</div>
                </div>
              </div>

              {/* TOP */}
              <div className="absolute inset-0 rounded-2xl flex items-center justify-center border"
                style={{
                  transform: 'rotateX(90deg) translateZ(112px)',
                  background: 'rgba(10,5,30,0.9)',
                  borderColor: 'rgba(139,92,246,0.3)',
                }}>
                <div className="w-14 h-14 rounded-full border flex items-center justify-center"
                  style={{ borderColor: 'rgba(139,92,246,0.4)' }}>
                  <div className="w-6 h-6 rounded-full animate-ping" style={{ background: 'rgba(139,92,246,0.5)' }} />
                </div>
              </div>

              {/* BOTTOM */}
              <div className="absolute inset-0 rounded-2xl border"
                style={{
                  transform: 'rotateX(-90deg) translateZ(112px)',
                  background: 'rgba(5,2,15,0.95)',
                  borderColor: 'rgba(139,92,246,0.2)',
                }} />
            </div>
          </div>
        </div>
      </main>

      {/* ── Feature Pills ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Activity className="w-4 h-4" />, label: 'Real-time Monitoring', color: '#a78bfa' },
            { icon: <Zap className="w-4 h-4" />, label: 'Auto CPU Throttling', color: '#67e8f9' },
            { icon: <Leaf className="w-4 h-4" />, label: 'Carbon Offset Tracking', color: '#34d399' },
            { icon: <Shield className="w-4 h-4" />, label: 'ML Anomaly Detection', color: '#fb923c' },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl border"
              style={{
                background: 'rgba(139,92,246,0.05)',
                borderColor: `${f.color}30`,
                boxShadow: `0 0 20px ${f.color}10`,
              }}>
              <span style={{ color: f.color }}>{f.icon}</span>
              <span className="text-xs font-semibold" style={{ color: '#cbd5e1' }}>{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-8 py-5 border-t flex justify-between items-center text-xs"
        style={{ borderColor: 'rgba(139,92,246,0.1)', color: '#475569' }}>
        <span>&copy; 2026 VerdeKube AI — Built for energy-efficient cluster orchestration.</span>
        <div className="flex gap-6">
          <a href="#github" className="transition hover:text-violet-400">Source Code</a>
          <a href="#documentation" className="transition hover:text-cyan-400">ML Methodology</a>
        </div>
      </footer>

    </div>
  );
};

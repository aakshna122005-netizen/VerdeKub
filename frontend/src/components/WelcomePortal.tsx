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
          Active Nodes: {nodes}
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

          <p className="text-base leading-relaxed max-w-lg" style={{ color: '#94a3b8' }}>
            VerdeKube AI uses a local Isolation Forest ML model to continuously detect idle workloads and automatically throttle containers — saving physical energy and cutting greenhouse emissions.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              onClick={handleStart}
              className="group relative inline-flex items-center justify-center gap-3 font-extrabold text-sm rounded-2xl px-9 py-4 transition-all duration-300 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #0891b2 60%, #f97316 100%)',
                boxShadow: '0 0 40px rgba(139,92,246,0.5), 0 0 80px rgba(6,182,212,0.2)',
                color: 'white',
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 60px rgba(139,92,246,0.7), 0 0 100px rgba(6,182,212,0.3)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 40px rgba(139,92,246,0.5), 0 0 80px rgba(6,182,212,0.2)')}
            >
              {/* Shimmer overlay */}
              <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }} />
              Enter Governance Control Center
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Live Metric Counters */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t" style={{ borderColor: 'rgba(139,92,246,0.15)' }}>
            <div>
              <div className="text-3xl font-black font-mono" style={{ color: '#a78bfa' }}>{carbonSaved}g</div>
              <div className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: '#64748b' }}>CO₂ Saved</div>
            </div>
            <div>
              <div className="text-3xl font-black font-mono" style={{ color: '#67e8f9' }}>100%</div>
              <div className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: '#64748b' }}>Auto-Pilot</div>
            </div>
            <div>
              <div className="text-3xl font-black font-mono" style={{ color: '#fb923c' }}>5s</div>
              <div className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: '#64748b' }}>Scan Interval</div>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Cube */}
        <div className="lg:col-span-6 flex justify-center items-center py-8">
          <div className="relative w-96 h-96 flex items-center justify-center" style={{ perspective: '1000px' }}>

            {/* Outer glow */}
            <div className="absolute w-72 h-72 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', filter: 'blur(30px)' }} />

            {/* Orbit Ring 1 — violet */}
            <div className="absolute w-80 h-80 rounded-full border animate-spin"
              style={{ borderColor: 'rgba(139,92,246,0.25)', transform: 'rotateX(75deg) rotateY(15deg)', animationDuration: '12s' }} />

            {/* Orbit Ring 2 — cyan */}
            <div className="absolute w-72 h-72 rounded-full border animate-spin"
              style={{ borderColor: 'rgba(6,182,212,0.2)', transform: 'rotateX(60deg) rotateY(-30deg)', animationDuration: '8s', animationDirection: 'reverse' }} />

            {/* Orbit Ring 3 — orange */}
            <div className="absolute w-64 h-64 rounded-full border animate-spin"
              style={{ borderColor: 'rgba(251,146,60,0.15)', transform: 'rotateX(45deg) rotateY(45deg)', animationDuration: '16s' }} />

            {/* Orbiting ping dots */}
            <div className="absolute w-3 h-3 rounded-full animate-ping top-8 right-16"
              style={{ background: '#a78bfa', boxShadow: '0 0 12px #a78bfa' }} />
            <div className="absolute w-2 h-2 rounded-full animate-ping bottom-12 left-10"
              style={{ background: '#67e8f9', boxShadow: '0 0 8px #67e8f9', animationDelay: '0.5s' }} />
            <div className="absolute w-2 h-2 rounded-full animate-ping top-20 left-16"
              style={{ background: '#fb923c', boxShadow: '0 0 8px #fb923c', animationDelay: '1s' }} />

            {/* 3D Cube */}
            <div className="relative w-44 h-44 animate-rotator cursor-pointer"
              style={{ transformStyle: 'preserve-3d' }}>

              {/* FRONT */}
              <div className="absolute inset-0 rounded-2xl flex flex-col justify-between p-4 border"
                style={{
                  transform: 'translateZ(88px)',
                  background: 'linear-gradient(135deg, rgba(15,5,40,0.95), rgba(30,10,60,0.9))',
                  borderColor: 'rgba(139,92,246,0.6)',
                  boxShadow: 'inset 0 0 30px rgba(139,92,246,0.15), 0 0 20px rgba(139,92,246,0.2)',
                }}>
                <div className="flex justify-between items-center">
                  <Cpu className="w-6 h-6 animate-pulse" style={{ color: '#a78bfa' }} />
                  <span className="text-[8px] px-2 py-0.5 rounded font-mono font-bold border"
                    style={{ color: '#c4b5fd', background: 'rgba(139,92,246,0.15)', borderColor: 'rgba(139,92,246,0.3)' }}>CORE-01</span>
                </div>
                <div className="space-y-1">
                  <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(139,92,246,0.15)' }}>
                    <div className="h-full rounded-full animate-pulse" style={{ width: '75%', background: 'linear-gradient(to right, #7c3aed, #67e8f9)' }} />
                  </div>
                  <div className="flex justify-between text-[8px] font-mono" style={{ color: '#64748b' }}>
                    <span>CPU LOAD</span><span style={{ color: '#a78bfa' }}>75%</span>
                  </div>
                </div>
              </div>

              {/* BACK */}
              <div className="absolute inset-0 rounded-2xl flex flex-col justify-between p-4 border"
                style={{
                  transform: 'rotateY(180deg) translateZ(88px)',
                  background: 'linear-gradient(135deg, rgba(5,15,30,0.95), rgba(5,25,45,0.9))',
                  borderColor: 'rgba(6,182,212,0.5)',
                  boxShadow: 'inset 0 0 30px rgba(6,182,212,0.1)',
                }}>
                <div className="flex justify-between items-center">
                  <Shield className="w-6 h-6" style={{ color: '#67e8f9' }} />
                  <span className="text-[8px] px-2 py-0.5 rounded font-mono font-bold border"
                    style={{ color: '#67e8f9', background: 'rgba(6,182,212,0.1)', borderColor: 'rgba(6,182,212,0.3)' }}>ML-DECT</span>
                </div>
                <div className="text-[10px] font-semibold leading-relaxed" style={{ color: '#94a3b8' }}>
                  Isolation Forest:<br />
                  <span style={{ color: '#34d399' }} className="font-bold">✓ NORMAL</span>
                </div>
              </div>

              {/* RIGHT */}
              <div className="absolute inset-0 rounded-2xl flex flex-col justify-center items-center p-4 border"
                style={{
                  transform: 'rotateY(90deg) translateZ(88px)',
                  background: 'linear-gradient(135deg, rgba(10,5,30,0.95), rgba(20,10,50,0.9))',
                  borderColor: 'rgba(251,146,60,0.4)',
                  boxShadow: 'inset 0 0 25px rgba(251,146,60,0.08)',
                }}>
                <Globe className="w-9 h-9 mb-2 animate-spin" style={{ color: '#fb923c', animationDuration: '10s' }} />
                <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#fb923c' }}>ECO ACTIVE</div>
              </div>

              {/* LEFT */}
              <div className="absolute inset-0 rounded-2xl flex flex-col justify-between p-4 border"
                style={{
                  transform: 'rotateY(-90deg) translateZ(88px)',
                  background: 'rgba(5,5,20,0.95)',
                  borderColor: 'rgba(236,72,153,0.35)',
                }}>
                <div className="text-[8px] font-mono" style={{ color: '#64748b' }}>METRICS OUTPUT</div>
                <div>
                  <div className="text-lg font-black font-mono" style={{ color: '#f472b6' }}>36.5 g/h</div>
                  <div className="text-[8px] font-bold uppercase tracking-wider mt-0.5" style={{ color: '#64748b' }}>Active Emission</div>
                </div>
              </div>

              {/* TOP */}
              <div className="absolute inset-0 rounded-2xl flex items-center justify-center border"
                style={{
                  transform: 'rotateX(90deg) translateZ(88px)',
                  background: 'rgba(10,5,30,0.9)',
                  borderColor: 'rgba(139,92,246,0.3)',
                }}>
                <div className="w-12 h-12 rounded-full border flex items-center justify-center"
                  style={{ borderColor: 'rgba(139,92,246,0.4)' }}>
                  <div className="w-5 h-5 rounded-full animate-ping" style={{ background: 'rgba(139,92,246,0.5)' }} />
                </div>
              </div>

              {/* BOTTOM */}
              <div className="absolute inset-0 rounded-2xl border"
                style={{
                  transform: 'rotateX(-90deg) translateZ(88px)',
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

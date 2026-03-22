"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { Trophy, Shield, Gamepad2, ArrowLeft, ExternalLink, Info, MapPin, LayoutDashboard, ChevronRight, Zap } from 'lucide-react';

const API_URL = "http://13.51.36.227:3000/api";

interface LeaderboardEntry {
  name: string;
  score: number;
}

export default function MenuPage() {
  const [view, setView] = useState<'menu' | 'leaderboard'>('menu');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/leaderboard?limit=10`);
      setLeaderboard(response.data);
      setView('leaderboard');
    } catch (error) {
      console.error("Chyba při načítání leaderboardu:", error);
      alert("Nepodařilo se načíst žebříček.");
    } finally {
      setLoading(false);
    }
  };

  if (view === 'leaderboard') {
    return (
      <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden font-sans">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/20 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full animate-pulse delay-700"></div>
        </div>

        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/20 overflow-hidden z-10 animate-in fade-in zoom-in duration-500">
          <div className="p-8 sm:p-12 bg-gradient-to-br from-yellow-400 to-orange-600 text-white flex items-center justify-between">
            <div>
               <h2 className="text-4xl font-black italic tracking-tighter uppercase">SÍŇ SLÁVY</h2>
               <p className="text-yellow-100 font-bold text-xs tracking-widest uppercase mt-1">Top 10 průzkumníků</p>
            </div>
            <button onClick={() => setView('menu')} className="bg-white/20 p-4 rounded-3xl hover:bg-white/30 transition-all active:scale-90">
              <ArrowLeft size={32} strokeWidth={3} />
            </button>
          </div>
          
          <div className="p-6 sm:p-10 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar text-white">
            {leaderboard.length === 0 ? (
              <div className="text-center py-20 bg-white/5 rounded-3xl border-2 border-dashed border-white/10">
                <p className="text-white/40 font-black italic">Zatím ticho po pěšině...</p>
              </div>
            ) : (
              leaderboard.map((entry, index) => (
                <div key={index} className={`flex items-center justify-between p-6 rounded-[2rem] border transition-all ${
                  index === 0 ? 'bg-yellow-400/20 border-yellow-400/50 shadow-lg' : 'bg-white/5 border-white/5'
                }`}>
                  <div className="flex items-center gap-6">
                    <span className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black text-xl ${
                      index === 0 ? 'bg-yellow-400 text-black' : 'bg-white/10 text-white/40'
                    }`}>{index + 1}</span>
                    <span className="font-black text-xl italic uppercase tracking-tight">{entry.name}</span>
                  </div>
                  <span className={`font-black text-3xl ${index === 0 ? 'text-yellow-400' : 'text-white'}`}>{entry.score}</span>
                </div>
              ))
            )}
          </div>
          <button onClick={() => setView('menu')} className="w-full py-8 bg-black/20 hover:bg-black/40 text-white/40 font-black uppercase tracking-[0.4em] text-xs transition-all">
            Zpět do menu
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden font-sans">
      
      {/* Background Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 blur-[150px] rounded-full animate-pulse"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 blur-[150px] rounded-full animate-pulse delay-700"></div>
      </div>

      {/* Header */}
      <div className="text-center mb-16 z-10">
        <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl px-6 py-2 rounded-full text-xs font-black text-blue-400 uppercase tracking-[0.4em] mb-10 border border-white/10 shadow-2xl">
           <Zap size={16} className="fill-blue-400" /> Hackaton 2026
        </div>
        
        <h1 className="text-7xl sm:text-[11rem] font-black text-white mb-6 tracking-tighter leading-[0.8] uppercase italic drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
          OBJEV<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x p-2">
            PLZEŇ
          </span>
        </h1>
        
        <p className="text-blue-100/60 text-2xl sm:text-4xl font-black max-w-2xl mx-auto tracking-tight leading-relaxed italic">
          Swipej. Objevuj. <span className="text-white underline decoration-blue-500 decoration-8 underline-offset-8">Vyhrávej!</span>
        </p>
      </div>

      {/* Grid se 4 Tlačítky - 2x2 Grid */}
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 gap-6 z-10">
        
        {/* MODRÁ - Spustit Hru */}
        <button 
          onClick={() => window.open('http://13.51.36.227:3002', '_blank')}
          className="bg-blue-600 hover:bg-blue-500 text-white p-1 rounded-[3rem] shadow-[0_20px_50px_rgba(59,130,246,0.4)] transition-all active:scale-95 border-b-[10px] border-blue-800"
        >
          <div className="bg-blue-600 hover:bg-blue-500 px-8 py-10 rounded-[2.5rem] flex flex-col items-center gap-6">
            <div className="bg-white text-blue-600 p-6 rounded-[2rem] shadow-2xl">
              <Gamepad2 size={48} strokeWidth={3} />
            </div>
            <div className="text-center">
              <span className="block text-4xl font-black italic uppercase tracking-tighter leading-none mb-2">SPUSTIT HRU</span>
              <span className="text-blue-100 font-black uppercase tracking-[0.3em] text-[10px] opacity-60">Tinder pro Plzeň</span>
            </div>
          </div>
        </button>

        {/* ŽLUTÁ - Žebříček */}
        <button 
          onClick={fetchLeaderboard}
          className="bg-yellow-500 hover:bg-yellow-400 text-white p-1 rounded-[3rem] shadow-[0_20px_40px_rgba(234,179,8,0.4)] transition-all active:scale-95 border-b-[10px] border-yellow-700"
        >
          <div className="bg-yellow-500 hover:bg-yellow-400 px-8 py-10 rounded-[2.5rem] flex flex-col items-center gap-6">
            <div className="bg-white text-yellow-600 p-6 rounded-[2rem] shadow-2xl">
              <Trophy size={48} strokeWidth={3} />
            </div>
            <div className="text-center">
              <span className="block text-4xl font-black italic uppercase tracking-tighter leading-none mb-2">ŽEBŘÍČEK</span>
              <span className="text-yellow-100 font-black uppercase tracking-[0.3em] text-[10px] opacity-60">Síň slávy</span>
            </div>
          </div>
        </button>

        {/* FIALOVÁ - Administrace */}
        <button 
          onClick={() => window.open('http://13.51.36.227:3001', '_blank')}
          className="bg-purple-600 hover:bg-purple-500 text-white p-1 rounded-[3rem] shadow-[0_20px_40px_rgba(147,51,234,0.4)] transition-all active:scale-95 border-b-[10px] border-purple-800"
        >
          <div className="bg-purple-600 hover:bg-purple-500 px-8 py-10 rounded-[2.5rem] flex flex-col items-center gap-6">
            <div className="bg-white text-purple-600 p-6 rounded-[2rem] shadow-2xl">
              <LayoutDashboard size={48} strokeWidth={3} />
            </div>
            <div className="text-center">
              <span className="block text-4xl font-black italic uppercase tracking-tighter leading-none mb-2 text-white">ADMIN</span>
              <span className="text-purple-100 font-black uppercase tracking-[0.3em] text-[10px] opacity-60">Správa systému</span>
            </div>
          </div>
        </button>

        {/* ZELENÁ - Dokumentace */}
        <button 
          onClick={() => window.open('http://13.51.36.227:3000/api-docs', '_blank')}
          className="bg-emerald-600 hover:bg-emerald-500 text-white p-1 rounded-[3rem] shadow-[0_20px_40px_rgba(16,185,129,0.4)] transition-all active:scale-95 border-b-[10px] border-emerald-800"
        >
          <div className="bg-emerald-600 hover:bg-emerald-500 px-8 py-10 rounded-[2.5rem] flex flex-col items-center gap-6">
            <div className="bg-white text-emerald-600 p-6 rounded-[2rem] shadow-2xl">
              <Info size={48} strokeWidth={3} />
            </div>
            <div className="text-center">
              <span className="block text-4xl font-black italic uppercase tracking-tighter leading-none mb-2 text-white">SWAGGER</span>
              <span className="text-emerald-100 font-black uppercase tracking-[0.3em] text-[10px] opacity-60">API Dokumentace</span>
            </div>
          </div>
        </button>

      </div>

      {/* Footer */}
      <div className="mt-24 z-10 opacity-30">
        <div className="flex items-center gap-6">
           <div className="h-[2px] w-20 bg-white"></div>
           <div className="flex items-center gap-3">
              <MapPin size={24} className="text-white fill-white" />
              <span className="text-2xl font-black tracking-[0.4em] text-white italic">PLZEŇ 2026</span>
           </div>
           <div className="h-[2px] w-20 bg-white"></div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </main>
  );
}

"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { Trophy, Shield, Gamepad2, ArrowLeft, ExternalLink, Info, MapPin, LayoutDashboard, ChevronRight, Zap, Sparkles } from 'lucide-react';

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
      <main className="min-h-screen bg-brand-cream flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden font-sans">
        <div className="absolute inset-0 z-0 pointer-events-none text-brand-brown/5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-blue/10 blur-[120px] rounded-full animate-pulse delay-700"></div>
        </div>

        <div className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl border border-brand-cream overflow-hidden z-10 animate-in fade-in zoom-in duration-500">
          <div className="p-8 sm:p-12 bg-gradient-to-br from-brand-orange to-brand-brown text-white flex items-center justify-between">
            <div>
               <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">SÍŇ SLÁVY</h2>
               <p className="text-brand-cream font-bold text-xs tracking-widest uppercase mt-2 opacity-80">Top 10 průzkumníků</p>
            </div>
            <button onClick={() => setView('menu')} className="bg-white/20 p-4 rounded-3xl hover:bg-white/30 transition-all active:scale-90">
              <ArrowLeft size={32} strokeWidth={3} />
            </button>
          </div>
          
          <div className="p-6 sm:p-10 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {leaderboard.length === 0 ? (
              <div className="text-center py-20 bg-brand-cream/30 rounded-3xl border-2 border-dashed border-brand-brown/10">
                <p className="text-brand-brown/40 font-black italic uppercase text-lg">Zatím ticho...</p>
              </div>
            ) : (
              leaderboard.map((entry, index) => (
                <div key={index} className={`flex items-center justify-between p-6 rounded-[2rem] border transition-all ${
                  index === 0 ? 'bg-brand-orange/10 border-brand-orange/30 shadow-md' : 'bg-brand-cream/20 border-brand-cream'
                }`}>
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 flex items-center justify-center rounded-2xl font-black text-2xl shadow-lg transform transition-transform group-hover:scale-110 ${
                      index === 0 ? 'bg-brand-orange text-white rotate-3' : 
                      index === 1 ? 'bg-slate-300 text-slate-800' : 
                      index === 2 ? 'bg-orange-400 text-orange-950 rotate-3' : 
                      'bg-brand-brown text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-black text-brand-brown text-xl italic uppercase tracking-tight">{entry.name}</span>
                  </div>
                  <div className="text-right">
                    <span className={`block font-black text-3xl leading-none ${index === 0 ? 'text-brand-orange' : 'text-brand-brown'}`}>
                      {entry.score}
                    </span>
                    <span className="text-[10px] uppercase font-black text-brand-brown/30 tracking-[0.2em]">Body</span>
                  </div>
                </div>
              ))
            )}
          </div>
          <button onClick={() => setView('menu')} className="w-full py-8 bg-brand-cream hover:bg-brand-cream/80 text-brand-brown/60 font-black uppercase tracking-[0.4em] text-xs transition-all border-t border-brand-cream/50">
            Zpět do menu
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-cream flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden font-sans">
      
      {/* Decorative Background Patterns */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
         <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand-blue/10 blur-[150px] rounded-full animate-pulse"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand-green/10 blur-[150px] rounded-full animate-pulse delay-700"></div>
         <div className="absolute top-[20%] right-[-5%] w-64 h-64 border-[40px] border-brand-orange/5 rounded-full"></div>
         <div className="absolute bottom-[10%] left-[-5%] w-80 h-80 border-[60px] border-brand-brown/5 rounded-full rotate-12"></div>
      </div>

      {/* Header */}
      <div className="text-center mb-16 z-10 animate-in fade-in slide-in-from-top-10 duration-700">
        <h1 className="text-8xl sm:text-[12rem] font-black text-brand-brown mb-6 tracking-tighter leading-[0.8] uppercase italic">
          OBJEV<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-green to-brand-orange animate-gradient-pulse p-2">
            PLZEŇ
          </span>
        </h1>
        
        <p className="text-brand-brown/60 text-2xl sm:text-4xl font-black max-w-2xl mx-auto tracking-tight leading-relaxed italic text-center">
          Nová éra poznávání města. <span className="text-brand-orange">Swajpuj, hraj a buď nejlepší!</span>
        </p>
      </div>

      {/* Action Grid - Custom Order */}
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 gap-6 z-10 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
        
        {/* 1. MODRÁ - Spustit Hru */}
        <button 
          onClick={() => window.open('http://13.51.36.227:3002', '_blank')}
          className="bg-brand-blue hover:bg-brand-blue/90 text-white p-1 rounded-[3rem] shadow-[0_20px_50px_rgba(39,111,191,0.3)] transition-all active:scale-95 border-b-[10px] border-[#1a4d8f]"
        >
          <div className="bg-brand-blue px-8 py-6 rounded-[2.5rem] flex flex-col items-center gap-4">
            <div className="bg-white text-brand-blue p-4 rounded-[1.5rem] shadow-xl">
              <Gamepad2 size={40} strokeWidth={3} />
            </div>
            <span className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter leading-none text-center">SPUSTIT HRU</span>
          </div>
        </button>

        {/* 2. HNĚDÁ - Pinder (původně Swagger) */}
        <button 
          onClick={() => window.open('http://13.51.36.227:3000/api-docs', '_blank')}
          className="bg-brand-brown hover:bg-brand-brown/90 text-white p-1 rounded-[3rem] shadow-[0_20px_40px_rgba(117,68,37,0.3)] transition-all active:scale-95 border-b-[10px] border-[#4d2d18]"
        >
          <div className="bg-brand-brown px-8 py-6 rounded-[2.5rem] flex flex-col items-center gap-4">
            <div className="bg-white text-brand-brown p-4 rounded-[1.5rem] shadow-xl">
              <Info size={40} strokeWidth={3} />
            </div>
            <span className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter leading-none text-center">PINDER</span>
          </div>
        </button>

        {/* 3. ORANŽOVÁ - Žebříček */}
        <button 
          onClick={fetchLeaderboard}
          className="bg-brand-orange hover:bg-brand-orange/90 text-white p-1 rounded-[3rem] shadow-[0_20px_40px_rgba(239,138,23,0.3)] transition-all active:scale-95 border-b-[10px] border-[#c46d0e]"
        >
          <div className="bg-brand-orange px-8 py-6 rounded-[2.5rem] flex flex-col items-center gap-4">
            <div className="bg-white text-brand-orange p-4 rounded-[1.5rem] shadow-xl">
              <Trophy size={40} strokeWidth={3} />
            </div>
            <span className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter leading-none text-center">ŽEBŘÍČEK</span>
          </div>
        </button>

        {/* 4. ZELENÁ - Administrace */}
        <button 
          onClick={() => window.open('http://13.51.36.227:3001', '_blank')}
          className="bg-brand-green hover:bg-brand-green/90 text-white p-1 rounded-[3rem] shadow-[0_20px_40px_rgba(47,110,34,0.3)] transition-all active:scale-95 border-b-[10px] border-[#1e4a12]"
        >
          <div className="bg-brand-green px-8 py-6 rounded-[2.5rem] flex flex-col items-center gap-4">
            <div className="bg-white text-brand-green p-4 rounded-[1.5rem] shadow-xl">
              <LayoutDashboard size={40} strokeWidth={3} />
            </div>
            <span className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter leading-none text-center">ADMIN</span>
          </div>
        </button>

      </div>

      {/* Footer Branding */}
      <div className="mt-20 z-10 flex flex-col items-center gap-4 opacity-40 text-center">
        <div className="flex items-center gap-6">
           <div className="h-[2px] w-12 bg-brand-brown"></div>
           <div className="flex items-center gap-2">
              <MapPin size={20} className="text-brand-brown" />
              <span className="text-sm font-black tracking-[0.4em] text-brand-brown italic uppercase">Plzeň 2026</span>
           </div>
           <div className="h-[2px] w-12 bg-brand-brown"></div>
        </div>
        <p className="text-[9px] font-bold text-brand-brown/50 uppercase tracking-[0.2em]">Aimtec Hackaton - Tým MonkePower</p>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(117, 68, 37, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(117, 68, 37, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </main>
  );
}

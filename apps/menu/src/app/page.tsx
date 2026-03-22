"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Shield, Gamepad2, Info, MapPin, LayoutDashboard, Zap, Sparkles } from 'lucide-react';

export default function MenuPage() {
  const router = useRouter();

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
        <h1 className="text-8xl sm:text-[12rem] font-black text-brand-brown mb-6 tracking-tighter leading-[0.8] uppercase italic text-center">
          OBJEV<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-green to-brand-orange animate-gradient-pulse p-2">
            PLZEŇ
          </span>
        </h1>
        
        <p className="text-brand-brown/60 text-2xl sm:text-4xl font-black max-w-2xl mx-auto tracking-tight leading-relaxed italic text-center">
          Nová éra poznávání města. <br /> <span className="text-brand-orange">Swajpuj, hraj a buď nejlepší!</span>
        </p>
      </div>

      {/* Action Grid */}
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 gap-6 z-10 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
        
        {/* 1. MODRÁ - Spustit Hru */}
        <button 
          onClick={() => window.open('https://13.51.36.227.nip.io/', '_blank')}
          className="bg-brand-blue hover:bg-brand-blue/90 text-white p-1 rounded-[3rem] shadow-[0_20px_50px_rgba(39,111,191,0.3)] transition-all active:scale-95 border-b-[10px] border-[#1a4d8f]"
        >
          <div className="bg-brand-blue px-8 py-6 rounded-[2.5rem] flex flex-col items-center gap-4 text-center">
            <div className="bg-white text-brand-blue p-4 rounded-[1.5rem] shadow-xl">
              <Gamepad2 size={40} strokeWidth={3} />
            </div>
            <span className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter leading-none text-center">SPUSTIT HRU</span>
          </div>
        </button>

        {/* 2. HNĚDÁ - Pinder */}
        <button 
          onClick={() => window.open('http://13.51.36.227:3002/', '_blank')}
          className="bg-brand-brown hover:bg-brand-brown/90 text-white p-1 rounded-[3rem] shadow-[0_20px_40px_rgba(117,68,37,0.3)] transition-all active:scale-95 border-b-[10px] border-[#4d2d18]"
        >
          <div className="bg-brand-brown px-8 py-6 rounded-[2.5rem] flex flex-col items-center gap-4 text-center">
            <div className="bg-white text-brand-brown p-4 rounded-[1.5rem] shadow-xl">
              <Info size={40} strokeWidth={3} />
            </div>
            <span className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter leading-none text-center">PINDER</span>
          </div>
        </button>

        {/* 3. ORANŽOVÁ - Žebříček (Redirect na novou stránku) */}
        <button 
          onClick={() => router.push('/leaderboard')}
          className="bg-brand-orange hover:bg-brand-orange/90 text-white p-1 rounded-[3rem] shadow-[0_20px_40px_rgba(239,138,23,0.3)] transition-all active:scale-95 border-b-[10px] border-[#c46d0e]"
        >
          <div className="bg-brand-orange px-8 py-6 rounded-[2.5rem] flex flex-col items-center gap-4 text-center">
            <div className="bg-white text-brand-orange p-4 rounded-[1.5rem] shadow-xl">
              <Trophy size={40} strokeWidth={3} />
            </div>
            <span className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter leading-none text-center">ŽEBŘÍČEK</span>
          </div>
        </button>

        {/* 4. ZELENÁ - Administrace */}
        <button 
          onClick={() => window.open('http://13.51.36.227:3001/', '_blank')}
          className="bg-brand-green hover:bg-brand-green/90 text-white p-1 rounded-[3rem] shadow-[0_20px_40px_rgba(47,110,34,0.3)] transition-all active:scale-95 border-b-[10px] border-[#1e4a12]"
        >
          <div className="bg-brand-green px-8 py-6 rounded-[2.5rem] flex flex-col items-center gap-4 text-center">
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

    </main>
  );
}

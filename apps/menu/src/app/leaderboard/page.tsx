"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Trophy, ArrowLeft, Star, MapPin, Sparkles } from 'lucide-react';

const API_URL = "http://13.51.36.227:3000";

interface LeaderboardEntry {
  name: string;
  score: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/leaderboard?limit=10`);
        setLeaderboard(response.data);
      } catch (error) {
        console.error("Chyba při načítání leaderboardu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <main className="min-h-screen bg-brand-cream flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden font-sans">
      
      {/* Decorative Background Patterns */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-40 text-brand-brown/5">
         <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 blur-[120px] rounded-full animate-pulse"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-blue/10 blur-[120px] rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl border border-brand-cream overflow-hidden z-10 animate-in fade-in zoom-in duration-500">
        <div className="p-8 sm:p-12 bg-gradient-to-br from-brand-orange to-brand-brown text-white flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-3">
            <Star size={16} fill="white" className="text-white animate-bounce" />
            <Star size={16} fill="white" className="text-white animate-bounce delay-100" />
            <Star size={16} fill="white" className="text-white animate-bounce delay-200" />
          </div>
          <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">SÍŇ SLÁVY</h2>
          <p className="text-brand-cream font-bold text-xs tracking-widest uppercase mt-3 opacity-80">Top 10 průzkumníků Plzně</p>
        </div>
        
        <div className="p-6 sm:p-10 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
               <div className="w-12 h-12 border-4 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin"></div>
               <p className="text-brand-brown/40 font-black uppercase tracking-widest text-xs">Načítám legendy...</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-20 bg-brand-cream/30 rounded-3xl border-2 border-dashed border-brand-brown/10">
              <p className="text-brand-brown/40 font-black italic uppercase text-lg text-center">Zatím ticho...</p>
            </div>
          ) : (
            leaderboard.map((entry, index) => (
              <div key={index} className={`flex items-center justify-between p-6 rounded-[2rem] border transition-all ${
                index === 0 ? 'bg-brand-orange/10 border-brand-orange/30 shadow-md scale-[1.02]' : 'bg-brand-cream/20 border-brand-cream'
              }`}>
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 flex items-center justify-center rounded-2xl font-black text-2xl shadow-lg ${
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
        
        <Link href="/" className="block w-full py-8 bg-brand-cream hover:bg-brand-cream/80 text-brand-brown/60 font-black uppercase tracking-[0.4em] text-xs transition-all border-t border-brand-cream/50 text-center">
          Zpět na základnu
        </Link>
      </div>

      {/* Footer Branding */}
      <div className="mt-12 z-10 flex flex-col items-center gap-4 opacity-40 text-center">
        <div className="flex items-center gap-6">
           <div className="h-[2px] w-12 bg-brand-brown"></div>
           <div className="flex items-center gap-2">
              <MapPin size={20} className="text-brand-brown" />
              <span className="text-sm font-black tracking-[0.4em] text-brand-brown italic uppercase">Plzeň 2026</span>
           </div>
           <div className="h-[2px] w-12 bg-brand-brown"></div>
        </div>
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

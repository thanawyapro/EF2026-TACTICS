import React, { useState } from 'react';
import TacticalBoard from './components/ui/TacticalBoard';
import TacticsAICoachTab from './components/tactics/TacticsAICoachTab';
import MetaCounterTab from './components/tactics/MetaCounterTab';

function App() {
  const [activeTab, setActiveTab] = useState<'board' | 'coach' | 'meta'>('board');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30">
      
      {/* الهيدر الاحترافي المطوّر بتأثير زجاجي */}
      <header className="backdrop-blur-md bg-slate-900/80 border-b border-slate-800/80 p-4 sticky top-0 z-50 shadow-lg shadow-black/20">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-emerald-500 to-green-400 p-2 rounded-xl shadow-md shadow-emerald-500/20">
              <span className="text-xl block animate-pulse">⚽</span>
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
                TACTIC BOSS <span className="text-white text-xs font-medium px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 ml-1">EF2026</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">نظام التحليل التكتيكي الذكي المتكامل</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              AI PRO ONLINE
            </span>
          </div>
        </div>
      </header>

      {/* منطقة عرض الأدوات الرئيسية المفتوحة */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 pb-28">
        <div className="transition-all duration-300 ease-in-out">
          
          {activeTab === 'board' && (
            <div className="backdrop-blur-md bg-slate-900/40 rounded-2xl p-5 shadow-xl border border-slate-800/60 transition-all">
              <div className="flex items-center justify-between mb-5 border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">📋 اللوحة التكتيكية المتقدمة</h2>
                  <p className="text-xs text-slate-400 mt-0.5">قم بضبط التشكيلة، تحريك اللاعبين وتعيين مراكز الميتا</p>
                </div>
              </div>
              <TacticalBoard />
            </div>
          )}

          {activeTab === 'coach' && (
            <div className="backdrop-blur-md bg-slate-900/40 rounded-2xl p-5 shadow-xl border border-slate-800/60 transition-all">
              <div className="flex items-center justify-between mb-5 border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">🤖 مدرب الذكاء الاصطناعي الخبير</h2>
                  <p className="text-xs text-slate-400 mt-0.5">تحليل تكتيكي فوري واقتراح خطط مضادة بناءً على محرك TACTICBOSS</p>
                </div>
              </div>
              <TacticsAICoachTab />
            </div>
          )}

          {activeTab === 'meta' && (
            <div className="backdrop-blur-md bg-slate-900/40 rounded-2xl p-5 shadow-xl border border-slate-800/60 transition-all">
              <div className="flex items-center justify-between mb-5 border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">⚡ دليل الخطط والحلول المضادة</h2>
                  <p className="text-xs text-slate-400 mt-0.5">استعرض خطط المحترفين الحالية وتعرف على كيفية إبطال مفعولها</p>
                </div>
              </div>
              <MetaCounterTab />
            </div>
          )}

        </div>
      </main>

      {/* شريط التنقل السفلي الاحترافي - مصمم لتبسيط تجربة المستخدم بالكامل */}
      <nav className="backdrop-blur-lg bg-slate-950/90 border-t border-slate-800 fixed bottom-0 left-0 right-0 z-50 shadow-2xl shadow-black">
        <div className="max-w-md mx-auto flex justify-around p-3">
          
          <button
            onClick={() => setActiveTab('board')}
            className={`flex flex-col items-center gap-1.5 p-2 rounded-xl w-24 transition-all duration-200 ${
              activeTab === 'board' 
                ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-lg shadow-emerald-500/5 font-bold scale-105' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <span className="text-xl">📋</span>
            <span className="text-xs tracking-wide">اللوحة</span>
          </button>

          <button
            onClick={() => setActiveTab('coach')}
            className={`flex flex-col items-center gap-1.5 p-2 rounded-xl w-24 transition-all duration-200 ${
              activeTab === 'coach' 
                ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-lg shadow-emerald-500/5 font-bold scale-105' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <span className="text-xl">🤖</span>
            <span className="text-xs tracking-wide">المدرب الذكي</span>
          </button>

          <button
            onClick={() => setActiveTab('meta')}
            className={`flex flex-col items-center gap-1.5 p-2 rounded-xl w-24 transition-all duration-200 ${
              activeTab === 'meta' 
                ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-lg shadow-emerald-500/5 font-bold scale-105' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <span className="text-xl">⚡</span>
            <span className="text-xs tracking-wide">خطط الميتا</span>
          </button>

        </div>
      </nav>

    </div>
  );
}

export default App;

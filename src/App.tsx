import React, { useState } from 'react';
import TacticalBoard from './components/ui/TacticalBoard';
import TacticsAICoachTab from './components/tactics/TacticsAICoachTab';
import MetaCounterTab from './components/tactics/MetaCounterTab';

function App() {
  // هنا نحدد القسم النشط حالياً، وافتراضياً يبدأ باللوحة التكتيكية
  const [activeTab, setActiveTab] = useState<'board' | 'coach' | 'meta'>('board');

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
      
      {/* شريط العنوان العلوي (Header) */}
      <header className="bg-slate-800 border-b border-slate-700 p-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-wider text-emerald-400 flex items-center gap-2">
            ⚽ EF2026 Tactics
          </h1>
          <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">
            نسخة الإطلاق التجريبية v1.0
          </span>
        </div>
      </header>

      {/* محتوى القسم المختار (Main Content) */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 pb-24">
        {activeTab === 'board' && (
          <div className="bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-700 animate-fadeIn">
            <h2 className="text-lg font-semibold mb-4 text-emerald-400">اللوحة التكتيكية وتشكيل الفريق</h2>
            <TacticalBoard />
          </div>
        )}

        {activeTab === 'coach' && (
          <div className="bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-700 animate-fadeIn">
            <h2 className="text-lg font-semibold mb-4 text-emerald-400">المدرب الذكي (AI Coach)</h2>
            <TacticsAICoachTab />
          </div>
        )}

        {activeTab === 'meta' && (
          <div className="bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-700 animate-fadeIn">
            <h2 className="text-lg font-semibold mb-4 text-emerald-400">خطط الميتا والحلول المضادة</h2>
            <MetaCounterTab />
          </div>
        )}
      </main>

      {/* شريط التحكم السفلي للتنقل بين الأقسام الثلاثة (Bottom Navigation Bar) */}
      <nav className="bg-slate-800 border-t border-slate-700 fixed bottom-0 left-0 right-0 z-50 shadow-lg">
        <div className="max-w-md mx-auto flex justify-around p-2">
          
          {/* زر اللوحة التكتيكية */}
          <button
            onClick={() => setActiveTab('board')}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg w-20 transition-all ${
              activeTab === 'board' ? 'text-emerald-400 bg-slate-700/50 scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-xl">📋</span>
            <span className="text-xs font-medium">اللوحة</span>
          </button>

          {/* زر المدرب الذكي */}
          <button
            onClick={() => setActiveTab('coach')}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg w-20 transition-all ${
              activeTab === 'coach' ? 'text-emerald-400 bg-slate-700/50 scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-xl">🤖</span>
            <span className="text-xs font-medium">المدرب الذكي</span>
          </button>

          {/* زر خطط الميتا */}
          <button
            onClick={() => setActiveTab('meta')}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg w-20 transition-all ${
              activeTab === 'meta' ? 'text-emerald-400 bg-slate-700/50 scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-xl">⚡</span>
            <span className="text-xs font-medium">الميتا</span>
          </button>

        </div>
      </nav>

    </div>
  );
}

export default App;

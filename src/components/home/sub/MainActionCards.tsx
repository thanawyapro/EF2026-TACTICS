// src/components/home/sub/MainActionCards.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Brain, FolderHeart, Settings, ArrowRight, Sparkles } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';

interface MainActionCardsProps {
  onNavigate: (tabId: string) => void;
}

export default function MainActionCards({ onNavigate }: MainActionCardsProps) {
  const language = useAppStore(state => state.language);
  const themeAccent = useAppStore(state => state.themeAccent);

  const cards = [
    {
      id: 'build_plan',
      icon: Sparkles,
      titleAr: 'ابني خطتك التكتيكية',
      titleEn: 'Build Your Plan',
      descAr: 'خطتك التفصيلية بالتعليمات الفردية الفورية بناءً على طريقة لعبك ومشاكلك.',
      descEn: 'Configure customized gameplans with real physical positioning parameter rules.',
      color: '#22d3ee',
      bgLight: 'rgba(34, 211, 238, 0.04)'
    },
    {
      id: 'counter',
      icon: Zap,
      titleAr: 'تدمير أسلوب الخصم',
      titleEn: 'Counter Opponent',
      descAr: 'حدد أسلوب تشكيل الخصم ومشاكلك واحصل على السلاح التكتيكي المضاد فوراً.',
      descEn: 'Input opponent formations and acquire precise antidote strategy blueprints.',
      color: '#10b981',
      bgLight: 'rgba(16, 185, 129, 0.04)'
    },
    {
      id: 'smart_coach',
      icon: Brain,
      titleAr: 'مستشار مدربك الذكي',
      titleEn: 'Smart Coach',
      descAr: 'اسأل مدرب الميتا الذكي عن أي استفسار أو مشكلة في تشكيلات اللعبة.',
      descEn: 'Consult our eFootball AI coach about high-level tactics or gaming hurdles.',
      color: '#f59e0b',
      bgLight: 'rgba(245, 158, 11, 0.04)'
    },
    {
      id: 'plans',
      icon: FolderHeart,
      titleAr: 'الخطط المحفوظة والمجربة',
      titleEn: 'Saved Plans',
      descAr: 'تصفح وراجع جميع التكتيكات والخطط التي حفظتها في مسيرتك.',
      descEn: 'Browse, manage, and analyze your custom saved profiles and structures.',
      color: '#ec4899',
      bgLight: 'rgba(236, 72, 153, 0.04)'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 select-none" data-testid="main-action-cards">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.id}
            whileHover={{ y: -4, borderColor: card.color }}
            onClick={() => onNavigate(card.id)}
            className="bg-slate-900/60 hover:bg-slate-900 border border-border/80 p-5 rounded-3xl shadow-lg cursor-pointer transition-all duration-300 flex flex-col justify-between h-52 group relative overflow-hidden"
          >
            {/* Soft accent glow light */}
            <div 
              className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl pointer-events-none group-hover:opacity-100 opacity-60 transition-all duration-300" 
              style={{ backgroundColor: card.color, opacity: 0.06 }}
            />
            
            <div className="space-y-3 z-10">
              <div 
                className="w-11 h-11 rounded-2xl flex items-center justify-center border transition-all"
                style={{ 
                  backgroundColor: `${card.color}10`, 
                  borderColor: `${card.color}25`,
                  color: card.color
                }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white transition-colors group-hover:text-cyan-400">
                  {language === 'ar' ? card.titleAr : card.titleEn}
                </h3>
                <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                  {language === 'ar' ? card.descAr : card.descEn}
                </p>
              </div>
            </div>

            <div 
              className="flex items-center gap-1.5 text-[11px] font-black uppercase font-orbitron mt-2"
              style={{ color: card.color }}
            >
              <span>{language === 'ar' ? 'البدء الآن' : 'START NOW'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

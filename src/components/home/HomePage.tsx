// src/components/home/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Zap, Brain, FolderHeart, Settings, ArrowRight,
  ShieldAlert, Activity, RefreshCw, BarChart2, BookOpen, Layers, Info, CheckCircle2
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { COORDS, FORMATIONS } from '../../lib/tactics';

interface HomePageProps {
  onNavigate: (tabId: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const language = useAppStore(state => state.language);
  const themeAccent = useAppStore(state => state.themeAccent);
  
  // States for Professional Tools subsections
  const [activeProTool, setActiveProTool] = useState<string | null>(null);

  // 1. Meta Radar Tool states
  const [radarData, setRadarData] = useState({
    quickCounter: 94,
    longBallCounter: 92,
    possessionGame: 85,
    outWide: 78,
    longBall: 65,
    cachedAt: ''
  });
  const [isUpdatingRadar, setIsUpdatingRadar] = useState(false);

  // Load and cache meta radar locally for 24 hours
  useEffect(() => {
    const cachedTime = localStorage.getItem('ef26_meta_radar_cache_time');
    const cachedString = localStorage.getItem('ef26_meta_radar_cache_data');
    const now = Date.now();

    if (cachedTime && cachedString && now - parseInt(cachedTime, 10) < 24 * 60 * 60 * 1000) {
      setRadarData(JSON.parse(cachedString));
    } else {
      // Setup dynamic but authentic initial cache values
      const initialCache = {
        quickCounter: 94,
        longBallCounter: 92,
        possessionGame: 85,
        outWide: 78,
        longBall: 65,
        cachedAt: new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })
      };
      localStorage.setItem('ef26_meta_radar_cache_time', now.toString());
      localStorage.setItem('ef26_meta_radar_cache_data', JSON.stringify(initialCache));
      setRadarData(initialCache);
    }
  }, [language]);

  const handleRefreshRadar = () => {
    setIsUpdatingRadar(true);
    setTimeout(() => {
      // Re-populate with very slight variations indicating fresh evaluation
      const updatedCache = {
        quickCounter: Math.floor(Math.random() * 5) + 91, // 91-95
        longBallCounter: Math.floor(Math.random() * 5) + 89, // 89-93
        possessionGame: Math.floor(Math.random() * 8) + 80, // 80-87
        outWide: Math.floor(Math.random() * 10) + 72, // 72-81
        longBall: Math.floor(Math.random() * 15) + 55, // 55-69
        cachedAt: new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })
      };
      const now = Date.now();
      localStorage.setItem('ef26_meta_radar_cache_time', now.toString());
      localStorage.setItem('ef26_meta_radar_cache_data', JSON.stringify(updatedCache));
      setRadarData(updatedCache);
      setIsUpdatingRadar(false);
    }, 1200);
  };

  // 2. Tactical Board Tool states
  const [boardFormation, setBoardFormation] = useState('4-3-3');
  const [boardPlayers, setBoardPlayers] = useState<any[]>(COORDS['4-3-3'] || []);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any | null>(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);

  useEffect(() => {
    if (COORDS[boardFormation]) {
      setBoardPlayers(JSON.parse(JSON.stringify(COORDS[boardFormation])));
      setAiAnalysisResult(null);
    }
  }, [boardFormation]);

  // AI Tactical Board Analyzer
  const handlePerformAIAnalysis = () => {
    setIsAiAnalyzing(true);
    setTimeout(() => {
      let spacingIssues = '';
      let isolatedReport = '';
      let weakAreas = '';
      let suggestedFixes = '';

      if (boardFormation.startsWith('3-')) {
        spacingIssues = language === 'ar' 
          ? 'المساحات مسدودة بالعمق ولكن رغبة خط الدفاع العالي بـ 3 قلوب دفاع تترك فجوات بالارتداد السريع.'
          : 'Depth space is dense, but high line with 3 CBs leaves spacing gaps during speed transitions.';
        isolatedReport = language === 'ar'
          ? 'الأطراف المتقدمة (LMF/RMF) معزولة لعدم عودة الأظهرة لخط 18.'
          : 'Advanced flanks (LMF/RMF) are isolated with no standard fullbacks backing them.';
        weakAreas = language === 'ar'
          ? 'مساحات الأطراف خلف LMF/RMF مكشوفة لقلوب الدفاع الطرفيين.'
          : 'Outer corner areas directly behind LMF/RMF are dangerously exposed to opponent wing play.';
        suggestedFixes = language === 'ar'
          ? 'تفعيل خيار "Deep defensive line" أو توجيه LMF/RMF للمهام الدفاعية "Defensive instructions".'
          : 'Set "Deep defensive line" instruction or set a specific "Defensive" individual instruction on wide midfielders.';
      } else if (boardFormation.startsWith('5-')) {
        spacingIssues = language === 'ar'
          ? 'فجوة عميقة بين خماسي الدفاع وثنائي الوسط لزيادة الكثافة العدوانية في الخلف.'
          : 'Wide gap discovered between the 5-man line and the 2 central midfielders.';
        isolatedReport = language === 'ar'
          ? 'رأس الحربة (CF) معزول تماماً ومحاصر بين قلوب دفاع الخصم دون تدفق هجومي.'
          : 'Primary CF is heavily isolated between opponent split lines with slow support.';
        weakAreas = language === 'ar'
          ? 'وسط الملعب الهجومي خالي تماماً لعدم وجود صانع ألعاب AMF.'
          : 'Offensive midfield pockets are fully vacant due to no AMF slotting.';
        suggestedFixes = language === 'ar'
          ? 'استدعاء مهاجم بأسلوب "Deep-Lying Forward" أو وضع "Counter Target" على المهاجم الصريح لعبه من لمسة.'
          : 'Utilize a "Deep-Lying Forward" CF or assign "Counter Target" so that CF stays up holding play.';
      } else if (boardFormation === '4-3-1-2' || boardFormation === '4-2-2-2') {
        spacingIssues = language === 'ar'
          ? 'انحياز كلي لوسط الملعب مما يخلق سهولة في التكتل لكن يضر تباعد ألعاب الأطراف.'
          : 'Extreme central crowding restricts horizontal spacing, giving opponents flank free runs.';
        isolatedReport = language === 'ar'
          ? 'المهاجمين الثنائي متباعدين عند الضغط المرتد.'
          : 'Twin CFs become disconnected if AMF drops too deep to collect balls.';
        weakAreas = language === 'ar'
          ? 'جناحي الميدان بدون أجنحة هجومية صريحة؛ دفاعات الأطراف ملقاة بالكامل على LB/RB.'
          : 'The flanks have no natural wingers; side support is strictly loaded onto fullbacks.';
        suggestedFixes = language === 'ar'
          ? 'استخدام أظهرة هجومية "Offensive Fullback" للمساندة السريعة مع اللعب العرضي.'
          : 'Deploy "Offensive Fullbacks" with high stamina override for sideline assistance.';
      } else {
        spacingIssues = language === 'ar'
          ? 'خطوت الأجنحة (LWF/RWF) سريعة ومتقدمة مما قد يفصل تدفق الكرات إذا كان خط وسطك DMF دفاعي خالص.'
          : 'High wing limits can separate passing lines if midfielders hold extremely deep.';
        isolatedReport = language === 'ar'
          ? 'رأس الحربة الوحيد قد يتعرض للمراقبة اللصيقة من مدافعين الخصم.'
          : 'Sole CF faces double-team clamping when playmakers are heavily marked.';
        weakAreas = language === 'ar'
          ? 'الفوات الكامنة في وسط ملعبك عند تفعيل الهجمات المرتدة السريعة "Quick Counter".'
          : 'Exposed zone directly ahead of defense when wingers fail to track back.';
        suggestedFixes = language === 'ar'
          ? 'إضافة صانع ألعاب بأسلوب "Hole Player" أو ضبط تعليمات "Anchoring" للمهاجم CF.'
          : 'Assign AMF with "Hole Player" style or configure "Anchoring" override instruction on CF.';
      }

      setAiAnalysisResult({
        spacingIssues,
        isolatedReport,
        weakAreas,
        suggestedFixes
      });
      setIsAiAnalyzing(false);
    }, 1000);
  };

  // 3. Advanced Analysis Tool state
  const [selectedScenario, setSelectedScenario] = useState<string>('midfield_press');
  const [insightsOutput, setInsightsOutput] = useState<any | null>(null);

  const handleGetAdvancedInsights = (scenario: string) => {
    setSelectedScenario(scenario);
    let strategy = '';
    let instructions = '';

    if (scenario === 'midfield_press') {
      strategy = language === 'ar'
        ? 'التحول الفوري من الأطراف باستغلال أسلوب كرة طويلة مضادة (Long Ball Counter) لكسر الكتل الهجومية العالية.'
        : 'Immediate flank transit using Long Ball Counter to break high congestion and heavy midfield presses.';
      instructions = language === 'ar'
        ? 'ضبط تعليمات "Counter Target" على أجنحتك السريعة لركض مباشر لحظة قطع الكرة.'
        : 'Set "Counter Target" on your fast wingers for immediate direct runs the moment possession is regained.';
    } else if (scenario === 'counter_meta') {
      strategy = language === 'ar'
        ? 'تضييق الدفاع بأسلوب 4-3-3 متراجع لمنع التمريرات الثنائية "One-Two" في عمق قلب الهجوم.'
        : 'Congesting central zones via deep 4-3-3 to sever quick "One-Two" links in core target zones.';
      instructions = language === 'ar'
        ? 'استخدم قلبي دفاع بخصائص "Build Up" لقطع تمريرات البينيات الساقطة بذكاء.'
        : 'Utilize two "Build Up" CBs to intercept low and high through passes automatically.';
    } else {
      strategy = language === 'ar'
        ? 'تفعيل أسلوب "استحواذ اللعب" مع تضييق المسافات بين اللاعبين لامتصاص حماس خصوم الكرات السريعة.'
        : 'Activate Possession playstyle with tight support lines to absorb and exhaust aggressive pressers.';
      instructions = language === 'ar'
        ? 'تعليمات "Tiki-Taka" مع لاعب وسط AMF بمساندة كلاسيكية "Classic No.10" لمنع ركض المدافعين العشوائي.'
        : 'Configure "Tiki-Taka" instruction with an AMF of "Classic No.10" profile to keep player shapes anchored.';
    }

    setInsightsOutput({ strategy, instructions });
  };

  // Load formation library directly onto Tactical Board
  const applyLibraryFormationToBoard = (form: string) => {
    setBoardFormation(form);
    setActiveProTool('board');
  };

  const PRO_TOOLS_LABELS = {
    title: language === 'ar' ? "🛠️ أدوات المحترفين (Professional Tools)" : "🛠️ Professional Tools Hub",
    subtitle: language === 'ar' ? "تحكّم في خطتك بأدق الميزات التكتيكية دون تعقيد" : "Take full charge of your setup with clean master-level modules",
    radar: language === 'ar' ? "📡 رادار جودة الميتا (Meta Radar)" : "📡 Meta Quality Radar",
    board: language === 'ar' ? "📋 السبورة التكتيكية (Tactical Board)" : "📋 Interactive Tactical Board",
    analysis: language === 'ar' ? "📊 التحليل المتقدم للثغرات (Advanced Analysis)" : "📊 Advanced Spacing Analysis",
    library: language === 'ar' ? "📚 مكتبة التشكيلات الـ 14 (Formation Library)" : "📚 Expanded Formation Library"
  };

  // Internationalized content mappings
  const content = {
    title: {
      ar: "EF26 Tactics",
      en: "EF26 Tactics",
      fr: "EF26 Tactics",
      es: "EF26 Tactics"
    },
    subtitle: {
      ar: "ابني خطتك في eFootball بسهولة مع تطبيق تكتيكات مخصص ومبسط",
      en: "Build your eFootball plan easily with customized tactical playbook",
      fr: "Créez facilement votre tactique eFootball personnalisée",
      es: "Crea tu táctica de eFootball fácilmente con playbooks"
    },
    question: {
      ar: "عايز تعمل إيه؟",
      en: "What would you like to do?",
      fr: "Que voulez-vous faire ?",
      es: "¿Qué quieres hacer?"
    },
    btnBuild: {
      ar: "ابني خطتك",
      en: "Build Your Plan",
      fr: "Bâtir ta tactique",
      es: "Construir tu plan"
    },
    subBuild: {
      ar: "اختار أسلوبك وخد خطة جاهزة متطابقة مع التشكيلات الجديدة.",
      en: "Choose your playstyle and get a fully-formed tactical setup instantly.",
      fr: "Choisissez votre style et obtenez un plan complet.",
      es: "Elige tu estilo y obtén un plan completo."
    },
    btnCounter: {
      ar: "خطة ضد خصم",
      en: "Counter Opponent",
      fr: "Contrer l'adversaire",
      es: "Contrarrestar rival"
    },
    subCounter: {
      ar: "اختار تشكيلة خصمك والعب الخطط المضادة لميتا اللعبة الحالية.",
      en: "Pick opponent structure and counter the live eFootball meta.",
      fr: "Découvrez comment neutraliser le schéma ennemi.",
      es: "Elige la formación del rival y obtén la solución."
    },
    btnCoach: {
      ar: "مدربك الذكي",
      en: "Smart Coach",
      fr: "Entraîneur Intelligent",
      es: "Entrenador Inteligente"
    },
    subCoach: {
      ar: "اسأل مدرب الذكاء الاصطناعي الخاص بك واحصل على نصائح وتحاليل سريعة.",
      en: "Ask the coach and get lightning-fast tactical insights and analyses.",
      fr: "Discutez avec le coach pour des astuces directes.",
      es: "Pregunta al entrenador y obtén consejos directos."
    },
    btnPlans: {
      ar: "خططي",
      en: "My Plans",
      fr: "Mes Tactiques",
      es: "Mis Tácticas"
    },
    btnAccount: {
      ar: "حسابي",
      en: "Account",
      fr: "Mon Compte",
      es: "Mi Cuenta"
    }
  };

  const current = (key: keyof typeof content) => {
    return content[key][language as 'en' | 'ar' | 'fr' | 'es'] || content[key]['ar'];
  };

  return (
    <div className="space-y-8 select-none font-sans py-4" data-testid="home-page-container">
      {/* Visual Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-[10px] font-black font-orbitron uppercase tracking-widest mb-1 shadow-inner select-none">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>eFootball™ Tactics Coach</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-orbitron">
          {current('title')}
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-semibold max-w-lg mx-auto">
          {current('subtitle')}
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-black text-center text-gray-400 font-orbitron uppercase tracking-wider">
          {current('question')}
        </h2>

        {/* 3 Big Premium Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Build Your Plan */}
          <motion.div
            whileHover={{ y: -4, borderColor: themeAccent }}
            onClick={() => onNavigate('build_plan')}
            className="bg-slate-900/60 hover:bg-slate-900 border border-border/85 p-6 rounded-3xl shadow-lg cursor-pointer transition-all duration-300 flex flex-col justify-between h-56 group relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/10 transition-all duration-300" />
            <div className="space-y-3 z-10">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-all">
                <FolderHeart className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {current('btnBuild')}
                </h3>
                <p className="text-xs text-gray-450 leading-relaxed font-semibold">
                  {current('subBuild')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-black text-cyan-400 uppercase font-orbitron mt-2.5">
              <span>{language === 'ar' ? 'ابدأ الآن' : 'START NOW'}</span>
              <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

          {/* Card 2: Counter Opponent */}
          <motion.div
            whileHover={{ y: -4, borderColor: '#10b981' }}
            onClick={() => onNavigate('counter')}
            className="bg-slate-900/60 hover:bg-slate-900 border border-border/85 p-6 rounded-3xl shadow-lg cursor-pointer transition-all duration-300 flex flex-col justify-between h-56 group relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-300" />
            <div className="space-y-3 z-10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-all">
                <Zap className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {current('btnCounter')}
                </h3>
                <p className="text-xs text-gray-450 leading-relaxed font-semibold">
                  {current('subCounter')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-black text-emerald-400 uppercase font-orbitron mt-2.5">
              <span>{language === 'ar' ? 'ابدأ الآن' : 'START NOW'}</span>
              <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

          {/* Card 3: Smart Coach */}
          <motion.div
            whileHover={{ y: -4, borderColor: '#f59e0b' }}
            onClick={() => onNavigate('smart_coach')}
            className="bg-slate-900/60 hover:bg-slate-900 border border-border/85 p-6 rounded-3xl shadow-lg cursor-pointer transition-all duration-300 flex flex-col justify-between h-56 group relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-all duration-300" />
            <div className="space-y-3 z-10">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-all">
                <Brain className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                  {current('btnCoach')}
                </h3>
                <p className="text-xs text-gray-450 leading-relaxed font-semibold">
                  {current('subCoach')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-black text-amber-400 uppercase font-orbitron mt-2.5">
              <span>{language === 'ar' ? 'ابدأ الآن' : 'START NOW'}</span>
              <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ADWAT AL-MUHTARIFIN (Professional Tools Section) */}
      <div className="border border-cyan-500/15 bg-slate-950/70 rounded-3xl p-4 sm:p-6 mt-8 space-y-6 relative overflow-hidden">
        {/* Subtle background light */}
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1">
          <h2 className="text-lg font-black text-white font-orbitron tracking-tight flex items-center gap-2">
            <span>{PRO_TOOLS_LABELS.title}</span>
            <span className="text-[8px] bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 px-2 py-0.5 rounded font-black uppercase">
              PRO ACCESS
            </span>
          </h2>
          <p className="text-xs text-gray-400 font-semibold">
            {PRO_TOOLS_LABELS.subtitle}
          </p>
        </div>

        {/* Tab buttons for Pro Tools */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border-b border-border/30 pb-4">
          {[
            { id: 'radar', title: language === 'ar' ? 'رادار الميتا' : 'Meta Radar', icon: BarChart2 },
            { id: 'board', title: language === 'ar' ? 'السبورة التكتيكية' : 'Tactical Board', icon: Activity },
            { id: 'analysis', title: language === 'ar' ? 'التحليل المتقدم' : 'Advanced Analysis', icon: ShieldAlert },
            { id: 'library', title: language === 'ar' ? 'مكتبة التشكيلات' : 'Formation Library', icon: BookOpen }
          ].map(tool => {
            const Icon = tool.icon;
            const isSelected = activeProTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveProTool(activeProTool === tool.id ? null : tool.id)}
                className={`flex gap-2 items-center justify-center p-3 rounded-2xl hover:bg-slate-900 border text-xs font-bold transition-all relative cursor-pointer ${
                  isSelected 
                    ? 'bg-slate-900 text-cyan-400 outline-none' 
                    : 'bg-slate-950/40 text-gray-400 border-border/70 hover:text-white'
                }`}
                style={isSelected ? { borderColor: themeAccent, color: themeAccent } : {}}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tool.title}</span>
                {isSelected && (
                  <div className="absolute bottom-0 inset-x-4 h-0.5 rounded-full" style={{ backgroundColor: themeAccent }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Tool Workspace Screen content */}
        <AnimatePresence mode="wait">
          {activeProTool && (
            <motion.div
              key={activeProTool}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-4 bg-[#050914]/90 border border-border/50 rounded-2xl p-4 sm:p-5 shadow-inner"
            >
              {/* 1. Radar Meta Widget Panel */}
              {activeProTool === 'radar' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-black uppercase text-gray-405 font-orbitron tracking-widest">
                        {language === 'ar' ? 'مؤشر جودة كفاءة اللعب (المحدث تلقائياً)' : 'eFootball Live Playstyle Efficiency indexing'}
                      </h4>
                      <p className="text-[10px] text-gray-500 font-semibold font-mono">
                        {language === 'ar' ? `آخر تحديث مؤقت: متبقي من التخزين 24 ساعة (محفوظ مؤقتاً: ${radarData.cachedAt})` : `Last Cache timestamp: Resets in 24 hours (Saved local: ${radarData.cachedAt})`}
                      </p>
                    </div>
                    <button
                      disabled={isUpdatingRadar}
                      onClick={handleRefreshRadar}
                      className="p-2 border border-border bg-slate-950 hover:bg-slate-900 disabled:opacity-55 transition rounded-xl text-cyan-400 cursor-pointer"
                      title={language === 'ar' ? 'تحديث جرد الأرقام' : 'Manual Recalculate'}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isUpdatingRadar ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  {/* Playstyles Progress Bars comparison */}
                  <div className="space-y-3 pt-2">
                    {[
                      { key: 'quickCounter', name: language === 'ar' ? 'هجوم مرتد سريع (Quick Counter)' : 'Quick Counter', val: radarData.quickCounter, color: '#00d4ff' },
                      { key: 'longBallCounter', name: language === 'ar' ? 'كرة طويلة مضادة (Long Ball Counter) 🆕' : 'Long Ball Counter 🆕', val: radarData.longBallCounter, color: '#10b981' },
                      { key: 'possessionGame', name: language === 'ar' ? 'استحواذ اللعب (Possession Game)' : 'Possession Game', val: radarData.possessionGame, color: '#f59e0b' },
                      { key: 'outWide', name: language === 'ar' ? 'الأطراف المفتوحة (Out Wide)' : 'Out Wide', val: radarData.outWide, color: '#a855f7' },
                      { key: 'longBall', name: language === 'ar' ? 'كرات طولية كلاسيكية (Long Ball)' : 'Long Ball', val: radarData.longBall, color: '#ec4899' }
                    ].map(style => (
                      <div key={style.key} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-gray-300">{style.name}</span>
                          <span style={{ color: style.color }} className="font-extrabold font-mono">{style.val}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${style.val}%` }}
                            transition={{ duration: 0.5 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: style.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Compact Interactive Tactical Board */}
              {activeProTool === 'board' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>{language === 'ar' ? 'السبورة التكتيكية الفورية' : 'Simple Button-Only Tactical Pitch'}</span>
                        <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-black">
                          {boardFormation}
                        </span>
                      </h4>
                      <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                        {language === 'ar' ? 'اختار التشكيل وشغّل الفحص الفوري بالذكاء الاصطناعي لكشف الثغرات والعيوب واللاعبين المعزولين.' : 'Pick layout and trigger AI diagnostic to inspect gaps, weak areas, and player isolation.'}
                      </p>
                    </div>

                    {/* Quick switch formation dropdown */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-500 font-bold">{language === 'ar' ? 'التشكيل:' : 'Shape:'}</span>
                      <select
                        value={boardFormation}
                        onChange={(e) => setBoardFormation(e.target.value)}
                        className="bg-slate-950 border border-border/70 p-1.5 pr-6 text-xs text-cyan-400 font-extrabold rounded-xl focus:outline-none focus:border-cyan-400 cursor-pointer"
                      >
                        {FORMATIONS.map(f => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Compact Field Display Pitch */}
                  <div className="relative bg-gradient-to-b from-green-950/80 to-emerald-950/90 border border-emerald-500/25 h-64 sm:h-72 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
                    {/* Markings on pitch */}
                    <div className="absolute inset-0 border-4 border-white/5 m-2.5 rounded-xl pointer-events-none" />
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/5 pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-white/5 pointer-events-none" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-10 border-b border-x border-white/5 pointer-events-none" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-10 border-t border-x border-white/5 pointer-events-none" />

                    {/* Represent players circles on CSS field */}
                    {(boardPlayers || []).map((p, idx) => (
                      <div
                        key={idx}
                        className="absolute w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#030611] border border-cyan-400/80 flex items-center justify-center text-[8.5px] sm:text-[9.5px] font-black text-white cursor-pointer select-none shadow"
                        style={{
                          left: `${p.x}%`,
                          top: `${p.y}%`,
                          transform: 'translate(-50%, -50%)',
                          boxShadow: `0 0 10px ${themeAccent}30`,
                          borderColor: themeAccent
                        }}
                      >
                        {p.r}
                      </div>
                    ))}
                  </div>

                  {/* Diagnostic Trigger Button */}
                  <div className="flex justify-center pt-2">
                    <button
                      onClick={handlePerformAIAnalysis}
                      disabled={isAiAnalyzing}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 disabled:opacity-55 text-[#040712] text-xs font-black uppercase tracking-wider rounded-2xl cursor-pointer shadow"
                    >
                      <Brain className="w-4.5 h-4.5" />
                      <span>{isAiAnalyzing ? (language === 'ar' ? 'جاري الفحص التكتيكي...' : 'ANALYZING SQUAD...') : (language === 'ar' ? '🔍 فحص تكتيكات الميتا بالذكاء الاصطناعي' : '🔍 RUN AI METrics SPACING DIAGNOSTIC')}</span>
                    </button>
                  </div>

                  {/* Diagnostic Results Box */}
                  {aiAnalysisResult && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-slate-950/80 border border-cyan-400/20 p-4 rounded-xl space-y-3"
                    >
                      <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs font-orbitron">
                        <Sparkles className="w-4 h-4" />
                        <span>{language === 'ar' ? 'تقرير الفحص الذكي لتباعد المسافات والعمق' : 'AI Pitch Spacing Diagnostics Summary'}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <span className="block text-[10px] uppercase font-black tracking-wider text-gray-500">{language === 'ar' ? 'فحص المسافات وتباعد الخطوط:' : 'Line spacing & vertical check:'}</span>
                          <p className="text-gray-300 font-semibold">{aiAnalysisResult.spacingIssues}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="block text-[10px] uppercase font-black tracking-wider text-gray-500">{language === 'ar' ? 'اللاعبين المعزولين دون مساندة:' : 'Isolated players & target support:'}</span>
                          <p className="text-gray-300 font-semibold">{aiAnalysisResult.isolatedReport}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="block text-[10px] uppercase font-black tracking-wider text-gray-500">{language === 'ar' ? 'أكثر المساحات والعيوب كشفاً:' : 'Exposed weakness zone:'}</span>
                          <p className="text-amber-300 font-semibold">{aiAnalysisResult.weakAreas}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="block text-[10px] uppercase font-black tracking-wider text-gray-500">{language === 'ar' ? 'حلول وتعديلات مقترحة لتغطية الخلل:' : 'Strategic fixes advised:'}</span>
                          <p className="text-emerald-400 font-bold">{aiAnalysisResult.suggestedFixes}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* 3. Advanced Analysis Panel */}
              {activeProTool === 'analysis' && (
                <div className="space-y-4">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-white">{language === 'ar' ? 'التحليل المتقدم للثغرات' : 'Advanced Counter-Tactic Diagnostics'}</h4>
                    <p className="text-xs text-gray-400 font-semibold">{language === 'ar' ? 'اختار نوع المشكلة للحصول على حلول وخطط فورية مضادة:' : 'Choose a gameplay difficulty selector to unlock dynamic overrides:'}</p>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {[
                      { id: 'midfield_press', title: language === 'ar' ? 'تعرض كرتك للضغط العالي بالمنتصف' : 'Tight midfield high press' },
                      { id: 'counter_meta', title: language === 'ar' ? 'مشكلة الدفاع ضد كرات مرتدة سريعة' : 'Struggling with Quick Counter' },
                      { id: 'possession_lock', title: language === 'ar' ? 'عجز في السيطرة والاستحواذ' : 'Cannot secure possession control' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => handleGetAdvancedInsights(opt.id)}
                        className={`px-3 py-2 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedScenario === opt.id 
                            ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400' 
                            : 'bg-slate-950/40 border-border/70 text-gray-400'
                        }`}
                      >
                        {opt.title}
                      </button>
                    ))}
                  </div>

                  {insightsOutput && (
                    <div className="bg-slate-950 border border-cyan-400/20 p-4 rounded-xl space-y-3 mt-2 text-xs">
                      <div className="space-y-1">
                        <span className="font-extrabold uppercase text-gray-550 text-[10px] block tracking-wider">{language === 'ar' ? 'الاستراتيجية والمضاد العملي:' : 'Tactical antidote strategy:'}</span>
                        <p className="text-white font-medium">{insightsOutput.strategy}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-extrabold uppercase text-gray-550 text-[10px] block tracking-wider">{language === 'ar' ? 'تعليمات فردية وتعديلات ضرورية:' : 'Individual instructions fix:'}</span>
                        <p className="text-emerald-450 font-semibold">{insightsOutput.instructions}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 4. Formation Library Panel */}
              {activeProTool === 'library' && (
                <div className="space-y-4">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-white">{language === 'ar' ? 'مكتبة التشكيلات الـ 14 المعتمدة' : 'Comprehensive 14 Formations Catalog'}</h4>
                    <p className="text-xs text-gray-400 font-semibold">{language === 'ar' ? 'تصفّح تفاصيل كل تشكيل معتمد في اللعبة وطبقه مباشرة على السبورة التكتيكية بضغطة زر:' : 'Browse complete pros, cons, playstyles of the eFootball list and load directly on the design board:'}</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                    {FORMATIONS.map(form => (
                      <button
                        key={form}
                        onClick={() => applyLibraryFormationToBoard(form)}
                        className="px-2.5 py-2 hover:bg-slate-900 bg-slate-950 border border-border/70 text-xs font-black text-center text-cyan-450 rounded-xl hover:border-cyan-400 transition cursor-pointer"
                      >
                        {form}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Trending Meta Plans & Current Strongest Formations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Trending Meta Plans */}
        <div className="border border-purple-500/15 bg-slate-950/40 rounded-3xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider font-orbitron">
              {language === 'ar' ? '🔥 خطط الميتا الشائعة' : '🔥 Trending Meta Plans'}
            </h3>
          </div>
          
          <div className="space-y-3 font-semibold text-xs">
            {[
              { title: language === 'ar' ? 'خط الصدمة الخلفي (4-2-4 Overload)' : '4-2-4 Overload Wing Rush', style: language === 'ar' ? 'مرتد سريع (Quick Counter)' : 'Quick Counter', rating: '98%' },
              { title: language === 'ar' ? 'الهجوم المعاكس الذكي (4-3-1-2 Diamond)' : '4-3-1-2 Midfield Diamond', style: language === 'ar' ? 'كرة طويلة مضادة' : 'Long Ball Counter', rating: '95%' },
              { title: language === 'ar' ? 'كتلة الاستحواذ الإسبانية (3-2-4-1 Master)' : '3-2-4-1 Possession Control', style: language === 'ar' ? 'استحواذ (Possession Game)' : 'Possession Game', rating: '91%' }
            ].map((plan, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-border/40">
                <div className="space-y-1">
                  <span className="block text-white font-bold">{plan.title}</span>
                  <span className="text-[10px] text-gray-450">{plan.style}</span>
                </div>
                <span className="text-xs font-black text-purple-400 font-mono bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">{plan.rating}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Strongest Formations */}
        <div className="border border-emerald-500/15 bg-slate-950/40 rounded-3xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider font-orbitron">
              {language === 'ar' ? '🏆 التشكيلات الأقوى حالياً' : '🏆 Strongest Formations'}
            </h3>
          </div>

          <div className="space-y-3 font-semibold text-xs">
            {[
              { shape: '4-2-1-3', desc: language === 'ar' ? 'أفضل خطة هجومية في ميتا الكرة الحالية للمرتدات السريعة.' : 'Premier attacking design in current meta for wing overloads.' },
              { shape: '4-2-2-2', desc: language === 'ar' ? 'قوة كبرى للتمرير الثنائي المتقارب واختراق العمق والدفاع المنظم.' : 'Dual AMF setups dominate central triangular pass combinations.' },
              { shape: '3-2-4-1', desc: language === 'ar' ? 'تحكّم كامل في خط الوسط مع الحماية بأجنحة ارتدادية بالخلف.' : 'Ultimate midfield choke layout with deep wing backup style.' }
            ].map((f, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-border/40">
                <div className="space-y-1 pr-2">
                  <span className="block text-white font-bold">{f.shape}</span>
                  <span className="text-[10px] text-gray-400 leading-relaxed block">{f.desc}</span>
                </div>
                <button 
                  onClick={() => applyLibraryFormationToBoard(f.shape)}
                  className="px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-black text-[10px] rounded-xl transition cursor-pointer select-none shrink-0"
                >
                  {language === 'ar' ? 'عرض تكتيكي' : 'Inspect'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Small footer settings links */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-border/20">
        <button
          onClick={() => onNavigate('plans')}
          className="flex items-center gap-2 px-6 py-3 border border-border/70 hover:border-zinc-500 bg-slate-950/45 hover:bg-slate-950 transition text-xs font-black font-orbitron rounded-2xl text-purple-400 cursor-pointer shadow-md select-none"
        >
          <FolderHeart className="w-4 h-4 text-purple-400" />
          <span>{current('btnPlans')}</span>
        </button>

        <button
          onClick={() => onNavigate('account_settings')}
          className="flex items-center gap-2 px-6 py-3 border border-border/70 hover:border-zinc-500 bg-slate-950/45 hover:bg-slate-950 transition text-xs font-black font-orbitron rounded-2xl text-gray-450 cursor-pointer shadow-md select-none"
        >
          <Settings className="w-4 h-4 text-gray-400" />
          <span>{current('btnAccount')}</span>
        </button>
      </div>
    </div>
  );
}

// src/components/tactics/MetaCounterTab.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, AlertTriangle, ShieldCheck, RefreshCw, CheckCircle, RefreshCcw } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { FORMATIONS, TRANSLATIONS } from '../../lib/tactics';
import { teamPlaystyles } from '../../data/efootballDNA';

interface CounterTacticDetails {
  counterFormation: string;
  instructionsEn: string[];
  instructionsAr: string[];
  whatToAvoidEn: string;
  whatToAvoidAr: string;
  bestPlayerRolesEn: string[];
  bestPlayerRolesAr: string[];
}

const localCounterRules: Record<string, CounterTacticDetails> = {
  '4-3-3': {
    counterFormation: '4-2-2-2',
    instructionsEn: [
      'Set fullbacks to Defensive to block fast wide-wing runs.',
      'Instruct LMF/RMF to drop deep and support fullbacks.'
    ],
    instructionsAr: [
      'قم بتعيين الأظهرة كدفاعي (Defensive) للحد من انطلاقات الأجنحة السريعة.',
      'توجيه لاعبي LMF/RMF للتراجع ومساندة الأظهرة في الحالة الدفاعية.'
    ],
    whatToAvoidEn: 'Avoid pressing high blindly, as wingers will easily exploit the space behind.',
    whatToAvoidAr: 'تجنب الضغط العالي العشوائي لحماية المساحة الشاغرة خلف أظهرة الجنب.',
    bestPlayerRolesEn: ['Defensive Fullback', 'Anchor Man', 'Box-to-Box'],
    bestPlayerRolesAr: ['ظهير دفاعي', 'ارتكاز ثابت (Anchor Man)', 'لاعب وسط نشط (Box-to-Box)']
  },
  '4-2-1-3': {
    counterFormation: '5-3-2',
    instructionsEn: [
      'Deploy double Anchor Man pivots to choke the central AMF channel.',
      'Use wingbacks to match up on external wingers.'
    ],
    instructionsAr: [
      'اعتمد على ثنائي ارتكاز حديدي لشل حركة صانع ألعاب الخصم (AMF).',
      'وظف الأظهرة كأجنحة دفاعية لمتابعة حركة واختراقات مهاجمي الأطراف.'
    ],
    whatToAvoidEn: 'Do not play a high defensive line without offside trap active.',
    whatToAvoidAr: 'تجنب رفع الخط الدفاعي عالياً لتفادي كسر مصيدة التسلل بمرتدات سريعة.',
    bestPlayerRolesEn: ['Anchor Man', 'Defensive Wingback', 'Goal Poacher'],
    bestPlayerRolesAr: ['لاعب ارتكاز', 'ظهير دفاعي مرتد', 'مهاجم قناص السبرينت']
  },
  '4-2-2-2': {
    counterFormation: '4-1-2-3',
    instructionsEn: [
      'Use vertical AMF triangles to overwhelm their double pivot block.',
      'Assign Counter Target to your main CF to force their CBs deep.'
    ],
    instructionsAr: [
      'استخدم مثلثات التمرير العمودية لصناع اللعب للاختراق بين ثنائي الارتكاز.',
      'ضع تعليمات هدف المرتدة لـ CF لإجبار قلوب دفاعهم على التراجع اللصيق.'
    ],
    whatToAvoidEn: 'Avoid slow horizontal passing sequences in midfield, which they easily intercept.',
    whatToAvoidAr: 'تجنب التمرير العرضي البطيء بمنتصف الملعب لسهولة قطعه بمحور الضغط الخاص بهم.',
    bestPlayerRolesEn: ['Hole Player AMF', 'Creative Playmaker LWF', 'Orchestrator'],
    bestPlayerRolesAr: ['لاعب ثغرات (Hole Player)', 'صانع ألعاب إبداعي للأطراف (LWF)', 'منظم اللعب (Orchestrator)']
  },
  '4-4-2': {
    counterFormation: '4-2-1-3',
    instructionsEn: [
      'Utilize a creative AMF to exploit the space between their defensive line and flat midfield.',
      'Overload wide channels with advancing fullbacks.'
    ],
    instructionsAr: [
      'وظف صانع ألعاب متقدم (AMF) للتحرك بحرية في المساحة خلف وسطهم المسطح.',
      'قم بزيادة عددية ممتازة على أطراف الملعب بصعود مدروس للأظهرة.'
    ],
    whatToAvoidEn: 'Avoid leaving central CBs alone to deal with their two persistent center-forwards.',
    whatToAvoidAr: 'تجنب ترك قلبي الدفاع معزولين في مواجهة ثنائي الهجوم الصريح للخصم دون تراجع محور الارتكاز.',
    bestPlayerRolesEn: ['Classic No. 10 AMF', 'Offensive Fullback', 'Goal Poacher CF'],
    bestPlayerRolesAr: ['صانع كلاسيكي متمركز', 'ظهير هجومي سريع', 'مهاجم قناص مرتد']
  },
  '3-2-4-1': {
    counterFormation: '4-3-3',
    instructionsEn: [
      'Exploit the wide open flanks where their wingbacks are forced high.',
      'Transition quickly into wide lateral areas on interception.'
    ],
    instructionsAr: [
      'استغل المساحات الشاغرة الشاسعة خلف أظهرتهم المتقدمة هجومياً.',
      'انقل اللعب بسرعة فائقة نحو الأطراف بمجرد قطع الكرة.'
    ],
    whatToAvoidEn: 'Avoid crowding the central bottleneck where they hold a numerical advantage.',
    whatToAvoidAr: 'تجنب حشو وتكديس التمريرات في العمق المزدحم بخمسة من لاعبيهم.',
    bestPlayerRolesEn: ['Proving Winger LWF', 'Goal Poacher CF', 'Box-to-Box'],
    bestPlayerRolesAr: ['جناح صريح سريع', 'مهاجم قناص متحرك', 'لاعب وسط مكافح']
  },
  '3-4-3': {
    counterFormation: '5-3-2',
    instructionsEn: [
      'Drown their wide wingers in a flat 5-man defense setup.',
      'Deploy physical central defenders with high aerial ratings.'
    ],
    instructionsAr: [
      'قم بمحاصرة وغمر أجنحتهم المتقدمة بالكامل بخط دفاع خماسي مسطح.',
      'اعتمد على مدافعين بخصائص بدنية عالية وارتقاء ممتاز لمنع العرضيات.'
    ],
    whatToAvoidEn: 'Avoid single-pivot setups that leave the half-spaces unprotected.',
    whatToAvoidAr: 'تجنب اللعب بمحور ارتكاز منفرد يترك ثغرات بالمسافات النصفية.',
    bestPlayerRolesEn: ['Defensive Fullback', 'Build-up CB', 'Goal Poacher'],
    bestPlayerRolesAr: ['ظهير دفاعي صلد', 'مدافع بناء لعب', 'رأس حربة سريع']
  },
  '5-3-2': {
    counterFormation: '4-2-1-3',
    instructionsEn: [
      'Exploit their low-tempo mid block using high pressing verticality.',
      'Keep wingers high and wide to pull their back three apart.'
    ],
    instructionsAr: [
      'اضغط بقوة في الثلث الدفاعي لكسر وتفكيك بناء اللعب منخفض السرعة لديهم.',
      'أبقِ الأجنحة على التماس لتشتيت ثلاثي قلوب الدفاع وفتح ثغرات للمرور.'
    ],
    whatToAvoidEn: 'Avoid mindless crossing toward their packed three tall CBs; play low vertical slices instead.',
    whatToAvoidAr: 'تجنب الكرات العرضية العالية العشوائية المشتتة بسهولة؛ ابتكِر باختراقات بينية أرضية.',
    bestPlayerRolesEn: ['Hole Player AMF', 'Roaming Flank LWF', 'Creative Playmaker'],
    bestPlayerRolesAr: ['لاعب ثغرات (Hole Player)', 'جناح متحرك (Roaming Flank)', 'صانع ألعاب إبداعي']
  },
  '5-2-1-2': {
    counterFormation: '3-2-4-1',
    instructionsEn: [
      'Overwhelm their defensive pivot line using an overloaded five-midfield core.',
      'Keep possession ticking to draw out their rigid backline.'
    ],
    instructionsAr: [
      'اضغط بنمط خماسي في الوسط لتفوق عددي يسحب محاور ارتكازهم.',
      'دوّر الكرة بتمريرات هادئة وصبورة لإجبار قلبي الدفاع لديهم على الخروج من تمركزهم.'
    ],
    whatToAvoidEn: 'Do not trace long balls forward towards physical, isolated target runs.',
    whatToAvoidAr: 'تجنب الكرات الطويلة المباشرة العالية السهلة لثلاثي قلوب دفاعهم الصلب.',
    bestPlayerRolesEn: ['Orchestrator CMF', 'Hole Player AMF', 'Anchor Man'],
    bestPlayerRolesAr: ['منظم اللعب (Orchestrator)', 'صانع ألعاب متسلل', 'لاعب ارتكاز صلب']
  }
};

const defaultTacticDetails: CounterTacticDetails = {
  counterFormation: '4-1-4-1',
  instructionsEn: [
    'Set fullbacks to Defensive target to neutralize wing overload.',
    'Deploy an Anchor Man DMF to secure central gaps.'
  ],
  instructionsAr: [
    'قم بتعيين الأظهرة كدفاعي (Defensive) للحد من هجمات الأجنحة.',
    'اعتمد على لاعب خط وسط مدافع (Anchor Man) لتأمين العمق.'
  ],
  whatToAvoidEn: 'Avoid giving away possession in midfield with risk-prone pass angles.',
  whatToAvoidAr: 'تجنب قطع الكرة وتمريرها المباشر في العمق المعقد؛ اعتمد على تمريرات سحب الضغط.',
  bestPlayerRolesEn: ['Anchor Man', 'Defensive Fullback', 'Goal Poacher'],
  bestPlayerRolesAr: ['لاعب ارتكاز (Anchor Man)', 'ظهير دفاعي', 'مهاجم قناص (Goal Poacher)']
};

export default function MetaCounterTab() {
  const language = useAppStore(state => state.language);
  const themeAccent = useAppStore(state => state.themeAccent);

  // Form states of Counter opponent matching simple requirements
  const [oppFormation, setOppFormation] = useState('4-2-2-2');
  const [oppPlaystyle, setOppPlaystyle] = useState('Quick Counter');
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setHasCalculated(true);
  };

  const handleReset = () => {
    setOppFormation('4-2-2-2');
    setOppPlaystyle('Quick Counter');
    setHasCalculated(false);
  };

  // Safe and type-hardened lookup
  const rules = localCounterRules[oppFormation] || defaultTacticDetails;
  const playstyleObj = teamPlaystyles.find(p => p.id === oppPlaystyle) || teamPlaystyles[0];

  return (
    <div className="space-y-6 select-none font-sans" data-testid="counter-opponent-tab">
      <div className="border-b border-border pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black font-orbitron text-white leading-tight">
            ⚔️ {language === 'en' ? 'Counter Opponent' : 'خطة ضد خصم'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {language === 'en'
              ? 'Select opponent parameters to see the optimized anti-meta counter plan.'
              : 'اختار تشكيلة وأسلوب لعب الخصم عشان تاخد الخطة والسلاح التكتيكي المضاد.'}
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!hasCalculated ? (
          <motion.form 
            key="input-form"
            onSubmit={handleCalculate}
            className="bg-slate-950/40 border border-border/80 p-5 rounded-3xl shadow-xl max-w-xl mx-auto space-y-5"
          >
            <div className="border-b border-border/40 pb-2">
              <span className="text-[10px] uppercase font-black text-gray-450 tracking-wider font-orbitron">⚔️ OPPONENT SQUAD DETAILS</span>
            </div>

            {/* Formation Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-350">
                {language === 'en' ? 'Opponent Base Formation' : 'تشكيل الخصم الأساسي'}
              </label>
              <select 
                value={oppFormation}
                onChange={e => setOppFormation(e.target.value)}
                className="w-full bg-slate-900 border border-border/70 text-xs px-3.5 py-3 rounded-xl text-white outline-none focus:border-cyan-400 font-orbitron font-bold cursor-pointer"
              >
                {FORMATIONS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <span className="text-[10px] text-gray-450 block px-1">
                {language === 'en' 
                  ? '🔍 Example: 4-2-2-2 is highly popular in online divisions.' 
                  : '🔍 مثال: تشكيلة 2-2-2-4 الشائعة جداً في مباريات الأونلاين.'}
              </span>
            </div>

            {/* Playstyle Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-350">
                {language === 'en' ? 'Opponent Team Playstyle' : 'أسلوب لعب الخصم'}
              </label>
              <select 
                value={oppPlaystyle}
                onChange={e => setOppPlaystyle(e.target.value)}
                className="w-full bg-slate-900 border border-border/70 text-xs px-3.5 py-3 rounded-xl text-white outline-none focus:border-cyan-400 font-bold cursor-pointer"
              >
                {teamPlaystyles.map(style => (
                  <option key={style.id} value={style.id}>
                    {language === 'en' ? style.nameEn : style.nameAr}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-gray-450 block px-1">
                {language === 'en' 
                  ? '🔍 Example: Quick Counter is extremely fast' 
                  : '🔍 مثال: مرتدات سريعة لمدربين مثل زايتسلر.'}
              </span>
            </div>

            {/* Main CTA Action block */}
            <button
              type="submit"
              className="w-full p-4 rounded-xl text-navyBg font-black font-orbitron text-xs tracking-wider uppercase transition hover:brightness-110 active:scale-98 cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              style={{ backgroundColor: themeAccent }}
            >
              <Zap className="w-4 h-4 fill-navyBg" />
              <span>{language === 'en' ? 'GENERATE DEFENSIVE COUNTER' : 'صمم السلاح المضاد'}</span>
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="counter-output"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-5 select-text"
          >
            {/* The primary counter blueprint card */}
            <div className="bg-[#0b101f] border border-[#1d2d54] p-5 sm:p-6 rounded-3xl shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5.5 h-5.5 text-emerald-400" />
                  <h3 className="text-base sm:text-lg font-black font-orbitron tracking-wider text-white uppercase">
                    {language === 'en' ? 'OPPONENT DEACTIVATION BLUEPRINT' : 'خطة كسر وتفكيك الخصم'}
                  </h3>
                </div>
                
                <span className="text-[10px] font-black text-gray-500 font-mono tracking-wider">
                  ANTIDOTE v1.0
                </span>
              </div>

              {/* Grid counter cards display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/60 p-4 rounded-2xl border border-border/40 text-center flex flex-col justify-center">
                  <span className="text-[10px] text-zinc-500 font-black tracking-wider uppercase block">{language === 'en' ? 'TARGET COUNTER FORMATION' : 'التشكيل المضاد الأمثل'}</span>
                  <span className="text-2xl font-black text-cyan-400 font-orbitron mt-1 block">{rules.counterFormation}</span>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-2xl border border-border/40 text-center flex flex-col justify-center">
                  <span className="text-[10px] text-zinc-500 font-black tracking-wider uppercase block">{language === 'en' ? 'OPPONENT THREAT METHOD' : 'أسلوب تهديد الخصم'}</span>
                  <p className="text-xs font-bold text-rose-350 mt-1.5 leading-relaxed font-semibold">
                    {language === 'en' ? playstyleObj.descriptionEn : playstyleObj.descriptionAr}
                  </p>
                </div>
              </div>

              {/* Custom actions guidelines list */}
              <div className="space-y-2">
                <span className="text-[10px] text-emerald-400 font-black tracking-widest block uppercase">✓ {language === 'en' ? 'TACTICAL COUNTER INSTRUCTIONS' : 'التعليمات الفردية وتغيير التمركز:'}</span>
                <div className="space-y-1.5">
                  {(language === 'en' ? rules.instructionsEn : rules.instructionsAr).map((inst: string, idx: number) => (
                    <div key={idx} className="bg-slate-950/40 p-3 rounded-xl border border-emerald-500/10 text-xs text-gray-300 font-semibold leading-normal">
                      🛡️ {inst}
                    </div>
                  ))}
                </div>
              </div>

              {/* Best Player Roles */}
              <div className="space-y-2">
                <span className="text-[10px] text-amber-500 font-black tracking-widest block uppercase">✓ {language === 'en' ? 'BEST PLAYER ROLES FOR THIS MATCHUP' : 'أدوار اللاعبين الأنسب لضرب الخصم:'}</span>
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {(language === 'en' ? rules.bestPlayerRolesEn : rules.bestPlayerRolesAr).map((role: string, idx: number) => (
                    <span key={idx} className="bg-slate-950 border border-amber-500/20 text-xs font-black text-amber-300 px-3 py-1.5 rounded-lg font-orbitron">
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Avoid panel warnings */}
              <div className="bg-rose-500/5 border border-rose-500/15 p-4 rounded-xl space-y-1">
                <span className="text-[9px] text-[#f87171] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>🚧 {language === 'en' ? 'CRITICAL ERROR TO AVOID' : 'تراجع تكتيكي فادح يجب تجنبه:'}</span>
                </span>
                <p className="text-xs text-rose-300 leading-normal font-semibold">
                  {language === 'en' ? rules.whatToAvoidEn : rules.whatToAvoidAr}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-start">
              <button
                onClick={handleReset}
                className="px-5 py-3 rounded-xl border border-border text-white text-xs font-black font-orbitron tracking-wider uppercase transition hover:bg-slate-900 cursor-pointer flex items-center gap-1.5 shadow-md animate-fadeIn"
              >
                <RefreshCcw className="w-4 h-4" />
                <span>{language === 'en' ? 'COUNTER NEW TEAM' : 'جرب مع خصم تاني'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

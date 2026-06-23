// src/data/metaPlans.ts

export interface MetaPlan {
  formation: string;
  playstyle: string;
  playstyleAr: string;
  rating: string;
  highlights: string[];
  highlightsAr: string[];
  counters: string[];
  pros: string;
  prosAr: string;
  cons: string;
  consAr: string;
  recommendationLevel: 'beginner' | 'advanced';
}

export const META_PLANS: MetaPlan[] = [
  {
    formation: '4-2-1-3',
    playstyle: 'Quick Counter',
    playstyleAr: 'مرتدات سريعة',
    rating: '98%',
    highlights: ['Symmetric offense with CF support', 'High pressing lines', 'Rapid wing options'],
    highlightsAr: ['هجوم متماثل مع دعم مهاجم صريح', 'خطوط ضغط عالية جداً', 'أجنحة هجومية فائقة السرعة'],
    counters: ['4-3-1-2', '5-3-2'],
    pros: 'Best wing penetration to overwhelm standard defense backline setups.',
    prosAr: 'أفضل اختراق عريض للأطراف للتغلب على التشكيلات الدفاعية الكلاسيكية.',
    cons: 'Exposes outer corner zones behind advanced wingbacks.',
    consAr: 'يكشف المساحات الزاوية خلف الأظهرة أثناء الاندفاع الهجومي.',
    recommendationLevel: 'beginner'
  },
  {
    formation: '4-1-2-3',
    playstyle: 'Quick Counter',
    playstyleAr: 'مرتدات سريعة',
    rating: '96%',
    highlights: ['Double AMF offensive density', 'Direct midfield link-up', 'Explosive wing play'],
    highlightsAr: ['كثافة هجومية بصانعي ألعاب مزدوجين', 'ربط مباشر وسريع في خط الوسط', 'أطراف هجومية متفجرة'],
    counters: ['4-5-1', '4-2-2-2'],
    pros: 'Maximum attacking options with high chance creation.',
    prosAr: 'خيارات هجومية قصوى مع صناعة فرص لا تنتهي في عمق ملعب الخصم.',
    cons: 'Highly vulnerable to solo DMF overloading.',
    consAr: 'معرض للارتدادات بسهولة إذا زاد الضغط على لاعب الـ DMF الوحيد.',
    recommendationLevel: 'advanced'
  },
  {
    formation: '4-3-1-2',
    playstyle: 'Long Ball Counter',
    playstyleAr: 'كرة طويلة مضادة',
    rating: '95%',
    highlights: ['Midfield diamond dominance', 'Tighter central shielding', 'Twin CF links'],
    highlightsAr: ['سيطرة مطلقة لماسة الوسط', 'حماية حديدية للعمق الدفاعي', 'تعاون ممتاز بين ثنائي الهجوم'],
    counters: ['4-2-1-3', '4-2-2-2'],
    pros: 'Overloads the pitch core, suffocates opponent playmakers.',
    prosAr: 'يخلق كثافة عددية هائلة بالعمق تخنق خط وسط الخصم.',
    cons: 'Absence of natural wingers forces fullbacks to cover high distances.',
    consAr: 'غياب الأجنحة يضع حملاً ثقيلًا على الأظهرة لتغطية الأطراف بالكامل.',
    recommendationLevel: 'beginner'
  },
  {
    formation: '3-2-4-1',
    playstyle: 'Possession Game',
    playstyleAr: 'استحواذ',
    rating: '91%',
    highlights: ['Midfield overload layout', 'Tiki-Taka supremacy', '3-man solid rest defense'],
    highlightsAr: ['تكدس تكتيكي مذهل في المنتصف', 'تفوق كاسح لأسلوب التيكي تاكا', 'دفاع ثلاثي كفء ومستقر'],
    counters: ['4-2-2-2', '4-2-4'],
    pros: 'Allows safe lateral balls with high support density.',
    prosAr: 'تسهيل التمريرات الجانبية الآمنة بفضل المساندة القريبة.',
    cons: 'Slow transition on loss of play. Counter-attacks on wings kill you.',
    consAr: 'بطيء في التحول عند خسارة الكرة، والمرتدات العريضة تنهي الدفاع.',
    recommendationLevel: 'advanced'
  },
  {
    formation: '4-2-2-2',
    playstyle: 'Out Wide',
    playstyleAr: 'لعب على الأطراف',
    rating: '94%',
    highlights: ['Dual attacking wingers AMF', 'Strong crossing options', 'Balanced double pivot'],
    highlightsAr: ['ثنائي AMF لتأمين صناعة اللعب', 'خيارات عرضية متميزة', 'ارتكاز مزدوج متوازن دفاعياً'],
    counters: ['3-2-4-1', '4-1-2-3'],
    pros: 'Excellent horizontal coverage to spread opponent dense backlines.',
    prosAr: 'تغطية عرضية مميزة تجبر دفاعات الخصم المتكتلة على فتح مساحاتها.',
    cons: 'Leaves gaps between AMFs and isolated strikers.',
    consAr: 'يخلق جيباً فارغاً بين خط الوسط المتقدم والمهاجمين.',
    recommendationLevel: 'advanced'
  },
  {
    formation: '4-4-2',
    playstyle: 'Long Ball',
    playstyleAr: 'كرة طويلة',
    rating: '88%',
    highlights: ['Traditional shape safety', 'Wide mid fields flat line', 'Physical twin targets'],
    highlightsAr: ['أمان كلاسيكي وثبات في المراكز', 'خطوط وسط عريضة ومستوية', 'صراع بدني وهجوم مبني على الكرات الطولية'],
    counters: ['4-1-4-1', '3-5-2'],
    pros: 'Extreme layout structure and safety against sudden turnovers.',
    prosAr: 'انضباط تكتيكي صارم وثبات مثالي يمنع مفاجآت خسارة الكرة.',
    cons: 'Highly predictable and easily blocked by smart defenders.',
    consAr: 'يسهل توقعه وقراءته وإيقافه بواسطة مدافع متمكن.',
    recommendationLevel: 'beginner'
  }
];

export function getCachedMetaPlans(): MetaPlan[] {
  try {
    const cachedTime = localStorage.getItem('ef26_meta_plans_cache_time');
    const cachedData = localStorage.getItem('ef26_meta_plans_cache_data');
    const now = Date.now();

    if (cachedTime && cachedData && now - parseInt(cachedTime, 10) < 24 * 60 * 60 * 1000) {
      return JSON.parse(cachedData);
    }
  } catch (e) {
    console.warn('Failed to parse cached meta plans:', e);
  }

  // Backup static load and save cache
  localStorage.setItem('ef26_meta_plans_cache_time', Date.now().toString());
  localStorage.setItem('ef26_meta_plans_cache_data', JSON.stringify(META_PLANS));
  return META_PLANS;
}

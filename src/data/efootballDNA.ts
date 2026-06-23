// src/data/efootballDNA.ts

export interface PlaystyleInfo {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  strengthsEn: string[];
  strengthsAr: string[];
}

export interface FormationInfo {
  id: string;
  name: string;
  strengthsEn: string[];
  strengthsAr: string[];
  weaknessesEn: string[];
  weaknessesAr: string[];
}

export const teamPlaystyles: PlaystyleInfo[] = [
  {
    id: 'Possession Game',
    nameEn: 'Possession Game',
    nameAr: 'استحواذ',
    descriptionEn: 'Focus on short pass orchestration, positional dominance, and gradual spaces breakthrough.',
    descriptionAr: 'التركيز على التمريرات القصيرة المتقنة، والسيطرة الميدانية، واختراق المساحات تدريجياً.',
    strengthsEn: ['Patient buildup', 'High possession retention', 'Many passing triangles'],
    strengthsAr: ['البناء المنظم والهادئ', 'نسبة استحواذ عالية', 'كثرة مثلثات التمرير']
  },
  {
    id: 'Quick Counter',
    nameEn: 'Quick Counter',
    nameAr: 'مرتدات سريعة',
    descriptionEn: 'High defensive pressing lines, quick transitions, and instant forward sprints on winning the ball.',
    descriptionAr: 'ضغط دفاعي متقدم، انتقال سريع للغاية من الدفاع للهجوم، والركض المباشر للأمام بمجرد قطع الكرة.',
    strengthsEn: ['Explosive transitions', 'Overwhelming front line presence', 'Forcing opponent mistakes'],
    strengthsAr: ['التحولات الانفجارية الخاطفة', 'تكثيف عددي هجومي', 'إجبار الخصم على ارتكاب الأخطاء']
  },
  {
    id: 'Long Ball Counter',
    nameEn: 'Long Ball Counter',
    nameAr: 'كرة طويلة مضادة',
    descriptionEn: 'Deep defensive block to choke gaps, then striking quickly into vertical space using direct long runs.',
    descriptionAr: 'تراجع دفاعي منظم لإغلاق الثغرات، ثم ضرب دفاعات الخصم بكرات عمودية سريعة بمجرد افتكاك الكرة.',
    strengthsEn: ['Solid compact defense', 'Exploiting high lines', 'Low concession risk'],
    strengthsAr: ['دفاع صلب ومتكتل', 'استغلال تقدم دفاعات الخصم', 'تقليل خطر استقبال الأهداف']
  },
  {
    id: 'Out Wide',
    nameEn: 'Out Wide',
    nameAr: 'لعب على الأطراف',
    descriptionEn: 'Spreading the play laterally, flooding the wings, and sending crosses to physical target men.',
    descriptionAr: 'توسيع رقعة اللعب أفقياً، التركيز على الأطراف والكرات العرضية نحو مهاجمين طوال القامة.',
    strengthsEn: ['Wing overload options', 'Dangerous crossing angles', 'Isolating fullbacks'],
    strengthsAr: ['خلق زيادة عددية على الأطراف', 'عرضيات خطيرة ومتكررة', 'عزل أظهرة الخصم']
  },
  {
    id: 'Long Ball',
    nameEn: 'Long Ball',
    nameAr: 'كرات طويلة',
    descriptionEn: 'Direct bombardment towards a tall target man to secure second balls and bypass complex midfields.',
    descriptionAr: 'الاعتماد على الكرات الطويلة والمباشرة نحو مهاجم محطة (Target Man) لكسب الكرات الثانية وتجاوز ضغط الوسط.',
    strengthsEn: ['Bypass pressing lines', 'Physical aerial dominance', 'Direct playstyle complexity'],
    strengthsAr: ['تجاوز خطوط الضغط بسهولة', 'السيطرة الهوائية والبدنية', 'بساطة اللعب والمباشرة']
  }
];

export const commonFormations: string[] = [
  '4-3-3',
  '4-2-1-3',
  '4-3-1-2',
  '4-2-2-2',
  '4-1-2-3',
  '4-2-3-1',
  '4-4-2',
  '4-1-4-1',
  '3-2-4-1',
  '3-4-3',
  '3-5-2',
  '5-3-2',
  '5-2-3',
  '5-4-1'
];

export const formationStrengths: Record<string, { en: string[]; ar: string[] }> = {
  '4-3-3': {
    en: ['Excellent wing coverage', 'Balanced midfield spacing', 'Great lateral pressing opportunity'],
    ar: ['تغطية ممتازة للأطراف والملعب', 'توازن هائل في خط الوسط', 'فرص ممتازة للضغط الجانبي']
  },
  '4-2-1-3': {
    en: ['Highly creative AMF hub', 'Double DMF shield provides solid base', 'Lethal counter potential'],
    ar: ['وجود صانع ألعاب مبدع ومحوري', 'ثنائي وسط دفاعي يوفر غطاءً ممتازاً', 'مرتدات قاتلة وسريعة']
  },
  '4-2-2-2': {
    en: ['Double CF combination options', 'Compact midfield lines', 'Easy quick passing routes'],
    ar: ['خيارات تبادل مذهلة بين ثنائي الهجوم', 'تقارب خطوط الوسط', 'مسارات تمرير قصيرة وسريعة']
  },
  '4-1-2-3': {
    en: ['Intense offensive pressure', 'Overwhelming of central defenses', 'Double AMF pocket creators'],
    ar: ['ضغط هجومي مكثف ومرعب', 'منطقة العمق تزدحم بصناع الألعاب', 'خلق مساحات خلف المهاجمين']
  },
  '4-4-2': {
    en: ['Ultimate structural balance', 'Flat compact defensive safety', 'Simple and logical build-up'],
    ar: ['التوازن الهيكلي والنموذجي', 'أمان دفاعي بخطوط متراصة', 'بناء لعب بسيط ومنطقي']
  },
  '3-2-4-1': {
    en: ['Incredible central box mastery', 'High possession retention rate', 'Difficult for opponent AMFs'],
    ar: ['سيطرة مطلقة على وسط الملعب', 'قدرة هائلة على الاستحواذ', 'شل حركة صناع ألعاب الخصم']
  },
  '3-4-3': {
    en: ['Maximum lateral overloading potential', 'Very aggressive forward focus', 'Constant crossing pressure'],
    ar: ['قدرة قصوى على تفجير الأطراف', 'ضغط هجومي شرس للغاية', 'عرضيات مستمرة تنهك الخصم']
  },
  '5-3-2': {
    en: ['Impenetrable defensive low block', 'Protected vertical central lanes', 'Wingbacks play as launchpads'],
    ar: ['تكتل دفاعي خرافي ومنظم', 'تأمين كامل لعمق منطقة الجزاء', 'الأظهرة تنطلق كصواريخ مرتدة']
  },
  '5-2-1-2': {
    en: ['Choke interior channels complete', 'AMF links CF run lanes seamlessly', 'High counter security margins'],
    ar: ['سد تام لممرات التمرير البينية', 'صانع الألعاب يغذي المهاجمين بمثالية', 'هامش أمان دفاعي مرتفع جداً']
  },
  '4-3-1-2': {
    en: ['Very strong central midfield possession', 'Short passing combinations inside', 'Saves player stamina'],
    ar: ['استحواذ قوي جداً في عمق الوسط', 'تبادل تمريرات قصيرة وسريعة', 'يوفر طاقة ومجهود اللاعبين البدني']
  },
  '4-2-3-1': {
    en: ['Excellent defense-to-attack shielding', 'Wings can track back effectively', 'Safe passing networks'],
    ar: ['درع دفاعي رائع أمام المهاجمين', 'تراجع فعال للأجنحة للمساندة', 'شبكات تمرير آمنة تضمن السيطرة']
  },
  '4-1-4-1': {
    en: ['Fluid transitions from wide channels', 'Highly flexible defensive lines', 'Compact back block spacing'],
    ar: ['مرونة انتقال سريعة عبر الأجنحة', 'خطوط دفاعية مرنة وسهلة التشكيل', 'تكتل خلفي آمن يمنع الثغرات البينية']
  },
  '3-5-2': {
    en: ['Maximum midfield control and numbers', 'Provides dual-forward pressure', 'Wingbacks dominate play'],
    ar: ['أكبر كثافة عددية في وسط الملعب', 'ضغط مستمر عبر ثنائي الهجوم الصريح', 'سيطرة كاملة وطولية للاعبي الأطراف']
  },
  '5-2-3': {
    en: ['Maximum wide security', 'Front wingers trigger fast counters', 'Unbreakable central defensive wall'],
    ar: ['تأمين دفاعي ممتاز للأطراف والعمق', 'أجنحة هجومية تشن مرتدات نارية خاطفة', 'جدار دفاعي صلب يستعصي اختراقه']
  },
  '5-4-1': {
    en: ['Super fortress defensive block', 'Extremely hard to penetrate centrally', 'Perfect for protecting leads'],
    ar: ['تكتل دفاعي حديدي أشبه بالقلعة حصينة', 'يستعيل اختراقه من العمق أو الأطراف', 'الخيار التكتيكي المثالي لتأمين النصر']
  }
};

export const formationWeaknesses: Record<string, { en: string[]; ar: string[] }> = {
  '4-3-3': {
    en: ['Central interior gap if CMFs push high', 'Single CF can feel isolated on low crosses'],
    ar: ['فجوة في العمق إذا اندفع ثنائي الوسط', 'المهاجم الوحيد قد يعزل أمام المدافعين']
  },
  '4-2-1-3': {
    en: ['Wingers can track back late', 'Wide space gaps behind advancing fullbacks'],
    ar: ['تأخر الأجنحة في المساندة الدفاعية', 'مساحات شاغرة خلف الأظهرة المتقدمة']
  },
  '4-2-2-2': {
    en: ['Exposed wide midfields', 'Requires high stamina for wide CMF/LMF/RMF players'],
    ar: ['الوسط مكشوف جزئياً على الأطراف', 'يتطلب طاقة بدنية خارقة للاعبي الأطراف']
  },
  '4-1-1-4': {
    en: ['Extremely hollow midfield zone', 'High risk of vertical fast breakthroughs'],
    ar: ['وسط الملعب فارغ ومستباح تماماً', 'خطر تدمير الفريق بالمرتدات السريعة']
  },
  '4-4-2': {
    en: ['Vulnerable space between defense and flat midfield', 'Predictable vertical passing lines'],
    ar: ['مساحة مكشوفة بين الدفاع والوسط', 'يسهل توقع مسارات التمرير العمودية']
  },
  '4-3-1-2': {
    en: ['Lack of natural wing play', 'Fullbacks must provide width and deplete stamina'],
    ar: ['غياب تام للأجنحة الهجومية التقليدية', 'يُجبر أظهرة الجنب على الاندفاع حد الاستنزاف']
  },
  '4-2-3-1': {
    en: ['Lone striker can become isolated', 'Requires highly creative AMF to orchestrate'],
    ar: ['المهاجم الوحيد قد ينعزل أمام المدافعين', 'يحتاج صانع ألعاب خارق لابتكار لغة الهجوم']
  },
  '4-1-4-1': {
    en: ['Slower counter deployment', 'Heavy physical load on single anchor man DMF'],
    ar: ['بطء تدريجي في تفعيل الهجمات المرتدة', 'حمل بدني هائل وضغط مستمر على لاعب DMF الوحيد']
  },
  '4-1-2-3': {
    en: ['Vulnerable to counter counter-attacks', 'Only one defensive shield in midfield'],
    ar: ['سهل استهداف وسطك بالمرتدات المعاكسة', 'وجود لاعب ارتكاز وحيد يسهل تجاوزه']
  },
  '3-2-4-1': {
    en: ['Huge space gaps behind wingers', 'Defense must be extremely fast to cover broad edges'],
    ar: ['مساحات شاسعة مكشوفة خلف لاعبي الجنب', 'يفرض على مدافعي الأطراف سرعة قياسية للتغطية']
  },
  '3-4-3': {
    en: ['Extremely open to side attacks', 'Huge physical strain on wide midfielders'],
    ar: ['منطقة الأطراف مكشوفة تماماً ومستهدفة', 'تعب عضلي هائل للاعبي خط الوسط الجانبيين']
  },
  '3-5-2': {
    en: ['Side defense completely dependent on LWB/RWB tracking speed', 'Can face central crowd bottlenecks'],
    ar: ['الأطراف معتمدة كلياً على سرعة ارتداد الأظهرة', 'سهل الوقوع في فخ التكدس وضيق المساحات بالوسط']
  },
  '5-3-2': {
    en: ['Stretches wingbacks thin', 'Lacks native threat in high wing zones'],
    ar: ['إرهاق بدني شديد لأظهرة الجنب', 'ضعف هجومي في الزوايا المتقدمة للأطراف']
  },
  '5-2-3': {
    en: ['Midfield numbers are easily overwhelmed', 'Wingers can neglect defensive duties'],
    ar: ['سهولة خسارة معركة الاستحواذ بالوسط لقلة العدد', 'تجاهل الأجنحة المستمر للأدوار والواجبات الدفاعية']
  },
  '5-4-1': {
    en: ['Striker is completely isolated', 'Hard to construct build-up from deep zones on stress'],
    ar: ['رأس الحربة معزول ومنقطع الصلة بالفريق تماماً', 'صعوبة بالغة في بناء الهجمة وتدرجها تحت الضغط']
  }
};

export interface TacticalFix {
  problemEn: string;
  problemAr: string;
  recommendedPlaystyle: string;
  recommendedFormations: string[];
  defensiveFixEn: string;
  defensiveFixAr: string;
  attackingFixEn: string;
  attackingFixAr: string;
  suggestedInstructions: string[];
  suggestedInstructionsAr: string[];
}

export const problemToTacticalFixMap: Record<string, TacticalFix> = {
  'midfield_lost': {
    problemEn: 'Losing custody of midfield',
    problemAr: 'بخسر نص الملعب',
    recommendedPlaystyle: 'Possession Game',
    recommendedFormations: ['4-2-2-2', '3-2-4-1', '4-2-1-3'],
    defensiveFixEn: 'Assign Anchor Man instructions to your deepest DMF to prevent vacating position.',
    defensiveFixAr: 'ضع تعليمات الارتكاز (Anchor Man) لـ DMF لمنع تقدمه والتزامه بالعمق.',
    attackingFixEn: 'Utilize compact passing channels. Turn on "Deep Line" instruction to support buildup.',
    attackingFixAr: 'استغل تمريرات العمق الوجيزة، واستدعي لاعبي الوسط لتسلم الكرة بـ "Deep Line".',
    suggestedInstructions: ['Defensive (on DMF)', 'Deep Line (on CMF)'],
    suggestedInstructionsAr: ['دفاعي (على الارتكاز DMF)', 'خط عميق (على الـ CMF)']
  },
  'conceding_counters': {
    problemEn: 'Constantly conceding counters',
    problemAr: 'بستقبل مرتدات',
    recommendedPlaystyle: 'Long Ball Counter',
    recommendedFormations: ['5-3-2', '4-2-2-2', '5-2-1-2'],
    defensiveFixEn: 'Set "Deep Defensive Line" or apply "Defensive" individual instruction on fullbacks.',
    defensiveFixAr: 'عيّن تعليمات "دفاعي" لأظهرة الجنب (LB/RB) ليظلوا في الخلف بشكل مستمر.',
    attackingFixEn: 'Avoid over-ambitious offensive fullbacks. Keep attack levels balanced.',
    attackingFixAr: 'تجنب الاندفاع الكامل للأظهرة الهجومية، وحافظ على مستوى توازن هجومي معتدل.',
    suggestedInstructions: ['Defensive (on RB)', 'Defensive (on LB)'],
    suggestedInstructionsAr: ['دفاعي (على الظهير الأيمن RB)', 'دفاعي (على الظهير الأيسر LB)']
  },
  'cannot_score': {
    problemEn: 'Unable to penetrate opponent defense',
    problemAr: 'مش بعرف أوصل للمرمى',
    recommendedPlaystyle: 'Quick Counter',
    recommendedFormations: ['4-2-1-3', '4-1-2-3', '3-4-3'],
    defensiveFixEn: 'Use high pressing lines but ensure center backs remain tightly coupled.',
    defensiveFixAr: 'اضغط دفاعياً بشكل متقدم ولكن أبقِ قلبي الدفاع متقاربين للغاية.',
    attackingFixEn: 'Activate "Offensive" instruction on fullbacks or "Ankerman" to unleash wide wingers.',
    attackingFixAr: 'شغل تعليمات هجومية إضافية، واعتمد على صانع ألعاب كلاسيكي رقم 10 في العمق.',
    suggestedInstructions: ['Counter Target (on CF)', 'Offensive (on fullbacks)'],
    suggestedInstructionsAr: ['هدف المرتدة (على رأس الحربة CF)', 'هجومي (على أظهرة الجنب)']
  },
  'weak_wings': {
    problemEn: 'Wings feel vulnerable and weak',
    problemAr: 'الأطراف ضعيفة',
    recommendedPlaystyle: 'Out Wide',
    recommendedFormations: ['4-3-3', '3-4-3', '4-2-2-2'],
    defensiveFixEn: 'Apply "Defensive" instructions to fullbacks or use LMF/RMF in back-tracking duties.',
    defensiveFixAr: 'ضع تعليمات "دفاعي" للظهير الأضعف، واطلب من LMF التراجع عند فقدان الكرة.',
    attackingFixEn: 'Activate "Hug the Sideline" instruction to stretch opponent spacing laterally.',
    attackingFixAr: 'قم بتفعيل "التزام خط التماس" لتوسيع الملعب وإرهاق تكتل الخصم الدفاعي.',
    suggestedInstructions: ['Hug the Sideline', 'Defensive (on weak side fullback)'],
    suggestedInstructionsAr: ['التزام خط التماس', 'دفاعي (على الظهير الأقل سرعة)']
  },
  'leaky_defense': {
    problemEn: 'Defense easily breaks open',
    problemAr: 'الدفاع بيتفتح',
    recommendedPlaystyle: 'Long Ball Counter',
    recommendedFormations: ['5-3-2', '5-2-1-2', '4-2-2-2'],
    defensiveFixEn: 'Set defensive instruction on BOTH non-offensive fullbacks. Set "Deep Line" on deep pivot.',
    defensiveFixAr: 'ضع "دفاعي" لظهيرين الجنب معاً، واضبط خط الارتكاز ليكون "Deep Line" كقلب دفاع ثالث.',
    attackingFixEn: 'Rely on fast vertical long-range passes for low-risk buildup.',
    attackingFixAr: 'اعتمد على التمرير العمودي الخاطف والمباشر دون الاحتفاظ الزائد بالكرة في الخلف.',
    suggestedInstructions: ['Defensive (on LB)', 'Defensive (on RB)', 'Deep Line (on DMF)'],
    suggestedInstructionsAr: ['دفاعي (على LB)', 'دفاعي (على RB)', 'خط دفاعي عميق (على DMF)']
  },
  'isolated_forward': {
    problemEn: 'Main striker isolated and toothless',
    problemAr: 'المهاجم معزول',
    recommendedPlaystyle: 'Quick Counter',
    recommendedFormations: ['4-2-2-2', '4-2-1-3', '5-2-1-2'],
    defensiveFixEn: 'Apply "Counter Target" on CF so he remains high and avoids stamina-drain tracking back.',
    defensiveFixAr: 'ضع تعليمات "هدف المرتدة" (Counter Target) على رأس الحربة لمنع تراجعه والحفاظ على لياقته.',
    attackingFixEn: 'Add active running links, and use a productive SS/AMF to bridge spacing gaps.',
    attackingFixAr: 'أضف شريك هجومي صانع ألعاب (AMF) أو مهاجم ثانٍ (SS) لتقليل المسافة عن المرمى.',
    suggestedInstructions: ['Counter Target (on CF)', 'Offensive (on AMF)'],
    suggestedInstructionsAr: ['هدف المرتدة (على CF)', 'هجومي (على صانع الألعاب AMF)']
  },
  'random_pressing': {
    problemEn: 'Pressing feels unorganized and chaotic',
    problemAr: 'الضغط عندي عشوائي',
    recommendedPlaystyle: 'Quick Counter',
    recommendedFormations: ['4-3-3', '4-2-1-3'],
    defensiveFixEn: 'Manually contain rather than double pressing blindly. Keep active midfielders in passing lanes.',
    defensiveFixAr: 'قم بالضغط الموجه والتحكم اليدوي بلاعبيك بدل الضغط التلقائي الذي يفتح فجوات قاتلة.',
    attackingFixEn: 'Push counter targets early to exploit defensive disorganization of the opponent.',
    attackingFixAr: 'استغل افتكاك الكرة في مناطق متقدمة عن طريق تدوير الكرة سريعاً نحو الأجنحة.',
    suggestedInstructions: ['Counter Target (on SS/CF)', 'Defensive (on DMF)'],
    suggestedInstructionsAr: ['هدف المرتدة (على CF)', 'دفاعي (على الارتكاز DMF)']
  }
};

export const playstyleCompatibility: Record<string, { goodWith: string[]; badWith: string[] }> = {
  'Possession Game': {
    goodWith: ['Orchestrator CMF', 'Creative Playmaker AMF', 'Deep-Lying Forward CF'],
    badWith: ['Goal Poacher (will waste build-up timing)', 'Dummy Runner (can disrupt positioning triangles)']
  },
  'Quick Counter': {
    goodWith: ['Goal Poacher CF', 'Hole Player AMF', 'Box-to-Box CMF'],
    badWith: ['Classic No. 10 (lacks stamina & mobility for dynamic transition sprints)']
  },
  'Long Ball Counter': {
    goodWith: ['Goal Poacher CF', 'Anchor Man DMF', 'Build-Up CB'],
    badWith: ['Extra Frontman CB (risky exposure of defensive compact block)', 'Classic No. 10']
  },
  'Out Wide': {
    goodWith: ['Cross Specialist LMF/RMF/LWF/RWF', 'Target Man CF', 'Offensive Fullback RB/LB'],
    badWith: ['Creative Playmaker on wings (tends to cut inside too early, failing to cross)']
  },
  'Long Ball': {
    goodWith: ['Target Man CF', 'Anchor Man DMF', 'Defensive Fullback'],
    badWith: ['Orchestrator CMF (bypassed entirely in long ball bombarding)']
  }
};

export const individualInstructionRules = [
  {
    instruction: 'Counter Target',
    arabic: 'هدف المرتدة',
    type: 'Attacking',
    explanationEn: 'The selected player remains forward near opponent penalty box instead of tracking back on defense.',
    explanationAr: 'يظل اللاعب في مناطق متقدمة دائماً على حدود دفاع الخصم ولا يعود للمساندة الدفاعية مطلقا لحفظ مخزون stamina.'
  },
  {
    instruction: 'Anchoring',
    arabic: 'التثبيت الموقعي',
    type: 'Attacking',
    explanationEn: 'The player is restricted from moving laterally across pitch, remaining locked in their native channel.',
    explanationAr: 'يُمنع اللاعب من الحركة العرضية ويلتزم بمكانه الطولي تماماً للحفاظ على الهيكل التكتيكي.'
  },
  {
    instruction: 'Deep Line',
    arabic: 'خط دفاعي عميق',
    type: 'Defensive',
    explanationEn: 'The midfielder drops deep into the defensive backline when out of possession, creating a central wall.',
    explanationAr: 'يتراجع لاعب خط الوسط المستهدف ليلعب كقلب دفاع إضافي أثناء غياب الاستحواذ لمنع الثغرات.'
  },
  {
    instruction: 'Defensive',
    arabic: 'دفاعي',
    type: 'Defensive',
    explanationEn: 'The player (typically fullback or midfielder) stays back and rejects moving forward during attacks.',
    explanationAr: 'يمتنع اللاعب (غالباً ظهير جنب أو لاعب وسط) عن التقدم تماماً هجومياً لتأمين الدفاع ضد المرتدات.'
  }
];

export const counterFormationRules: Record<string, string> = {
  '4-3-3': '4-2-2-2 (Cuts lateral wings via compact mid block)',
  '4-2-1-3': '5-3-2 (Suffocates forward trio and nullifies AMF space)',
  '4-2-2-2': '4-1-2-3 (Overwhelms the double-pivot block through vertical AMF triangles)',
  '4-4-2': '4-2-1-3 (AMF occupies gap behind double forwards to dismantle defensive line)',
  '3-2-4-1': '4-3-3 (Exposes the wide open flanks behind high midfield block)',
  '3-4-3': '5-3-2 (Drowns wingers inside complete 5-man defense wall)',
  '5-3-2': '4-2-1-3 (Exploits low tempo pass blocks with aggressive front presence)',
  '5-2-1-2': '3-2-4-1 (Overwhelms the defensive central low core)'
};

export const beginnerFriendlyLabels: Record<string, string> = {
  'Momentum Diagnostic': 'سبب فقدان السيطرة',
  'Sub-Tactics Optimizer': 'تعديل سريع للخطة',
  'Meta Counter': 'خطة ضد خصم',
  'Performance Insights': 'تحسين مستواك',
  'Cloud Sync': 'حفظ أونلاين'
};

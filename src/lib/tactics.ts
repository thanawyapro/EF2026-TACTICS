export interface PlayerNode {
  r: string; // role
  x: number; // percentage (2-98)
  y: number; // percentage (2-98)
}

export interface PresetFormationCoords {
  [key: string]: PlayerNode[];
}

export interface TacticalProfile {
  id: string;
  name: string;
  formation: string;
  playstyle: string;
  details: string;
  isCustom?: boolean;
  subTactics?: string[];
}

export interface MetaFormation {
  id: string;
  name: string;
  popularity: string;
  dangerDesc: string;
  counterForm: string;
  preMatchSettings: string;
  inGameAdj: string;
}

export const FORMATIONS = [
  '4-3-3', '4-2-1-3', '4-3-1-2', '4-2-2-2', '4-1-2-3', '4-2-3-1', 
  '4-4-2', '4-1-4-1', '3-2-4-1', '3-4-3', '3-5-2', '5-3-2', '5-2-3', '5-4-1'
];

export const COORDS: PresetFormationCoords = {
  '4-3-3': [{r:'GK',x:50,y:90},{r:'LB',x:15,y:75},{r:'CB',x:38,y:78},{r:'CB',x:62,y:78},{r:'RB',x:85,y:75},{r:'DMF',x:50,y:58},{r:'CM',x:28,y:45},{r:'CM',x:72,y:45},{r:'LW',x:20,y:20},{r:'RW',x:80,y:20},{r:'CF',x:50,y:15}],
  '4-2-1-3': [{r:'GK',x:50,y:90},{r:'LB',x:15,y:75},{r:'CB',x:38,y:78},{r:'CB',x:62,y:78},{r:'RB',x:85,y:75},{r:'DMF',x:35,y:60},{r:'DMF',x:65,y:60},{r:'AMF',x:50,y:42},{r:'LWF',x:20,y:20},{r:'RWF',x:80,y:20},{r:'CF',x:50,y:15}],
  '4-3-1-2': [{r:'GK',x:50,y:90},{r:'LB',x:15,y:75},{r:'CB',x:38,y:78},{r:'CB',x:62,y:78},{r:'RB',x:85,y:75},{r:'DMF',x:50,y:62},{r:'CM',x:28,y:52},{r:'CM',x:72,y:52},{r:'AMF',x:50,y:38},{r:'CF',x:35,y:18},{r:'CF',x:65,y:18}],
  '4-2-2-2': [{r:'GK',x:50,y:90},{r:'LB',x:15,y:75},{r:'CB',x:38,y:78},{r:'CB',x:62,y:78},{r:'RB',x:85,y:75},{r:'DMF',x:35,y:58},{r:'DMF',x:65,y:58},{r:'AMF',x:28,y:40},{r:'AMF',x:72,y:40},{r:'CF',x:35,y:18},{r:'CF',x:65,y:18}],
  '4-1-2-3': [{r:'GK',x:50,y:90},{r:'LB',x:15,y:75},{r:'CB',x:38,y:78},{r:'CB',x:62,y:78},{r:'RB',x:85,y:75},{r:'DMF',x:50,y:62},{r:'AMF',x:32,y:45},{r:'AMF',x:68,y:45},{r:'LWF',x:20,y:20},{r:'RWF',x:80,y:20},{r:'CF',x:50,y:15}],
  '4-2-3-1': [{r:'GK',x:50,y:90},{r:'LB',x:15,y:75},{r:'CB',x:38,y:78},{r:'CB',x:62,y:78},{r:'RB',x:85,y:75},{r:'DMF',x:35,y:60},{r:'DMF',x:65,y:60},{r:'AMF',x:20,y:42},{r:'AMF',x:50,y:38},{r:'AMF',x:80,y:42},{r:'CF',x:50,y:18}],
  '4-4-2': [{r:'GK',x:50,y:90},{r:'LB',x:15,y:75},{r:'CB',x:38,y:78},{r:'CB',x:62,y:78},{r:'RB',x:85,y:75},{r:'LM',x:18,y:48},{r:'CM',x:38,y:55},{r:'CM',x:62,y:55},{r:'RM',x:82,y:48},{r:'CF',x:35,y:18},{r:'CF',x:65,y:18}],
  '4-1-4-1': [{r:'GK',x:50,y:90},{r:'LB',x:15,y:75},{r:'CB',x:38,y:78},{r:'CB',x:62,y:78},{r:'RB',x:85,y:75},{r:'DMF',x:50,y:62},{r:'LM',x:18,y:45},{r:'LCM',x:35,y:48},{r:'RCM',x:65,y:48},{r:'RM',x:82,y:45},{r:'CF',x:50,y:18}],
  '3-2-4-1': [{r:'GK',x:50,y:90},{r:'CB',x:25,y:78},{r:'CB',x:50,y:80},{r:'CB',x:75,y:78},{r:'DMF',x:35,y:62},{r:'DMF',x:65,y:62},{r:'AMF',x:20,y:42},{r:'AMF',x:38,y:38},{r:'AMF',x:62,y:38},{r:'AMF',x:80,y:42},{r:'CF',x:50,y:15}],
  '3-4-3': [{r:'GK',x:50,y:90},{r:'CB',x:25,y:78},{r:'CB',x:50,y:80},{r:'CB',x:75,y:78},{r:'LMF',x:15,y:52},{r:'CMF',x:38,y:58},{r:'CMF',x:62,y:58},{r:'RMF',x:85,y:52},{r:'LWF',x:20,y:22},{r:'RWF',x:80,y:22},{r:'CF',x:50,y:18}],
  '3-5-2': [{r:'GK',x:50,y:90},{r:'CB',x:25,y:78},{r:'CB',x:50,y:80},{r:'CB',x:75,y:78},{r:'LMF',x:15,y:52},{r:'DMF',x:50,y:62},{r:'CM',x:32,y:48},{r:'CM',x:68,y:48},{r:'RMF',x:85,y:52},{r:'CF',x:35,y:18},{r:'CF',x:65,y:18}],
  '5-3-2': [{r:'GK',x:50,y:90},{r:'LWB',x:15,y:72},{r:'CB',x:32,y:78},{r:'CB',x:50,y:80},{r:'CB',x:68,y:78},{r:'RWB',x:85,y:72},{r:'LCM',x:30,y:55},{r:'DMF',x:50,y:60},{r:'RCM',x:70,y:55},{r:'CF',x:35,y:18},{r:'CF',x:65,y:18}],
  '5-2-3': [{r:'GK',x:50,y:90},{r:'LWB',x:15,y:72},{r:'CB',x:32,y:78},{r:'CB',x:50,y:80},{r:'CB',x:68,y:78},{r:'RWB',x:85,y:72},{r:'CMF',x:35,y:55},{r:'CMF',x:65,y:55},{r:'LWF',x:18,y:22},{r:'RWF',x:82,y:22},{r:'CF',x:50,y:18}],
  '5-4-1': [{r:'GK',x:50,y:90},{r:'LWB',x:15,y:72},{r:'CB',x:32,y:78},{r:'CB',x:50,y:80},{r:'CB',x:68,y:78},{r:'RWB',x:85,y:72},{r:'LMF',x:18,y:48},{r:'CMF',x:38,y:55},{r:'CMF',x:62,y:55},{r:'RMF',x:82,y:48},{r:'CF',x:50,y:18}]
};

export const DEFAULT_PROFILES: TacticalProfile[] = [
  { id: '1', name: '⚔️ ANTI-META DESTROYER', formation: '4-3-3', playstyle: 'Counter Attack', details: 'Built strictly to choke 4-2-2-2 long-balls with physical holding DMFs.', isCustom: false, subTactics: ['Counter Target', 'Deep Defensive Line'] },
  { id: '2', name: '🏃 LIGHTNING COUNTER', formation: '4-1-4-1', playstyle: 'Counter Attack', details: 'Triggers lightning wing runs upon dispossession.', isCustom: false, subTactics: ['Early Cross', 'Gegenpress'] },
  { id: '3', name: '🧱 FORTRESS DEFENSE', formation: '5-3-2', playstyle: 'Park the Bus', details: 'Ultimate low block to safeguard hard-earned leads.', isCustom: false, subTactics: ['Deep Defensive Line', 'Tiki-Taka'] },
  { id: '4', name: '🌊 TIKI-TAKA MASTER', formation: '4-3-3', playstyle: 'Possession', details: 'High focus on fluid pass-and-move triangulations.', isCustom: false, subTactics: ['Tiki-Taka', 'False 9'] },
  { id: '5', name: '🔥 HIGH PRESS MACHINE', formation: '4-2-3-1', playstyle: 'High Press', details: 'High-octane central trapping layout that suffocates playmakers.', isCustom: false, subTactics: ['Gegenpress', 'Heavy Press'] }
];

export const META_FORMATIONS: MetaFormation[] = [
  { id: '1', name: '4-2-2-2 Long Ball Spam', popularity: '85%', dangerDesc: 'Excessive high passes bypass standard wingers. Forces physical forwards into headers.', counterForm: '4-1-4-1', preMatchSettings: 'Tight mark their forward spearhead. Adjust central back to Anchor Man.', inGameAdj: 'Set sub-tactics to Gegenpress min 60. Lower defense depth.' },
  { id: '2', name: '4-1-2-1-2 Through-Ball Loop', popularity: '70%', dangerDesc: 'Overwhelms deep defensive layers with agile AMF spatial loops.', counterForm: '4-3-3', preMatchSettings: 'Tight mark their playmaker. Keep central DMF block tight.', inGameAdj: 'Switch to lateral transition routes. Attack through wide wings.' },
  { id: '3', name: '3-4-2-1 Ultra Defensive Low-Block', popularity: '65%', dangerDesc: 'Cajoles attackers into narrow bottleneck blocks. Chokes wing play.', counterForm: '4-2-4', preMatchSettings: 'Use high pressing support. Spread side forwards wide.', inGameAdj: 'Turn on Early Cross. Shoot immediately upon entering final third.' },
  { id: '4', name: '4-3-3 Intense Pressing Machine', popularity: '55%', dangerDesc: 'High frontline trapping causes pass tag latency and errors.', counterForm: '4-5-1', preMatchSettings: 'Set holding midfielders to build-up roles.', inGameAdj: 'Slow pass tempos across back line to disorganize their forwards.' },
  { id: '5', name: '5-3-2 Ultimate Lead Protect Block', popularity: '45%', dangerDesc: 'Solid low block that prevents pass lines inside the penalty box.', counterForm: '3-4-2-1', preMatchSettings: 'Set high wingbacks. Allow center backs to join attack.', inGameAdj: 'Force long distance power shots. Utilize set-pieces loops.' }
];

export const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    app_name: 'EF26 Tactics',
    dashboard: 'Dashboard',
    match_report: 'Match Reports',
    tactics_generator: 'AI Coach',
    meta_counter: 'Meta Counter',
    sub_tactics: 'Sub-Tactics',
    quick_profiles: 'Quick Profiles',
    performance_tracker: 'Performance Tracker',
    momentum_diagnostic: 'Momentum Diagnostic',
    cloud_sync: 'Cloud & Sync',
    app_settings: 'App Settings',
    welcome_back: 'Welcome Back, Captain',
    tactical_analysis: 'eFootball Elite Tactical HQ — Tactical analysis & patterns diagnostic',
    theme_accent: 'Theme Accent Color',
    backup_operations: 'Backup & Operations',
    export_data: 'Export Data',
    import_data: 'Import Data',
    hard_reset: 'Hard Reset App',
    language: 'App Interface Language',
    recent_results: 'Recent match results',
    win_rate: 'Win Rate',
    active_trend: 'Active Trend',
    best_formation: 'Best Formation',
    matches_analyzed: 'Matches Analyzed',
    meta_warning: 'Current Meta Alert:',
    neural_counter: 'Rules-Based Counter Engine',
    gemini_counter: 'Gemini Counter Analyzer',
    optimize_squad: 'Optimize Squad Parameters',
    script_title: 'Match Momentum Analyzer',
    playbook: 'Animated Tactical Playbook',
    playbook_desc: 'Dynamic movement path simulator for customized eFootball roles',
    b2b_midfielder: 'Box-to-Box Midfielder',
    inverted_fullback: 'Inverted Fullback',
    anchor_man: 'Anchor Man',
    goal_poacher: 'Goal Poacher',
    creative_playmaker: 'Creative Playmaker',
    roaming_winger: 'Roaming Winger',
    custom_formation: 'Custom Formations',
    custom_formation_desc: 'Manually drag-and-drop positions to configure custom eFootball layouts',
    drag_instructions: 'Drag player nodes to relocate them. Select a player to change their role.',
    save_custom: 'Save Custom Overrides',
    reset_custom: 'Reset to Factory Defaults',
    reset_all_custom: 'Reset All Formations',
    select_formation_to_edit: 'Select Formation to Customize',
    revert_success: 'Player position reverted to layout preset standards',
    undo_success: 'Reverted last configuration change'
  },
  ar: {
    app_name: 'تكتيكات إي فوتبول ٢٦',
    dashboard: 'لوحة التحكم',
    match_report: 'تقارير المباريات',
    tactics_generator: 'المدرب الذكي',
    meta_counter: 'مضاد التكتيكات الشائعة',
    sub_tactics: 'التكتيكات الفرعية',
    quick_profiles: 'الملفات التكتيكية السريعة',
    performance_tracker: 'متابع الأداء بالرسومات',
    momentum_diagnostic: 'تشخيص الزخم ومعدل التحكم',
    cloud_sync: 'النسخ السحابي والربط',
    app_settings: 'الإعدادات الهامة',
    welcome_back: 'مرحباً بعودتك، كابتن الفريق',
    tactical_analysis: 'المكتب الفني لنخبة إي فوتبول - تحليلات الأنماط والتحكم بالملعب',
    theme_accent: 'لون واجهة المظهر',
    backup_operations: 'عمليات النسخ والتحميل',
    export_data: 'تصدير البيانات التكتيكية',
    import_data: 'استيراد البيانات الخارجية',
    hard_reset: 'إعادة تهيئة التطبيق كليا',
    language: 'لغة واجهة التطبيق',
    recent_results: 'نتائج المباريات الأخيرة',
    win_rate: 'معدل الانتصارات',
    active_trend: 'المنحنى النشط حاليا',
    best_formation: 'أفضل خطة للعب',
    matches_analyzed: 'المباريات التي تم تحليلها',
    meta_warning: 'تنبيه ميتا اللعبة الحالي:',
    neural_counter: 'محرك التحليل الممنهج',
    gemini_counter: 'محلل جيمني للثغرات التكتيكية',
    optimize_squad: 'تحسين معايير الفريق والمراكز',
    script_title: 'محلل زخم ومعدل التحكم بالمباراة',
    playbook: 'شرح تكتيكات تحركات اللاعبين',
    playbook_desc: 'محاكاة تفاعلية لمهاجمين وخطوط وسط ودفاع اللعبة لتوفير مساحات للتمرير',
    b2b_midfielder: 'لاعب وسط من صندوق وصندوق',
    inverted_fullback: 'ظهير عكسي داخل العمق',
    anchor_man: 'لاعب ارتكاز دفاعي صلب',
    goal_poacher: 'قناص أهداف في الصندوق',
    creative_playmaker: 'صانع ألعاب تكتيكي مبتكر',
    roaming_winger: 'جناح متحرك حر لقطع العمق',
    custom_formation: 'الخطط والخرائط المخصصة',
    custom_formation_desc: 'اسحب الرموز يدويًا لضبط مراكز التشكيلة كما تريد بالملعب',
    drag_instructions: 'اسحب أي لاعب لتغيير مكانه. اضغط عليه لتغيير دوره أو مركز لعبه.',
    save_custom: 'حفظ التعديلات الخاصة بالتوزيع الحالي',
    reset_custom: 'استرجاع التوزيع الأصلي الحالي',
    reset_all_custom: 'تصفير كل تعديلات خرائط الخطط',
    select_formation_to_edit: 'اختر التوزيع التكتيكي لتعديله المباشر',
    revert_success: 'تم إرجاع اللاعب لمركزه الافتراضي لنمط الخطة بنجاح',
    undo_success: 'تم التراجع عن حركة التعديل الأخيرة على الملعب بنجاح'
  }
};

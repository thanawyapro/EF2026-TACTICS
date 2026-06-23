// src/lib/planBuilder.ts

import { 
  problemToTacticalFixMap, 
  teamPlaystyles, 
  formationStrengths, 
  formationWeaknesses,
  playstyleCompatibility,
  individualInstructionRules
} from '../data/efootballDNA';

export interface GeneratedPlan {
  name: string;
  formation: string;
  playstyle: string;
  playstyleAr: string;
  defensiveIdea: string;
  defensiveIdeaAr: string;
  attackingIdea: string;
  attackingIdeaAr: string;
  individualInstructions: string[];
  individualInstructionsAr: string[];
  roleRecommendations: string[];
  roleRecommendationsAr: string[];
  whatToAvoid: string;
  whatToAvoidAr: string;
  whenToSwitchSubTactic: string;
  whenToSwitchSubTacticAr: string;
  explanation: string;
  explanationAr: string;
}

export const buildPlanDeterministically = (
  userPlaystyleInput: string,
  userProblemInput: string
): GeneratedPlan => {
  // Resolve playstyle
  let playstyle = 'Quick Counter';
  let playstyleAr = 'مرتدات سريعة';

  if (userPlaystyleInput === 'مش عارف، اختار لي' || userPlaystyleInput === 'unsure') {
    // Determine playstyle based on the problem
    if (userProblemInput === 'conceding_counters' || userProblemInput === 'leaky_defense') {
      playstyle = 'Long Ball Counter';
      playstyleAr = 'كرة طويلة مضادة';
    } else if (userProblemInput === 'midfield_lost') {
      playstyle = 'Possession Game';
      playstyleAr = 'استحواذ';
    } else if (userProblemInput === 'weak_wings') {
      playstyle = 'Out Wide';
      playstyleAr = 'لعب على الأطراف';
    } else {
      playstyle = 'Quick Counter';
      playstyleAr = 'مرتدات سريعة';
    }
  } else {
    const matchedStyle = teamPlaystyles.find(
      p => p.id === userPlaystyleInput || p.nameAr === userPlaystyleInput || p.nameEn === userPlaystyleInput
    );
    if (matchedStyle) {
      playstyle = matchedStyle.id;
      playstyleAr = matchedStyle.nameAr;
    }
  }

  // Resolve problem mapping
  // Map friendly localized Arabic strings to core keys if received
  let problemKey = userProblemInput;
  if (userProblemInput === 'بخسر نص الملعب') problemKey = 'midfield_lost';
  else if (userProblemInput === 'بستقبل مرتدات') problemKey = 'conceding_counters';
  else if (userProblemInput === 'مش بعرف أوصل للمرمى') problemKey = 'cannot_score';
  else if (userProblemInput === 'الأطراف ضعيفة') problemKey = 'weak_wings';
  else if (userProblemInput === 'الدفاع بيتفتح') problemKey = 'leaky_defense';
  else if (userProblemInput === 'المهاجم معزول') problemKey = 'isolated_forward';
  else if (userProblemInput === 'الضغط عندي عشوائي') problemKey = 'random_pressing';
  else if (userProblemInput === 'مش عارف أختار تعليمات فردية' || userProblemInput === 'unsure_instructions') problemKey = 'midfield_lost';

  const fix = problemToTacticalFixMap[problemKey] || problemToTacticalFixMap['midfield_lost'];

  // Formation
  // Get first recommended formation, or safe default
  const formation = fix.recommendedFormations[0] || '4-2-2-2';

  // Compatible card roles
  const compatibility = playstyleCompatibility[playstyle] || playstyleCompatibility['Quick Counter'];
  const goodRolesEn = compatibility.goodWith.join(', ');
  const goodRolesAr = playstyle === 'Possession Game' 
    ? 'صانع ألعاب خلاق (Creative Playmaker)، لاعب وسط منظم (Orchestrator)، مهاجم وهمي/محطة متراجع'
    : playstyle === 'Quick Counter'
    ? 'قناص كلاسيكي (Goal Poacher)، لاعب وسط من الصندوق للصندوق (Box-to-Box)، لاعب وسط مخترق (Hole Player)'
    : playstyle === 'Long Ball Counter'
    ? 'قناص مساحات (Goal Poacher)، لاعب ارتكاز دفاعي (Anchor Man)، مدافع بناء لعب (Build Up CB)'
    : 'جناح تقليدي عريض للكرات العرضية، خط وسط هجومي مخترق';

  const badRolesEn = compatibility.badWith.join(', ');
  const badRolesAr = playstyle === 'Possession Game'
    ? 'تجنب المهاجم الكلاسيكي الذي لا يمرر، وتجنب قلوب الدفاع المندفعين'
    : playstyle === 'Quick Counter'
    ? 'تجنب صناع اللعب الكلاسيكيين (No. 10) لغياب مجهود الركض والضغط السريع'
    : 'تجنب قلوب الدفاع المغامرين (Extra Frontman) لعدم كسر كتل التراجع الدفاعي';

  const name = `EF26 ${playstyleAr} Preset`;

  return {
    name,
    formation,
    playstyle,
    playstyleAr,
    defensiveIdea: `Form a tidy structure. ${fix.defensiveFixEn}`,
    defensiveIdeaAr: `حافظ على التماسك والارتداد السريع. ${fix.defensiveFixAr}`,
    attackingIdea: `Build quick networks. ${fix.attackingFixEn}`,
    attackingIdeaAr: `وزع الكرات بذكاء في نصف ملعب الخصم. ${fix.attackingFixAr}`,
    individualInstructions: fix.suggestedInstructions,
    individualInstructionsAr: fix.suggestedInstructionsAr,
    roleRecommendations: compatibility.goodWith,
    roleRecommendationsAr: goodRolesAr.split('، '),
    whatToAvoid: `Don't rush defense. Avoid: ${badRolesEn}`,
    whatToAvoidAr: `تجنب التسرع في اندفاع قلوب الدفاع للتغطية العشوائية. ${badRolesAr}`,
    whenToSwitchSubTactic: `Switch to Defensive sub-tactic when defending a 1-goal margin after the 70th minute.`,
    whenToSwitchSubTacticAr: `قم بتحويل الخطة لـ Sub-Tactic هادئة ودفاعية لتأمين النتيجة عند التقدم بفارق هدف وحيد بعد الدقيقة 70.`,
    explanation: `Perfect customized strategy for playing eFootball. Combining ${formation} spacing parameters with ${playstyle} setup maximizes passing triangles.`,
    explanationAr: `استراتيجية مثالية مبنية تكتيكياً خصيصاً للتغلب على المشكلة الأساسية. التشكيل المقابل ${formation} مع أسلوب ${playstyleAr} يمنحك التوازن والسيطرة على المساحات الضائعة.`
  };
};

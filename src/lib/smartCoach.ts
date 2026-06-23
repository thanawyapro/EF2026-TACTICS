// src/lib/smartCoach.ts

import { validatePlan } from './tacticValidation';
import { buildPlanDeterministically } from './planBuilder';
import { problemToTacticalFixMap } from '../data/efootballDNA';

export interface SmartCoachResponse {
  problem: string;
  likelyReason: string;
  coachDecision: string;
  recommendedChanges: string[];
  individualInstructions: string[];
  warning: string;
  saveablePlan?: {
    name: string;
    formation: string;
    playstyle: string;
    notes: string;
  };
}

// Local, lightning-fast deterministic answers for the specified core eFootball user questions
export const getDeterministicCoachResponse = (question: string): SmartCoachResponse | null => {
  const q = question?.trim();
  if (!q) return null;

  if (q.includes('4-3-1-2') || q.includes('بخسر من 4-3-1-2')) {
    return {
      problem: 'الخصم يلعب بالعمق المتراص (4-3-1-2) ويكسب معركة خط الوسط بالتمرير القصير السريع.',
      likelyReason: 'الاعتماد على تكتيل العمق من الخصم مع غياب أجنحة عريضة لديك لتوسيع انتشار دفاعه.',
      coachDecision: 'شغل أسلوب "لعب على الأطراف" (Out Wide) بـ 4-2-2-2 لتجدهم عاجزين عن التغطية العرضية.',
      recommendedChanges: [
        'غيّر التشكيل لـ 4-2-2-2 أو 4-2-1-3 بنظام أجنحة عريضة.',
        'ضع صانع ألعاب يمرر كرات قطرية دقيقة للأطراف.'
      ],
      individualInstructions: [
        'التزام خط التماس (Hug the Sideline) على الجناح الأيمن لمنع تكتلهم الدفاعي.',
        'دفاعي (Defensive) على الجناح المقابل لتفتيت تركيز وسطهم.'
      ],
      warning: 'احذر التمرير في العمق كليا لأن الخصم يملك 3 لاعبي ارتكاز جاهزون باستمرار لقطع الكرات.',
      saveablePlan: {
        name: 'Anti-4312 Wing Force',
        formation: '4-2-2-2',
        playstyle: 'Out Wide',
        notes: 'الخطة المضادة المثالية لتفكيك التكتل العميق لـ 4-3-1-2 الشهيرة عن طريق اللعب العريض وفتح الجبهات.'
      }
    };
  }

  if (q.includes('المهاجم معزول') || q.includes('مهاجم معزول') || q.includes('isolated')) {
    return {
      problem: 'رأس الحربة لا تصله أي كرات ويسهل قطعه معزولاً بين قلبي الدفاع.',
      likelyReason: 'تباعد المسافة بين خط الوسط ومهاجمك الوحيد بسبب غياب صانع ألعاب أو تراجع الأجنحة المفرط.',
      coachDecision: 'استخدم خطة بمهاجمين (2 CF) مثل 4-2-2-2 أو صانع ألعاب يتقدم بأسلوب لاعب مخترق (Hole Player) مثل 4-2-1-3.',
      recommendedChanges: [
        'غيّر التشكيل إلى 4-2-1-3 أو 4-2-2-2 للإسناد المباشر.',
        'عيّن صانع ألعاب AMF نشيط لمساندة رأس الحربة.'
      ],
      individualInstructions: [
        'رأس الحربة بنظام (Counter Target) حتى لا يضطر للتراجع للخلف بحثاً عن الكرة.'
      ],
      warning: 'المهاجمون السريعون مثل مبابي يحتاجون لصانع ألعاب يمرر في الخلف لا بمحاذاتهم.',
      saveablePlan: {
        name: 'Duo Striker Force',
        formation: '4-2-2-2',
        playstyle: 'Quick Counter',
        notes: 'خطة بمهاجمين تقلل العزل الهجومي وتوفر خيارات تبادل كرت ممتازة.'
      }
    };
  }

  if (q.includes('الخصم بيضغط عليا') || q.includes('الخصم يضغط') || q.includes('الضغط عليا') || q.includes('ضغط عليا')) {
    return {
      problem: 'عدم القدرة على الخروج بالكرة واستمرار خسارتها تحت الضغط العالي للخصم.',
      likelyReason: 'الاحتفاظ المفرط بالكرة بالدفاع وضعف خيارات التمرير الفوري القريب.',
      coachDecision: 'توسيع الملعب بالأطراف أو التحول مؤقتاً للتمرير الطويل لتخطي خط الضغط العالي بالعمق.',
      recommendedChanges: [
        'استخدم أسلوب "كرة طويلة مضادة" (Long Ball Counter) ليتراجع المدافعون ويفتحوا زوايا تمرير واسعة.',
        'مرر الكرة للظهير مباشرة أو شتتها طولياً للمهاجم المحطة.'
      ],
      individualInstructions: [
        'خط دفاعي عميق (Deep Line) على لاعب وسط لتأمين الارتداد المنظم.'
      ],
      warning: 'التمرير بالعرض أمام منطقتك بمثابة انتحار تكتيكي ضد خصوم الضغط المتمرسين.',
      saveablePlan: {
        name: 'Pressbreaker Setup',
        formation: '4-2-1-3',
        playstyle: 'Long Ball Counter',
        notes: 'تراجع ذكي للتخلص من غشامة الضغط العالي واستغلال المساحات الشاسعة بمرتدات خلفهم.'
      }
    };
  }

  if (q.includes('بستقبل مرتدات') || q.includes('مرتدات') || q.includes('concede counters') || q.includes('بستقبل مرتدات')) {
    return {
      problem: 'دفاعك يتلقى أهدافاً خاطفة وسريعة بمجرد خسارة الكرة بالهجوم.',
      likelyReason: 'اندفاع أظهرة الجنب لديك (LB/RB) بشكل متزامن هجومياً وتراخي قلبي الدفاع.',
      coachDecision: 'فرض التأمين الدفاعي على الأظهرة وتفعيل أسلوب "كرة طويلة مضادة" (Long Ball Counter) ليبقى الخط الخلفي ثابتاً في دفاع منخفض.',
      recommendedChanges: [
        'حوّل أسلوب اللعب لـ Long Ball Counter لمنع الدفاع من الاندفاع المتقدم.',
        'استخدم مدافعاً بأسلوب تكتيكي Build Up CB لتأمين التحركات.'
      ],
      individualInstructions: [
        'دفاعي (Defensive) على الظهير الأيمن RB لمنع المساندة العشوائية.',
        'دفاعي (Defensive) على الظهير الأيسر LB لتثبيت قلبي الدفاع.'
      ],
      warning: 'لا تستخدم الضغط العالي الجماعي المتواصل في الثلث الأخير إذا كانت سرعات مدافعيك منخفضة.',
      saveablePlan: {
        name: 'Impenetrable Box Force',
        formation: '5-3-2',
        playstyle: 'Long Ball Counter',
        notes: 'الحل النهائي للتصدي لمرتدات الخصوم الخاطفة.'
      }
    };
  }

  if (q.includes('بخسر الوسط') || q.includes('خسارة الوسط') || q.includes('lose midfield') || q.includes('بخسر الوسط')) {
    return {
      problem: 'الخصم يستغل المساحة الفارغة بين دفاعك ووسطك لاختراق العمق بسهولة.',
      likelyReason: 'اللعب بـ DMF مغامر يترك مركزه ويصعد لخصومك بشكل فارغ.',
      coachDecision: 'إشراك لاعبين اثنين بالارتكاز الدفاعي (Double Pivot) وتثبيتهما بالتعليمات الفردية الفورية.',
      recommendedChanges: [
        'حول التشكيل لـ 4-2-1-3 أو 4-2-2-2 التي توفر ثنائي ارتكاز.',
        'استخدم لاعباً بأسلوب Anchor Man مخصص دفاعي.'
      ],
      individualInstructions: [
        'دفاعي (Defensive) على كلا الارتكازين لغلق ثغرات العمق كلياً.'
      ],
      warning: 'تجنب وضع صانع الألعاب الكلاسيكي بالارتكاز دون حيازة صفات بدنية كافية لمنع المرور.',
      saveablePlan: {
        name: 'Double DMF Shield',
        formation: '4-2-2-2',
        playstyle: 'Long Ball Counter',
        notes: 'تأمين كامل لعمق الملعب عبر ثنائي ارتكاز دفاعي حديدي يمنع أي مرور أو اختراق.'
      }
    };
  }

  if (q.includes('عايز تعليمات فردية') || q.includes('تعليمات فردية') || q.includes('instructions')) {
    return {
      problem: 'الحيرة في توظيف الخواص الفردية وربطها بالخطة.',
      likelyReason: 'عدم وضع التعليمات للأدوار المتخصصة، مما يجعل المدافع يندفع والمهاجم يظن نفسه مدافعاً.',
      coachDecision: 'تطبيق التعليمات الكلاسيكية الأربعة: دفاعي للأظهرة، وتثبيت لصانع الألعاب، وهدف مرتدة لرأس الحربة.',
      recommendedChanges: [
        'اضبط لاعب الارتكاز DMF على "Defensive" حتى لا يترك مكانه.',
        'اضبط رأس الحربة الخبير على "Counter Target" ليساند الهجوم بشكل حيوي دائماً.'
      ],
      individualInstructions: [
        'دفاعي (على الارتكاز DMF)',
        'هدف المرتدة (على رأس الحربة CF)'
      ],
      warning: 'تعيين أكثر من تعليميتين هجوميتين للفريق قد يسبب تشتتاً موضعياً وفجوات بالانتشار.',
      saveablePlan: {
        name: 'Manual Instructions Max',
        formation: '4-3-3',
        playstyle: 'Quick Counter',
        notes: 'الخطة المثالية المتزنة للاستفادة الكاملة من أزرار التعليمات الفردية الأربعة باللعبة.'
      }
    };
  }

  if (q.includes('مش عارف أختار أسلوب لعب') || q.includes('أسلوب لعب') || q.includes('playstyle')) {
    return {
      problem: 'الحيرة في اختيار أسلوب اللعب الأنسب للمباراة.',
      likelyReason: 'عدم تماشي أسلوب المدرب واللعب مع رغبتك بالتحكم أو السرعة.',
      coachDecision: 'البدء بـ مرتدات سريعة (Quick Counter) للمبتدئين، أو استحواذ (Possession Game) لتمريرات آمنة.',
      recommendedChanges: [
        'جرّب أسلوب "مرتدات سريعة" إذا كنت تحب الهجوم العمودي التلقائي والضغط العالي.',
        'جرّب "كرة طويلة مضادة" إذا كنت تترك التحكم التكتيكي للكمبيوتر وتفضل تماسك الدفاع.',
        'جرّب "استحواذ" إذا كنت تبني اللعب بهدوء وتفضل الأمان البطيء.'
      ],
      individualInstructions: [
        'دفاعي (Defensive) على الارتكاز لحماية قلبي الدفاع.',
        'تثبيت موقعي (Anchoring) على صانع الألعاب ليظل حلقة وصل ثابتة.'
      ],
      warning: 'تغيير أسلوب اللعب يتطلب مدرباً متوافقاً لتجنب غياب الانسجام بالفريق.',
      saveablePlan: {
        name: 'Balanced Balanced DNA',
        formation: '4-4-2',
        playstyle: 'Quick Counter',
        notes: 'خطة متوازنة تماماً تمنحك الأفضلية في معظم المباريات بمجهود بدني معقول.'
      }
    };
  }

  return null;
};

export const getSmartCoachResponse = async (
  question: string,
  currentFormation: string = '4-3-3',
  currentPlaystyle: string = 'Quick Counter',
  problem: string = ''
): Promise<SmartCoachResponse> => {
  // 1. Try AI Primary first
  try {
    const response = await fetch('/.netlify/functions/smartCoach', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question,
        currentFormation,
        currentPlaystyle,
        problem
      })
    });

    if (response.ok) {
      const data = await response.json();
      return data as SmartCoachResponse;
    }
  } catch (err) {
    console.warn('AI primary consult failed or offline. Reverting to local fallback rules:', err);
  }

  // 2. Local deterministic backup rule engine matches as fallback
  const localMatch = getDeterministicCoachResponse(question || problem);
  if (localMatch) {
    return localMatch;
  }

  // Dynamic backup if nothing matched
  return {
    problem: problem || question || 'تحليل تكتيكي مخصص',
    likelyReason: 'وجود خلل في ترابط الخطوط الأمامية وضعف في تباعد لاعبي الارتكاز.',
    coachDecision: 'تطبيق أسلوب لعب متوازن لمرتدات سريعة لضمان تقارب تباعد كتل اللعب.',
    recommendedChanges: [
      'تعديل التشكيل فوراً لـ 4-2-2-2 أو 4-3-1-2 لربط العمق.',
      'تثبيت قلبي الدفاع في تراجع دفاعي منظم.'
    ],
    individualInstructions: [
      'دفاعي (على الارتكاز DMF)',
      'هدف المرتدة (على رأس الحربة CF)'
    ],
    warning: 'احذر الاستعجال بتمرير الكرات البينية الساقطة لتقليل الهجمات المرتدة ضدك.'
  };
};

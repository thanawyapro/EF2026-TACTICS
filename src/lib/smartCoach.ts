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

  if (q.includes('بخسر من تشكيل معين') || q.includes('تشكيل معين') || q.includes('formation') || q.includes('تشكيلة معينة')) {
    return {
      problem: 'الخسارة ضد تشكيلات دفاعية أو هجومية معينة للخصوم.',
      likelyReason: 'عدم تغيير أسلوب تدوير الكرة أو غياب التعديل المضاد (Counter Formation) لإبطال نقاط قوتهم.',
      coachDecision: 'تغيير التشكيل لضرب ثغرات تشكيل الخصم مباشرة.',
      recommendedChanges: [
        'إذا كان الخصم يلعب 4-3-3: جرب 4-2-2-2 لقطع خطوط تمرير الأجنحة بوسط ملعب متقارب.',
        'إذا كان يلعب 4-2-1-3: جرب 5-3-2 لشل حركة صانع الألعاب وعزل الثلاثي الهجومي.'
      ],
      individualInstructions: [
        'هدف المرتدة الكلي (Counter Target) على رأس الحربة لتجنب إجهاده البدني.',
        'دفاعي (Defensive) على أحد الأظهرة للحد من صعود أجنحة الخصم.'
      ],
      warning: 'لا تندفع بالضغط العشوائي لمدربي الخصم المستحوذين.',
      saveablePlan: {
        name: 'Anti-Tactics Block',
        formation: '4-2-2-2',
        playstyle: 'Long Ball Counter',
        notes: 'خطة مضادة مخصصة للتعامل مع تشكيلات خصوم الاستحواذ والأجنحة السريعة.'
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
        'جرّب "دفاع ثم هجمة" إذا كنت تترك التحكم التكتيكي للكمبيوتر وتفضل تماسك الدفاع.',
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

  if (q.includes('الخطة بتتكسر في الشوط الثاني') || q.includes('الشوط الثاني') || q.includes('الشوط الثاني بتتراجع')) {
    return {
      problem: 'انهيار دفاعي وتباعد خطوط الفريق في الشوط الثاني.',
      likelyReason: 'نفاد طاقة اللياقة البدنية (Stamina) للاعبي خط الوسط بسبب الركض الدائم والضغط العالي.',
      coachDecision: 'إجراء 3 تغييرات فورية في خط الوسط والأجنحة عند الدقيقة 60 لإدخال طاقة وميزة Super-Sub.',
      recommendedChanges: [
        'أدخل لاعبي وسط يمتلكون ميزة "Super-sub" في الهجوم والوسط.',
        'حول التكتيك إلى Sub-Tactic "دفاع ثم هجمة" لتهدئة ريتم الضغط وحفظ اللياقة.'
      ],
      individualInstructions: [
        'هدف المرتدة (Counter Target) على الجناحين لمنع استنزاف طاقتهما الدفاعية.'
      ],
      warning: 'إبقاء لاعب بلياقة حمراء فارغة يجعله ثغرة دفاعية وممراً سهلاً لخصومك.',
      saveablePlan: {
        name: 'Second Half Shield',
        formation: '5-3-2',
        playstyle: 'Long Ball Counter',
        notes: 'الخطة البديلة للشوط الثاني لإيقاف هجمات الخصم بمجرد التقدم بالنتيجة.'
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

  if (q.includes('الخصم بيضغط عليا') || q.includes('الخصم يضغط') || q.includes('الضغط العالي') || q.includes('ضغط عالي')) {
    return {
      problem: 'عدم القدرة على الخروج بالكرة واستمرار خسارتها تحت الضغط العالي للخصم.',
      likelyReason: 'الاحتفاظ المفرط بالكرة بالدفاع وضعف خيارات التمرير الفوري القريب.',
      coachDecision: 'توسيع الملعب بالأطراف أو التحول مؤقتاً للتمرير الطويل لتخطي خط الضغط العالي بالعمق.',
      recommendedChanges: [
        'استخدم أسلوب "دفاع ثم هجمة" (Long Ball Counter) ليتراجع المدافعون ويفتحوا زوايا تمرير واسعة.',
        'مرر الكرة للظهير مباشرة أو شتتها طولياً للمهاجم المحطة.'
      ],
      individualInstructions: [
        'خط دفاعي عميق (Deep Line) على لاعب وسط متراجع لتأمين الحيازة الحرة.'
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

  if (q.includes('الخصم بيكسب العمق') || q.includes('يكسب العمق') || q.includes('العمق مخترق') || q.includes('مخترق من العمق')) {
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

  if (q.includes('الأطراف عندي ضعيفة') || q.includes('الأطراف ضعيفة') || q.includes('ضعف الأطراف') || q.includes('أطرافي')) {
    return {
      problem: 'اختراقات الخصم الخطيرة المستمرة من أطراف الملعب وعرضياته الهوائية الصعبة.',
      likelyReason: 'صعود أظهرة الجنب لديك الدائم للمساندة الهجومية تاركين الجناحين مستباحين بالكامل.',
      coachDecision: 'إيقاف صعود الأظهرة فورياً أو حماية الخط الخلفي بثلاثة مدافعين مع قلبي دفاع متطرفين.',
      recommendedChanges: [
        'حوّل أظهرتك من هجومية سريعة إلى أظهرة دفاعية مميزة.',
        'شغل التعليمات الدفاعية لمنع التقدم.'
      ],
      individualInstructions: [
        'دفاعي (Defensive) لظهير الجنب الأيمن والأيسر معاً لحصانة تامة للأطراف.'
      ],
      warning: 'اللعب بأظهرة هجومية في أسلوب "مرتدات سريعة" يتطلب أجنحة سريعة تجيد الارتداد التموضعي للتغطية.',
      saveablePlan: {
        name: 'Wing Fortress Control',
        formation: '5-3-2',
        playstyle: 'Long Ball Counter',
        notes: 'استراتيجية الحصن الخماسي لتدمير فاعلية الأجنحة فائقة السرعة للخصوم.'
      }
    };
  }

  if (q.includes('تعليمات فردية مناسبة') || q.includes('تعليمات فردية') || q.includes('instructions')) {
    const defaultFix = problemToTacticalFixMap['midfield_lost'];
    return {
      problem: 'الحيرة في توظيف الخواص الفردية وربطها بالخطة.',
      likelyReason: 'عدم وضع التعليمات للأدوار المتخصصة، مما يجعل المدافع يندفع والمهاجم يظن نفسه مدافعاً.',
      coachDecision: 'تطبيق التعليمات الكلاسيكية الأربعة: دفاعي للأظهرة، وتثبيت لصانع الألعاب، وهدف مرتدة لرأس الحربة.',
      recommendedChanges: [
        'اضبط لاعب الارتكاز DMF على "Defensive" حتى لا يترك مكانه.',
        'اضبط رأس الحربة الخبير على "Counter Target" ليساند الهجوم بشكل حيوي دائماً.'
      ],
      individualInstructions: [
        'دفاعي (على الارتكاز)',
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

  return null;
};

export const getSmartCoachResponse = async (
  question: string,
  currentFormation: string = '4-3-3',
  currentPlaystyle: string = 'Quick Counter',
  problem: string = ''
): Promise<SmartCoachResponse> => {
  // 1. Try local deterministic logic first with priority
  const localMatch = getDeterministicCoachResponse(question || problem);
  if (localMatch) {
    return localMatch;
  }

  // 2. Call the server/AI endpoint if it is a complex free-text custom query
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

    if (!response.ok) {
      throw new Error(`Netlify function returned Status Code: ${response.status}`);
    }

    const data = await response.json();
    return data as SmartCoachResponse;
  } catch (err: any) {
    console.error('Smart Agent local/remote routing fallback error:', err);
    // Dynamic fallback structure conforming to constraints
    return {
      problem: problem || question || 'مستعصية تكتيكية مجهولة',
      likelyReason: 'ارتباك التمركز الدفاعي وتراخي خطوط الارتداد.',
      coachDecision: 'تطبيق الأمان التكتيكي السريع وإبطاء سرعة التمرير.',
      recommendedChanges: [
        'تحويل الخطة فورياً وإصلاح ريتم تكتيك اللعب.',
        'ضع قلبي الدفاع في حالة المراقبة الشديدة (Tight Marking).'
      ],
      individualInstructions: [
        'دفاعي (على الارتكاز الـ DMF)',
        'هدف المرتدة (على الـ CF للمحافظة على طاقته)'
      ],
      warning: 'احذر الاستعجال بتغيير التمرير في الثواني الأخيرة للمباراة.'
    };
  }
};

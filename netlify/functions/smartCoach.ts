import { z } from 'zod';

const InputSchema = z.object({
  question: z.string().optional().default(''),
  currentFormation: z.string().optional().default('4-3-3'),
  currentPlaystyle: z.string().optional().default('Quick Counter'),
  problem: z.string().optional().default('')
});

const OutputSchema = z.object({
  problem: z.string(),
  likelyReason: z.string(),
  coachDecision: z.string(),
  recommendedChanges: z.array(z.string()),
  individualInstructions: z.array(z.string()),
  warning: z.string(),
  saveablePlan: z.object({
    name: z.string(),
    formation: z.string(),
    playstyle: z.string(),
    notes: z.string()
  }).optional()
});

export const handler = async (event: any, _context: any): Promise<any> => {
  // CORS configuration
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const rawParsed = JSON.parse(event.body || '{}');
    
    // Zod Validation of Input
    const inputValidation = InputSchema.safeParse(rawParsed);
    if (!inputValidation.success) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid Request Body parameters', details: inputValidation.error })
      };
    }

    const { question, currentFormation, currentPlaystyle, problem } = inputValidation.data;
    const apiKey = process.env.GEMINI_API_KEY;

    // الخطة البديلة المحدثة بنظام TACTICBOSS الاحترافي في حال عدم وجود الـ API Key
    if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
      const simulatedResponse = {
        problem: problem || question || 'ضعف اختراق العمق الدفاعي للخصم وتلقي مرتدات كارثية',
        likelyReason: 'استخدام خطة هجومية مفرطة تؤدي لتباعد المسافات بين لاعبي الوسط (DMF/CMF) مما يمنح مهاجمي الخصم مساحات شاسعة للانطلاق فور قطع الكرة.',
        coachDecision: 'تفعيل جدار الحماية التكتيكي الخاص بمحرك TACTICBOSS بإعادة ضبط التوازن وتأمين الارتكاز.',
        recommendedChanges: [
          'تغيير التشكيل فوراً إلى خطة "الـميتا المضادة" 4-2-1-3 أو 4-2-2-2 لتأمين محوري الارتكاز.',
          'تعديل خطة اللعب الجماعي إلى Long Ball Counter (مرتدات طويلة) لخفض خط الدفاع تلقائياً ومنع ضربك بالكرات الطولية والـ Through Balls.',
          'سحب أحد أجنحة الهجوم وتحويله للاعب خط وسط مهاجم (AMF) لربط الخطوط وسد ثغرة التمرير.'
        ],
        individualInstructions: [
          'التعليمات الفردية 1: تعيين أمر "Defensive" (دفاعي) على كلا لاعبي الارتكاز (DMF) لمنع تقدمهما نهائياً أثناء الهجوم.',
          'التعليمات الفردية 2: تفعيل أمر "Counter Target" (هدف المرتدة) على المهاجم الصريح (CF) ليوفر دائماً محطة لتفريغ الضغط بدون استهلاك لياقته في العودة للخلف.',
          'التعليمات الفردية 3: وضع "Anchoring" (التثبيت الموقعي) على الجناح السريع لمنع دخوله للعمق عشوائياً وفتح أطراف الملعب.'
        ],
        warning: '⚠️ تحذير الميتا: تجنب تفعيل الضغط العالي الأوتوماتيكي (Team Press) لأكثر من 3 ثوانٍ متتالية حتى لا يتدمر تنظيم خط دفاعك ومخزون اللياقة البدنية للاعبيك قبل الشوط الثاني.',
        saveablePlan: {
          name: 'BOSS Anti-Meta Counter',
          formation: '4-2-1-3',
          playstyle: 'Long Ball Counter',
          notes: 'تكتيك دفاعي هجومي متوازن مستوحى من مستخدمي التصنيف الأول لكسر الخطط الدفاعية المغلقة.'
        }
      };

      const validatedOutput = OutputSchema.parse(simulatedResponse);

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'X-Demo-Mode': 'true'
        },
        body: JSON.stringify(validatedOutput)
      };
    }

    // التوجيهات البرمجية المطورة للذكاء الاصطناعي (Prompt Engineering) بناءً على معايير TACTICBOSS
    const prompt = `
You are an elite pro-level eFootball 2026 tactical engineer and the core logic generator of the famous "TACTICBOSS" engine.
Your job is to breakdown the user's tactical dilemma, mistakes, or opponent's behavior and give them a lethal, highly practical elite counter-strategy inside the strict game rules.

Allowed parameters for your choices:
- Formations must be competitive formats like "4-3-3", "4-2-2-2", "4-2-1-3", "4-1-2-3", "5-2-1-2", "3-2-4-1".
- Playstyles must ONLY be: "Possession Game" (استحواذ), "Quick Counter" (مرتدات سريعة), "Long Ball Counter" (كرة طويلة مضادة), "Out Wide" (لعب على الأطراف), "Long Ball" (كرات طويلة).
- Individual instructions must strictly be: "Counter Target" (هدف المرتدة), "Anchoring" (التثبيت الموقعي), "Deep Line" (خط دفاعي عميق), "Defensive" (دفاعي).

USER Dilemma Input:
- Question or Scenario: "${question}"
- Current Formation: "${currentFormation}"
- Current Playstyle: "${currentPlaystyle}"
- Problem Tag: "${problem}"

Act as a strict Pro-Coach. Formulate your JSON response to be deeply analytical yet perfectly simplified for any player to execute instantly on their console/mobile screen.

Return ONLY a pure JSON object conforming to the schema below. No markdown text, no markdown code blocks fence:
{
  "problem": "Detailed Arabic concise evaluation of the core breakdown in user's layout",
  "likelyReason": "Advanced but easy-to-understand Arabic tactical reason explaining why the eFootball game engine or player AI behavior exploits this specific weakness",
  "coachDecision": "A strong corporate/pro-level Arabic tactical decision statement based on TACTICBOSS philosophies",
  "recommendedChanges": [
    "1st Arabic concrete formation/position adjustments with positions names (e.g., تحويل CMF إلى DMF تأميناً للعمق)",
    "2nd Arabic playstyle configuration adjustments with technical depth",
    "3rd Arabic tactical tip for pressing or manual switching"
  ],
  "individualInstructions": [
    "Specific Arabic Advanced Individual instruction 1, specifying the player role e.g. دفاعي (على الارتكاز DMF)",
    "Specific Arabic Advanced Individual instruction 2, specifying the player role e.g. هدف المرتدة (على رأس الحربة CF)",
    "Specific Arabic Advanced Individual instruction 3, specifying position or tracking instruction"
  ],
  "warning": "Critical Arabic advice regarding the eFootball meta trends, script momentum mitigation, stamina conservation, or blind-spots",
  "saveablePlan": {
    "name": "Lethal English custom name for this anti-meta tactic (e.g. BOSS Meta Destroyer)",
    "formation": "the ideal counter formation string",
    "playstyle": "the precise competitive Team Playstyle string matching the permitted list",
    "notes": "Secret tactical tip in Arabic on how to deploy this plan effectively during matches"
  }
}
`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;

    const rawResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      })
    });

    if (!rawResponse.ok) {
      const errorText = await rawResponse.text();
      throw new Error(`Gemini service error: ${errorText}`);
    }

    const resJson = await rawResponse.json() as any;
    const responseText = resJson.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      throw new Error('Empirical text body not obtained from generative model.');
    }

    const cleanedText = responseText.trim().replace(/^```json/, '').replace(/```$/, '').trim();
    const parsedObj = JSON.parse(cleanedText);

    // Validate structure
    const validatedOutput = OutputSchema.parse(parsedObj);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(validatedOutput)
    };

  } catch (error: any) {
    console.error('Smartcoach serverless handler error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Server Function Failure', message: error.message || '' })
    };
  }
};

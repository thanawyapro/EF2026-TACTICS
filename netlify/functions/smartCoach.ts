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

    // Fallback if no API key is specified - return high-quality simulated coach responses
    if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
      const simulatedResponse = {
        problem: problem || question || 'عدم استواء خطوط اللعب والتراجع',
        likelyReason: 'ترك الثغرات الدفاعية خلف أجنحة خط الهجوم السريع وقلة الدعم من لاعبي الوسط.',
        coachDecision: 'تغيير عاجل ومحكم للهيكل الدفاعي للتصدي لهجمات مرتدات الخصم السريعة.',
        recommendedChanges: [
          'تبديل التشكيل حالاً ليكون 4-2-2-2 لغلق العمق الميداني.',
          'التحول من الضغط العالي إلى التراجع المنظم التكتيكي.'
        ],
        individualInstructions: [
          'دفاعي (على كلا الارتكازين لضمان البقاء في الخلف)',
          'هدف المرتدة (على رأس الحربة CF للراحة)'
        ],
        warning: 'لا تستعجل الاندفاع في المرتدات كي لا ينفذ مخزون اللياقة في الشوط الثاني.',
        saveablePlan: {
          name: 'EF26 Defensive Fortress',
          formation: '4-2-2-2',
          playstyle: 'Long Ball Counter',
          notes: 'خطة تكتيكية تم إنشاؤها وتجربتها خصيصاً للتصدي للهجمات المرتدة باللعبة.'
        }
      };

      // Output Validation via Zod
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

    // Modern eFootball expert instructions prompt
    const prompt = `
You are an expert elite-level eFootball 2026 coaching engineer (Smart Coach).
Your job is to answer the user's tactical dilemma or question within the strict constraints of the eFootball "DNA Engine" (Team Playstyle concepts, Formations, and Individual Instructions rules).

Allowed parameters for your choices:
- Formations must be like "4-3-3", "4-2-2-2", "4-2-1-3", "5-3-2", "3-2-4-1" etc.
- Playstyles must ONLY be one of: "Possession Game" (استحواذ), "Quick Counter" (مرتدات سريعة), "Long Ball Counter" (دفاع ثم هجمة), "Out Wide" (لعب على الأطراف), "Long Ball" (كرات طويلة).
- Individual instructions must be one of: "Counter Target" (هدف المرتدة), "Anchoring" (التثبيت الموقعي), "Deep Line" (خط دفاعي عميق), "Defensive" (دفاعي).

USER Dilemma:
- Question: "${question}"
- Current Formation in use: "${currentFormation}"
- Current Playstyle in use: "${currentPlaystyle}"
- Main problem tag: "${problem}"

You must formulate your helpful response strictly complying with the following layout. Do not write normal conversation text. Do not wrap code blocks in markdown fences. Give pure JSON representation only:
{
  "problem": "brief Arabic summary of the user issue as stated or deduced",
  "likelyReason": "clear, simplified Arabic explanation of why this happens in eFootball",
  "coachDecision": "high-impact Arabic tactical main decision statement",
  "recommendedChanges": [
    "1st Arabic specific strategic recommendation",
    "2nd Arabic specific strategic recommendation"
  ],
  "individualInstructions": [
    "1st specific Arabic individual instruction recommendation, e.g. دفاعي (على الارتكاز DMF)",
    "2nd specific Arabic individual instruction recommendation, e.g. هدف المرتدة (على رأس الحربة CF)"
  ],
  "warning": "Arabic crucial warning about eFootball momentum, stamina depletion, or trigger errors",
  "saveablePlan": {
    "name": "short descriptive Arabic/English name for this tailored setup",
    "formation": "the recommended counter formation (e.g., 4-2-2-2 or 5-3-2)",
    "playstyle": "the recommended Team Playstyle id (one of: Possession Game, Quick Counter, Long Ball Counter, Out Wide, Long Ball)",
    "notes": "short Arabic operational key advisory note"
  }
}
`;

    // Note: We use the system-mandated gemini-3.5-flash model
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

    // Output validation using Zod
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

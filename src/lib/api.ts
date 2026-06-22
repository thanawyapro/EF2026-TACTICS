export interface AIAnalysisRequest {
  matchData: {
    userFormation: string;
    opponentFormation: string;
    score: string;
    possession: number;
    shots: number;
    shotsOnTarget: number;
    passAccuracy: number;
    problem: string;
    notes: string;
  };
}

export interface AIAnalysisResponse {
  summary: string;
  weaknesses: string[];
  strengths: string[];
  recommendedFormation: string;
  counterInstructions: string[];
  subTactics: string[];
  riskLevel: 'Low' | 'Medium' | 'High';
}

export const analyzeTacticsWithAI = async (
  matchData: AIAnalysisRequest['matchData']
): Promise<AIAnalysisResponse> => {
  const resp = await fetch('/.netlify/functions/analyzeTactics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ matchData })
  });
  
  if (!resp.ok) {
    const errorText = await resp.text();
    throw new Error(errorText || `HTTP error! status: ${resp.status}`);
  }
  
  return await resp.json() as AIAnalysisResponse;
};

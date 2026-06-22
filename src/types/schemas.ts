import { z } from 'zod';

export const PlayerNodeSchema = z.object({
  r: z.string(),
  x: z.number().min(2).max(98),
  y: z.number().min(2).max(98),
});

export const TacticalProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  formation: z.string(),
  playstyle: z.string(),
  details: z.string(),
  isCustom: z.boolean().optional(),
  subTactics: z.array(z.string()).optional(),
});

export const MatchRecordSchema = z.object({
  id: z.string(),
  date: z.string(),
  myFormation: z.string(),
  opponentFormation: z.string(),
  myGoals: z.number().min(0, { message: 'Goals scored must be 0 or more' }),
  opponentGoals: z.number().min(0, { message: 'Goals conceded must be 0 or more' }),
  result: z.enum(['W', 'L', 'D']),
  possession: z.number().min(15, { message: 'Possession must be at least 15%' }).max(85, { message: 'Possession cannot exceed 85%' }),
  myShots: z.number().min(0, { message: 'Shots must be 0 or more' }),
  onTarget: z.number().min(0, { message: 'On target shots must be 0 or more' }),
  oppShots: z.number().min(0, { message: 'Opponent shots must be 0 or more' }),
  oppOnTarget: z.number().min(0, { message: 'Opponent on target shots must be 0 or more' }),
  feltControlLoss: z.boolean(),
  matchType: z.string(),
  notes: z.string().max(1000, { message: 'Notes must be 1000 characters or less' }),
});

export const AIResponseSchema = z.object({
  summary: z.string(),
  weaknesses: z.array(z.string()),
  strengths: z.array(z.string()),
  recommendedFormation: z.string(),
  counterInstructions: z.array(z.string()),
  subTactics: z.array(z.string()),
  riskLevel: z.enum(['Low', 'Medium', 'High']),
});

export const AppStateSchema = z.object({
  version: z.string(),
  createdAt: z.string(),
  matches: z.array(MatchRecordSchema),
  customCoords: z.record(z.string(), z.array(PlayerNodeSchema)).optional().default({}),
  profiles: z.array(TacticalProfileSchema),
  activeProfileId: z.string(),
  language: z.enum(['en', 'ar']),
  themeAccent: z.string(),
  aiHistory: z.array(z.object({
    id: z.string(),
    timestamp: z.string(),
    request: z.object({
      userFormation: z.string(),
      opponentFormation: z.string(),
      score: z.string(),
      possession: z.number(),
      shots: z.number(),
      shotsOnTarget: z.number(),
      passAccuracy: z.number(),
      problem: z.string(),
      notes: z.string(),
    }),
    response: AIResponseSchema,
  })).optional().default([]),
});

export type PlayerNode = z.infer<typeof PlayerNodeSchema>;
export type TacticalProfile = z.infer<typeof TacticalProfileSchema>;
export type MatchRecord = z.infer<typeof MatchRecordSchema>;
export type AIResponse = z.infer<typeof AIResponseSchema>;
export type AppState = z.infer<typeof AppStateSchema>;

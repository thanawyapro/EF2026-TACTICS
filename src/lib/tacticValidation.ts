// src/lib/tacticValidation.ts

import { teamPlaystyles, commonFormations } from '../data/efootballDNA';

export interface ValidationFeedback {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const validatePlan = (
  formation: string, 
  playstyle: string, 
  attackingInstructions: string[] = [], 
  defensiveInstructions: string[] = []
): ValidationFeedback => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Formation Validation
  const normFormation = formation?.trim();
  if (!normFormation) {
    errors.push('Formation is required.');
  } else {
    // Basic format validator: matches digit-digit-digit or digit-digit-digit-digit (e.g. 4-3-3, 4-2-1-3, 3-2-4-1)
    const regex = /^\d-\d-\d(-\d)?$/;
    if (!regex.test(normFormation)) {
      errors.push(`Formation format "${formation}" is invalid (should be like 4-3-3 or 4-2-1-3).`);
    } else {
      const sumPlayers = normFormation.split('-').reduce((acc, val) => acc + parseInt(val, 10), 0);
      if (sumPlayers !== 10) { // 10 outfield players + 1 GK
        warnings.push(`Formation sum is ${sumPlayers} outfield players. Standard matches usually use exactly 10 outfield players.`);
      }
    }
  }

  // 2. Playstyle Validation
  const validPlaystyles = teamPlaystyles.map(p => p.id);
  const validPlaystyleNamesAr = teamPlaystyles.map(p => p.nameAr);
  
  if (!playstyle) {
    errors.push('Team Playstyle is required.');
  } else if (!validPlaystyles.includes(playstyle) && !validPlaystyleNamesAr.includes(playstyle)) {
    errors.push(`Selected playstyle "${playstyle}" is not supported in registered eFootball mechanics.`);
  }

  // 3. Playstyle-Instruction compatibility rules (e.g. Possession game should not use counter-intuitive setups)
  if (playstyle === 'Possession Game' || playstyle === 'استحواذ') {
    // Defensive instruction "Defensive" on both fullbacks can stifle buildup options in possession
    const defensiveCount = defensiveInstructions.filter(i => i.toLowerCase().includes('defensive')).length;
    if (defensiveCount >= 2) {
      warnings.push('Having multiple "Defensive" instructions can overly freeze fullbacks, restricting short-pass triangle triangles under Possession playstyle.');
    }
  }

  if (playstyle === 'Long Ball' || playstyle === 'كرات طويلة') {
    // Possession/short passing instructions don't fit long ball bombardments
    if (attackingInstructions.some(i => i.toLowerCase().includes('anchor') || i.toLowerCase().includes('positional'))) {
      warnings.push('Lateral stabilization (Anchoring) limits player search movements when targeting second balls inside Long Ball strategy.');
    }
  }

  // 4. Risky layouts checks for beginners
  if (formation === '4-1-1-4' || formation === '3-1-3-3') {
    warnings.push('This layout leaves central midfield extremely barren and is highly risky for average eFootball players.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

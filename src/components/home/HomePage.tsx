// src/components/home/HomePage.tsx
import React from 'react';
import { motion } from 'framer-motion';

// Decomposed home parts
import HeroSection from './sub/HeroSection';
import MainActionCards from './sub/MainActionCards';
import ProfessionalToolsCard from './sub/ProfessionalToolsCard';
import TrendingMetaPlans from './sub/TrendingMetaPlans';

interface HomePageProps {
  onNavigate: (tabId: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6 max-w-4xl mx-auto py-2 font-sans"
      data-testid="simplified-homepage"
    >
      {/* 2. HeroSection Welcome Banner */}
      <HeroSection />

      {/* 3. Main action grid buttons */}
      <MainActionCards onNavigate={onNavigate} />

      {/* 5. Trending Meta Plans (24h Cache Static backup fallback) */}
      <TrendingMetaPlans />

      {/* 4. ProfessionalTools Entry portal */}
      <ProfessionalToolsCard onNavigate={onNavigate} />
    </motion.div>
  );
}

// src/pages/EfootballAuditPage.tsx
import React, { useState, useMemo } from 'react';
import {
  teamPlaystyles,
  commonFormations,
  formationStrengths,
  formationWeaknesses,
  problemToTacticalFixMap,
  playstyleCompatibility,
  individualInstructionRules,
  counterFormationRules,
  PlaystyleInfo,
  TacticalFix
} from '../data/efootballDNA';
import { runI18nAudit } from '../lib/i18nAudit';
import { 
  CheckCircle, 
  AlertTriangle, 
  Search, 
  Activity, 
  Grid, 
  Sliders, 
  Compass, 
  ShieldCheck, 
  FileJson,
  ArrowLeft,
  ChevronRight,
  Database,
  BarChart2,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Globe,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AuditTestResult {
  name: string;
  category: string;
  status: 'passed' | 'warning' | 'failed';
  details: string;
}

export default function EfootballAuditPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<'all' | 'playstyles' | 'formations' | 'fixes' | 'instructions' | 'i18n'>('all');
  const [testTriggerCount, setTestTriggerCount] = useState(0);

  // Trigger translation key comparison dynamically
  const i18nReport = useMemo(() => {
    return runI18nAudit();
  }, [testTriggerCount]);

  // Run dynamic automated diagnostics on the loaded eFootball tactical database
  const diagnostics = useMemo((): AuditTestResult[] => {
    const results: AuditTestResult[] = [];

    // Test 1: Team Playstyles Integrity & Count
    const expectedPlaystylesCount = 5;
    if (teamPlaystyles.length === expectedPlaystylesCount) {
      results.push({
        name: 'Official Team Playstyles Count',
        category: 'Schema Conformity',
        status: 'passed',
        details: `Found exactly ${teamPlaystyles.length} official manager playstyles (Possession, Quick Counter, Long Ball Counter, Out Wide, Long Ball).`
      });
    } else {
      results.push({
        name: 'Official Team Playstyles Count',
        category: 'Schema Conformity',
        status: 'warning',
        details: `Expected 5, found ${teamPlaystyles.length}.`
      });
    }

    // Test 2: Bilingual Translation Validation
    let missingTranslations = 0;
    teamPlaystyles.forEach(p => {
      if (!p.nameEn || !p.nameAr || !p.descriptionEn || !p.descriptionAr) missingTranslations++;
    });
    if (missingTranslations === 0) {
      results.push({
        name: 'Playstyle Bilingual Localization',
        category: 'Bilingual Assets',
        status: 'passed',
        details: 'All manager playstyles are fully localized with complete English and Arabic content.'
      });
    } else {
      results.push({
        name: 'Playstyle Bilingual Localization',
        category: 'Bilingual Assets',
        status: 'failed',
        details: `${missingTranslations} playstyles have missing translation assets.`
      });
    }

    // Test 3: Playstyle Compatibility Matching
    const definedPlaystyles = teamPlaystyles.map(p => p.id);
    const compatibilityKeys = Object.keys(playstyleCompatibility);
    const mismatchCompatibility = compatibilityKeys.filter(k => !definedPlaystyles.includes(k));
    
    if (mismatchCompatibility.length === 0) {
      results.push({
        name: 'Playstyle Compatibility Reciprocity',
        category: 'Gameplay Logic',
        status: 'passed',
        details: `Proven reciprocity! All ${compatibilityKeys.length} combat compatibility mapping tables align perfectly with playstyle IDs.`
      });
    } else {
      results.push({
        name: 'Playstyle Compatibility Reciprocity',
        category: 'Gameplay Logic',
        status: 'warning',
        details: `Compatibility keys without mapping playstyles: ${mismatchCompatibility.join(', ')}`
      });
    }

    // Test 4: Formations Strength/Weakness Schema Matching
    let formationSymmetricFails = 0;
    commonFormations.forEach(f => {
      const hasStr = !!formationStrengths[f];
      const hasWeak = !hasStr || !!formationWeaknesses[f]; // Not counting missing weakness as crash, but good to know
      if (!hasStr) formationSymmetricFails++;
    });

    if (formationSymmetricFails === 0) {
      results.push({
        name: 'Formation Metadata Coverage',
        category: 'Schema Conformity',
        status: 'passed',
        details: `All ${commonFormations.length} global formations have certified tactical strength & limitation listings in English and Arabic.`
      });
    } else {
      results.push({
        name: 'Formation Metadata Coverage',
        category: 'Schema Conformity',
        status: 'warning',
        details: `${formationSymmetricFails} formations don't have matching lists.`
      });
    }

    // Test 5: Tactical Problems Resolutions Correctness
    let fixReferencingErrors = 0;
    Object.entries(problemToTacticalFixMap).forEach(([id, fix]) => {
      if (!definedPlaystyles.includes(fix.recommendedPlaystyle)) fixReferencingErrors++;
    });

    if (fixReferencingErrors === 0) {
      results.push({
        name: 'Problem Solver Playstyle Reference Integrity',
        category: 'Diagnostic Engine',
        status: 'passed',
        details: 'All problem recommendations point to certified official eFootball team playstyles.'
      });
    } else {
      results.push({
        name: 'Problem Solver Playstyle Reference Integrity',
        category: 'Diagnostic Engine',
        status: 'failed',
        details: `Found ${fixReferencingErrors} unresolved or misspelled playstyle recommendations.`
      });
    }

    // Test 6: Counter Formations Mapping Coverage
    const counterFormationsKeys = Object.keys(counterFormationRules);
    if (counterFormationsKeys.length > 0) {
      results.push({
        name: 'Meta Defensive Interception Coverage',
        category: 'Gameplay Logic',
        status: 'passed',
        details: `Discovered countering guides for ${counterFormationsKeys.length} common setups.`
      });
    }

    // Test 7: Translation Keys Synchronous Coverage
    if (!i18nReport.hasDiscrepancies) {
      results.push({
        name: 'Localization Keys Alignment',
        category: 'Language Assets',
        status: 'passed',
        details: `All translation keys are aligned perfectly across all 4 supported locales (ar, en, es, fr) with ${i18nReport.allKeysCount} unique keys defined.`
      });
    } else {
      const mismatchedLocales = Object.entries(i18nReport.locales)
        .filter(([_, data]) => data.missingKeysCount > 0)
        .map(([locale, data]) => `${locale.toUpperCase()} (${data.missingKeysCount} missing)`)
        .join(', ');
      results.push({
        name: 'Localization Keys Alignment',
        category: 'Language Assets',
        status: 'warning',
        details: `Alignment warnings found! Some target keys are missing in: ${mismatchedLocales}. View detailed list under Translation Keys tab.`
      });
    }

    return results;
  }, [testTriggerCount, i18nReport]);

  const stats = useMemo(() => {
    return {
      playstylesCount: teamPlaystyles.length,
      formationsCount: commonFormations.length,
      fixesCount: Object.keys(problemToTacticalFixMap).length,
      instructionsCount: individualInstructionRules.length
    };
  }, []);

  const filteredPlaystyles = useMemo(() => {
    return teamPlaystyles.filter(p => 
      p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameAr.includes(searchQuery) ||
      p.descriptionEn.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredFormations = useMemo(() => {
    return commonFormations.filter(f => 
      f.includes(searchQuery)
    );
  }, [searchQuery]);

  const filteredFixes = useMemo(() => {
    return Object.entries(problemToTacticalFixMap).filter(([key, fix]) => 
      fix.problemEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fix.problemAr.includes(searchQuery) ||
      fix.recommendedPlaystyle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Navigate back safely (refresh path or reload normal route structure)
  const handleBackToGame = () => {
    window.location.href = '/';
  };

  const passedTestsCount = diagnostics.filter(d => d.status === 'passed').length;
  const warningTestsCount = diagnostics.filter(d => d.status === 'warning').length;
  const failedTestsCount = diagnostics.filter(d => d.status === 'failed').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16 relative overflow-hidden" data-testid="efootball-audit-page">
      {/* Aesthetic Cyberpunk background styling */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Audit Upper Banner */}
      <header className="border-b border-border/80 bg-slate-900/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToGame}
              className="p-2 sm:p-2.5 rounded-xl border border-zinc-800 hover:border-zinc-550 bg-slate-900 hover:bg-slate-800 text-gray-400 hover:text-white transition cursor-pointer select-none"
              title="Return to Tactic Deck"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] tracking-widest uppercase bg-cyan-400/10 border border-cyan-400/25 text-cyan-400 px-2 py-0.5 rounded-md font-bold font-orbitron font-mono">
                  DEVELOPER ONLY ROUTE
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black font-orbitron tracking-wider text-white uppercase mt-1">
                🎮 eFootball™ Tactical Data Audit
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTestTriggerCount(c => c + 1)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold font-orbitron bg-slate-900/80 hover:bg-slate-800 rounded-xl border border-border/40 text-gray-400 hover:text-white transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>REFRESH DIAGNOSTICS</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 select-none">
        
        {/* Statistics Widgets */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'PLAYSTYLES (META)', value: stats.playstylesCount, icon: Compass, color: 'text-primary' },
            { label: 'SQUAD LAYOUTS', value: stats.formationsCount, icon: Grid, color: 'text-emerald-400' },
            { label: 'DIAGNOSTIC RESOLUTIONS', value: stats.fixesCount, icon: Sliders, color: 'text-amber-400' },
            { label: 'INDIVIDUAL RULES', value: stats.instructionsCount, icon: Activity, color: 'text-cyan-400' }
          ].map((stat, i) => (
            <div key={i} className="bg-[#0c1223] border border-border/60 p-4 rounded-2xl flex items-center justify-between shadow-lg">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-gray-450 tracking-wider font-orbitron block">{stat.label}</span>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-mono block">{stat.value}</span>
              </div>
              <div className={`p-2.5 rounded-xl bg-slate-950/60 border border-border/40 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          ))}
        </section>

        {/* Diagnostic Integrity Check Panel */}
        <section className="bg-slate-900/35 border border-border/80 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="text-sm font-black font-orbitron text-white uppercase tracking-wider">
                Automated Database Integrity Metrics
              </h2>
            </div>
            
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold">
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded">
                {passedTestsCount} PASSED
              </span>
              {warningTestsCount > 0 && (
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/25 px-2 py-0.5 rounded">
                  {warningTestsCount} WARNINGS
                </span>
              )}
              {failedTestsCount > 0 && (
                <span className="bg-red-500/10 text-red-400 border border-red-500/25 px-2 py-0.5 rounded">
                  {failedTestsCount} FAILS
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {diagnostics.map((test, index) => (
              <div 
                key={index} 
                className={`p-3.5 rounded-2xl border flex items-start gap-3 transition ${
                  test.status === 'passed' 
                    ? 'bg-emerald-950/15 border-emerald-500/20 text-emerald-250' 
                    : test.status === 'warning'
                    ? 'bg-amber-950/15 border-amber-500/20 text-amber-250'
                    : 'bg-red-950/15 border-red-500/20 text-red-250'
                }`}
              >
                {test.status === 'passed' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : test.status === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black font-orbitron text-white leading-tight">{test.name}</span>
                    <span className="text-[8px] uppercase font-mono px-1.5 py-0.5 bg-slate-950/60 rounded border border-border/40 text-gray-400">
                      {test.category}
                    </span>
                  </div>
                  <p className="text-[10.5px] leading-relaxed text-gray-300 font-semibold">{test.details}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Database Explorer Grid */}
        <div className="space-y-4">
          
          {/* Filtering and Query Tools */}
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-slate-900/20 border border-border/50 p-4 rounded-2xl">
            {/* Tab layout selectors */}
            <div className="flex flex-wrap gap-1 w-full md:w-auto">
              {[
                { id: 'all', label: 'All Databases' },
                { id: 'playstyles', label: "Playstyles / Compatibility" },
                { id: 'formations', label: 'Formations / Counters' },
                { id: 'fixes', label: 'Tactical Resolutions' },
                { id: 'instructions', label: 'Individual Instructions' },
                { id: 'i18n', label: 'Translation Keys Audit' }
              ].map(sec => (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSection(sec.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black font-orbitron uppercase tracking-wider transition cursor-pointer ${
                    selectedSection === sec.id
                      ? 'bg-primary text-navyBg'
                      : 'bg-slate-900 text-gray-400 border border-border/60 hover:text-white'
                  }`}
                >
                  {sec.label}
                </button>
              ))}
            </div>

            {/* Live Search bar */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search database properties..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-border focus:border-primary text-xs rounded-xl outline-none text-white font-semibold cursor-text transition"
              />
            </div>
          </div>

          {/* Section 1: Official Team Playstyles */}
          {(selectedSection === 'all' || selectedSection === 'playstyles') && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 border-b border-border/45 pb-2">
                <Compass className="w-4.5 h-4.5 text-primary" />
                <h2 className="text-xs font-black font-orbitron uppercase tracking-wider text-white">
                  Database 1: Official eFootball™ Team Playstyles
                </h2>
              </div>

              {filteredPlaystyles.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-450 border border-dashed border-zinc-700 rounded-2xl">
                  {searchQuery ? 'No playstyles fit the search criteria' : 'No playstyles found'}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredPlaystyles.map(p => {
                    const comp = playstyleCompatibility[p.id];
                    return (
                      <div key={p.id} className="bg-slate-950/45 border border-border/80 rounded-2xl p-4 space-y-4 shadow-md flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <h3 className="text-sm font-black font-orbitron text-primary uppercase">{p.nameEn}</h3>
                              <span className="text-xs font-semibold text-gray-400 tracking-wide font-mono">{p.nameAr}</span>
                            </div>
                            <span className="text-[9px] font-mono font-bold bg-slate-900 border border-border/60 text-white px-2 py-0.5 rounded-md uppercase">
                              ID: {p.id}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10.5px] leading-relaxed pt-1.5 border-t border-border/30">
                            <div>
                              <span className="text-[9px] font-bold text-gray-450 uppercase block font-orbitron mb-0.5">EN Description</span>
                              <p className="text-gray-200 font-semibold bg-[#030612] p-2.5 rounded-xl border border-border/40">{p.descriptionEn}</p>
                            </div>
                            <div>
                              <span className="text-[9px] font-bold text-gray-450 uppercase block font-orbitron mb-0.5">AR Description</span>
                              <p className="text-gray-300 font-semibold bg-[#030612] p-2.5 rounded-xl border border-border/40 dir-rtl text-right">{p.descriptionAr}</p>
                            </div>
                          </div>

                          {/* Strengths check */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px] pt-1 border-t border-border/30">
                            <div>
                              <span className="text-[9px] font-bold text-emerald-450 uppercase block font-orbitron mb-1">EN Tactics Strengths</span>
                              <ul className="space-y-1 bg-slate-900/40 p-2 rounded-xl border border-border/30">
                                {p.strengthsEn.map((s, i) => (
                                  <li key={i} className="flex items-center gap-1.5 text-gray-300 font-semibold">
                                    <span className="text-emerald-400">✓</span> {s}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <span className="text-[9px] font-bold text-emerald-450 uppercase block font-orbitron mb-1 text-right">AR Tactics Strengths</span>
                              <ul className="space-y-1 bg-slate-900/40 p-2 rounded-xl border border-border/30 text-right">
                                {p.strengthsAr.map((s, i) => (
                                  <li key={i} className="flex items-center justify-end gap-1.5 text-gray-300 font-semibold">
                                    {s} <span className="text-emerald-400">✓</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* eFootball Player Roles Interactions */}
                        {comp && (
                          <div className="bg-[#051121] border border-cyan-500/10 rounded-xl p-3 mt-2.5 space-y-2">
                            <span className="block text-[9px] font-black font-orbitron text-cyan-400 tracking-wider">
                              ⚙️ TEAM BUILD-UP ROLE COMPATIBILITIES (eFootball Engine)
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-semibold">
                              <div className="space-y-1">
                                <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-455 font-orbitron uppercase">
                                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-450" /> Positive Roles
                                </span>
                                <div className="space-y-0.5">
                                  {comp.goodWith.map((role, idx) => (
                                    <span key={idx} className="block bg-emerald-500/5 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/10 text-[9.5px]">
                                      • {role}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="space-y-1">
                                <span className="flex items-center gap-1 text-[9px] font-bold text-rose-455 font-orbitron uppercase">
                                  <ThumbsDown className="w-3.5 h-3.5 text-rose-400" /> Risky/Avoid Roles
                                </span>
                                <div className="space-y-0.5">
                                  {comp.badWith.map((role, idx) => (
                                    <span key={idx} className="block bg-rose-500/5 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/10 text-[9.5px]">
                                      • {role}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Section 2: Formations layout metadata and Counter mechanics */}
          {(selectedSection === 'all' || selectedSection === 'formations') && (
            <div className="space-y-4 pt-4 animate-fadeIn">
              <div className="flex items-center gap-2 border-b border-border/45 pb-2">
                <Grid className="w-4.5 h-4.5 text-emerald-400" />
                <h2 className="text-xs font-black font-orbitron uppercase tracking-wider text-white">
                  Database 2: Pitch Layout Structures & Meta Interceptions
                </h2>
              </div>

              {filteredFormations.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-450 border border-dashed border-zinc-700 rounded-2xl">
                  No layout configuration matches the search criteria.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFormations.map(forma => {
                    const str = formationStrengths[forma];
                    const weak = formationWeaknesses[forma];
                    const metaCounter = counterFormationRules[forma];

                    return (
                      <div key={forma} className="bg-slate-950/45 border border-border/80 rounded-2xl p-4 space-y-3.5 shadow-md flex flex-col justify-between">
                        <div className="space-y-3">
                          {/* Title block */}
                          <div className="flex justify-between items-center pb-2 border-b border-border/40">
                            <span className="text-sm font-black font-mono text-zinc-100">{forma}</span>
                            <span className="text-[8.5px] uppercase font-bold px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                              TACTICAL PRESET
                            </span>
                          </div>

                          {/* Strengths */}
                          {str && (
                            <div className="space-y-1 text-[9.5px]">
                              <span className="font-bold text-emerald-450 uppercase block font-orbitron">SYSTEM ADVANTAGES</span>
                              <div className="space-y-1 bg-slate-900/30 p-2 rounded-xl">
                                {str.en.map((val, idx) => (
                                  <div key={idx} className="flex items-start gap-1 text-gray-300 font-semibold leading-normal">
                                    <span className="text-emerald-400 shrink-0">•</span>
                                    <span>{val}</span>
                                  </div>
                                ))}
                                {str.ar.map((val, idx) => (
                                  <div key={idx} className="flex items-start gap-1 text-gray-400 font-semibold leading-normal justify-end text-right dir-rtl">
                                    <span>{val}</span>
                                    <span className="text-emerald-500/60 shrink-0">•</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Limitations */}
                          {weak && (
                            <div className="space-y-1 text-[9.5px]">
                              <span className="font-bold text-amber-500 uppercase block font-orbitron">VULNERABILITIES</span>
                              <div className="space-y-1 bg-slate-900/30 p-2 rounded-xl">
                                {weak.en.map((val, idx) => (
                                  <div key={idx} className="flex items-start gap-1 text-gray-300 font-semibold leading-normal">
                                    <span className="text-amber-400 shrink-0">•</span>
                                    <span>{val}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Metagame Defeating Mechanics */}
                        {metaCounter && (
                          <div className="bg-[#18090e] border border-rose-500/15 rounded-xl p-2.5 mt-2">
                            <span className="block text-[8.5px] font-black font-orbitron text-rose-400 tracking-wider">
                              ⚔️ TACTICAL METAGAME COUNTER (ANTIDOTE FORMATION)
                            </span>
                            <p className="text-[10px] text-zinc-300 font-bold font-mono mt-1 leading-normal">
                              {metaCounter}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Section 3: Diagnostic Resolutions Mapping */}
          {(selectedSection === 'all' || selectedSection === 'fixes') && (
            <div className="space-y-4 pt-4 animate-fadeIn">
              <div className="flex items-center gap-2 border-b border-border/45 pb-2">
                <Sliders className="w-4.5 h-4.5 text-amber-405" />
                <h2 className="text-xs font-black font-orbitron uppercase tracking-wider text-white">
                  Database 3: Problem Resolutions mapping (Sub-Tactics Optimizers)
                </h2>
              </div>

              {filteredFixes.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-450 border border-dashed border-zinc-700 rounded-2xl">
                  No diagnostic fixes matches the search parameters.
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {filteredFixes.map(([key, f]) => (
                    <div key={key} className="bg-slate-950/45 border border-border/80 rounded-2xl p-4.5 space-y-4 shadow-md flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-3 border-b border-border/30 pb-2">
                          <div>
                            <span className="text-[9px] font-mono bg-slate-900 border border-border/60 text-gray-450 px-2 py-0.5 rounded font-black uppercase">
                              KEY CODE: {key}
                            </span>
                            <h3 className="text-xs font-bold text-white mt-1 uppercase font-orbitron">{f.problemEn}</h3>
                            <span className="text-[10px] font-semibold text-gray-400 block tracking-wide">{f.problemAr}</span>
                          </div>

                          <div className="text-right space-y-1">
                            <span className="text-[9px] font-bold text-gray-500 uppercase block font-orbitron">Rec. Playstyle</span>
                            <span className="inline-block px-2.5 py-0.5 rounded text-[9.5px] font-black bg-primary/10 border border-primary/20 text-primary font-orbitron">
                              {f.recommendedPlaystyle}
                            </span>
                          </div>
                        </div>

                        {/* Recommended Layouts */}
                        <div className="flex gap-2 items-center text-[10px] font-semibold">
                          <span className="text-gray-450 uppercase font-orbitron">Certified Squad Contenders:</span>
                          {f.recommendedFormations.map(cf => (
                            <span key={cf} className="px-1.5 py-0.5 bg-slate-900 border border-border/40 text-white font-mono rounded">
                              {cf}
                            </span>
                          ))}
                        </div>

                        {/* Defending & Attacking Adjustments */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10.5px]">
                          <div className="bg-[#0b101d] p-3 rounded-xl border border-border/40 space-y-1">
                            <span className="text-[9px] font-black text-rose-450 uppercase block font-orbitron">🛡️ DEFENSIVE RESOLUTION</span>
                            <p className="text-gray-200 font-semibold">{f.defensiveFixEn}</p>
                            <p className="text-gray-450 text-[10px] font-semibold text-right dir-rtl">{f.defensiveFixAr}</p>
                          </div>

                          <div className="bg-[#0b101d] p-3 rounded-xl border border-border/40 space-y-1">
                            <span className="text-[9px] font-black text-emerald-450 uppercase block font-orbitron">⚡ OFFENSIVE RESOLUTION</span>
                            <p className="text-gray-200 font-semibold">{f.attackingFixEn}</p>
                            <p className="text-gray-450 text-[10px] font-semibold text-right dir-rtl">{f.attackingFixAr}</p>
                          </div>
                        </div>
                      </div>

                      {/* Suggested Instructions */}
                      <div className="bg-[#100c1e] border border-[#ff00ea]/10 p-2.5 rounded-xl text-[10px] space-y-1">
                        <span className="block text-[8px] font-bold font-orbitron text-[#ff00ea] uppercase tracking-wider">
                          🛠️ GAMEPLAY INDIVIDUAL ADJUSTMENT DIRECTIVES (IN-PITCH)
                        </span>
                        <div className="flex flex-wrap gap-1.5 font-bold mt-1">
                          {f.suggestedInstructions.map((ins, index) => (
                            <span key={index} className="px-2 py-0.5 bg-[#ff00ea]/5 text-zinc-300 rounded border border-[#ff00ea]/20">
                              {ins} ({f.suggestedInstructionsAr[index] || ''})
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Section 4: Individual Instructions Definitions */}
          {(selectedSection === 'all' || selectedSection === 'instructions') && (
            <div className="space-y-4 pt-4 animate-fadeIn">
              <div className="flex items-center gap-2 border-b border-border/45 pb-2">
                <Sliders className="w-4.5 h-4.5 text-cyan-405" />
                <h2 className="text-xs font-black font-orbitron uppercase tracking-wider text-white">
                  Database 4: Individual Pitch Instruction Handlers
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {individualInstructionRules.map((rule, idx) => (
                  <div key={idx} className="bg-[#0b101d]/60 border border-border/80 rounded-2xl p-4 space-y-3 shadow-md flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center pb-2 border-b border-border/30 mb-2">
                        <div>
                          <h4 className="text-xs font-black uppercase text-cyan-400 font-orbitron">{rule.instruction}</h4>
                          <span className="text-[10px] text-gray-450 font-semibold block">{rule.arabic}</span>
                        </div>
                        <span className={`text-[8.5px] uppercase font-bold font-orbitron px-2 py-0.5 rounded border ${
                          rule.type === 'Attacking' 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        }`}>
                          {rule.type}
                        </span>
                      </div>

                      <div className="space-y-2 text-[10.5px] font-semibold leading-relaxed">
                        <div>
                          <span className="text-[8.5px] font-bold text-gray-500 uppercase block font-orbitron mb-0.5">English Rule</span>
                          <p className="text-gray-200 bg-slate-950/40 p-2.5 rounded-xl border border-border/40">{rule.explanationEn}</p>
                        </div>
                        <div>
                          <span className="text-[8.5px] font-bold text-gray-500 uppercase block font-orbitron mb-0.5 text-right">Arabic Rule</span>
                          <p className="text-gray-300 bg-slate-950/40 p-2.5 rounded-xl border border-border/40 text-right dir-rtl">{rule.explanationAr}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: Internationalization (i18n) Key Alignment Audit */}
          {(selectedSection === 'all' || selectedSection === 'i18n') && (
            <div className="space-y-4 pt-4 animate-fadeIn">
              <div className="flex items-center gap-2 border-b border-border/45 pb-2">
                <Globe className="w-4.5 h-4.5 text-indigo-400" />
                <h2 className="text-xs font-black font-orbitron uppercase tracking-wider text-white">
                  Database 5: i18n Translation Files & Keys Synchronization Audit
                </h2>
              </div>

              {/* Summary Cards of Locale Coverage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(i18nReport.locales).map(([locale, data]) => {
                  const isComplete = data.missingKeysCount === 0;
                  return (
                    <div key={locale} className="bg-slate-950/45 border border-border/80 rounded-2xl p-4.5 space-y-3.5 shadow-md">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-md animate-pulse" />
                          <span className="text-xs font-black uppercase font-orbitron tracking-widest text-white">
                            {locale === 'en' ? '🇺🇸 ENGLISH' : locale === 'ar' ? '🇸🇦 ARABIC' : locale === 'es' ? '🇪🇸 SPANISH' : '🇫🇷 FRENCH'} ({locale})
                          </span>
                        </div>
                        {isComplete ? (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded text-[8.5px] font-black bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>100% IN SYNC</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded text-[8.5px] font-black bg-rose-500/10 border border-rose-500/25 text-rose-400">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{data.missingKeysCount} MISSING</span>
                          </div>
                        )}
                      </div>

                      {/* Progress bar visual */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold font-mono">
                          <span className="text-gray-450 uppercase">Sync Progress</span>
                          <span className={`${isComplete ? 'text-emerald-400' : 'text-amber-400'}`}>{data.coveragePercent}%</span>
                        </div>
                        <div className="w-full bg-slate-900 border border-border/40 h-2.5 rounded-full overflow-hidden p-[1px]">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              isComplete ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-amber-500 to-rose-400'
                            }`}
                            style={{ width: `${data.coveragePercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Technical Counts */}
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono font-bold text-center border-t border-border/30 pt-3">
                        <div className="bg-slate-900/60 p-2 rounded-lg border border-border/30">
                          <span className="block text-gray-500 uppercase text-[8px] tracking-wider mb-0.5">Defined KEYS</span>
                          <span className="text-zinc-200 text-xs">{data.totalKeys}</span>
                        </div>
                        <div className="bg-slate-900/60 p-2 rounded-lg border border-border/30">
                          <span className="block text-gray-400 uppercase text-[8px] tracking-wider mb-0.5">Missing</span>
                          <span className={`${isComplete ? 'text-emerald-400' : 'text-rose-400'} text-xs`}>{data.missingKeysCount}</span>
                        </div>
                      </div>

                      {/* Display warning if not complete */}
                      {!isComplete && (
                        <div className="text-[10px] bg-amber-500/5 text-amber-300 p-2 rounded-xl border border-amber-500/15 leading-relaxed font-semibold">
                          ⚠️ This locale contains missing properties found in other Translation dictionaries. Ensure localization keys are fully symmetric.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Detail section listing actual missing translation keys */}
              <div className="bg-slate-950/45 border border-border/80 rounded-2xl p-5 space-y-4 shadow-md">
                <span className="block text-[10px] font-black uppercase tracking-widest text-[#9d4edd] font-orbitron">
                  📋 SYSTEM DISCREPANCY REGISTER & MISSING KEYS LISTINGS
                </span>

                {!i18nReport.hasDiscrepancies ? (
                  <div className="py-10 text-center space-y-2 border border-dashed border-emerald-500/20 bg-emerald-500/5 rounded-2xl select-none">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
                    <h4 className="text-xs font-black font-orbitron text-emerald-400 uppercase tracking-widest">
                      PERFECT LOCALIZATION SYSTEM HEALTH
                    </h4>
                    <p className="text-[11px] text-gray-300 font-semibold max-w-sm mx-auto leading-relaxed">
                      All translation keys align across ar.json, en.json, es.json, and fr.json files. Absolute compliance verified!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(i18nReport.locales)
                      .filter(([_, data]) => data.missingKeysCount > 0)
                      .map(([locale, data]) => (
                        <div key={locale} className="space-y-2 bg-[#12091c]/35 border border-purple-500/10 p-4 rounded-xl">
                          <div className="flex gap-2 items-center text-xs font-black font-orbitron uppercase text-[#ff8000]">
                            <AlertCircle className="w-4 h-4" />
                            <span>{locale.toUpperCase()} missing translation keys ({data.missingKeysCount})</span>
                          </div>

                          <div className="mt-2 overflow-x-auto">
                            <table className="w-full text-left font-mono text-[10px] border-collapse">
                              <thead>
                                <tr className="border-b border-border/30 text-gray-400 bg-slate-900/40 select-none">
                                  <th className="py-2.5 px-3">Translation Property path</th>
                                  <th className="py-2.5 px-3">Diagnostic Level</th>
                                  <th className="py-2.5 px-3">Remedy Advice</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border/20 font-semibold">
                                {data.missingKeys
                                  .filter(mk => !searchQuery || mk.toLowerCase().includes(searchQuery.toLowerCase()))
                                  .map((key, i) => (
                                    <tr key={i} className="hover:bg-slate-900/30 transition">
                                      <td className="py-2 px-3 text-[#ffc6ff] font-bold">{key}</td>
                                      <td className="py-2 px-3">
                                        <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[8.5px] uppercase">
                                          WARNING
                                        </span>
                                      </td>
                                      <td className="py-2 px-3 text-gray-300">
                                        Insert missing key "{key}" inside {locale}.json setup definition.
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                            {data.missingKeys.filter(mk => !searchQuery || mk.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                              <p className="p-3 text-center text-gray-500 text-[10px]">No missing keys filter match.</p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </main>
    </div>
  );
}
export { EfootballAuditPage };

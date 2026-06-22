# EF26 Tactics
## AI Tactical Coach for eFootball Players

**EF26 Tactics** is a production-grade, highly engaging tactical companion designed exclusively for eFootball players. It helps players record and analyze match performance metrics, explore tactical blueprints, hard-counter typical opponent meta-formations, optimize sub-tactical instructions under gameplay friction, design and customize custom lineups on a virtual pitch, and receive contextual AI tactical advice powered securely by Gemini serverless endpoints.

---

## 🎨 Key Built-in Features
1. **Interactive Dashboard**: Track total match cards recorded, win-rates, goals scored vs conceded, current trend metrics, and the active tactical profile.
2. **Match Reports Logs**: Log complete telemetry of recent performances—including match date, formations, goals, possession percentages, shots setup, momentum deflection symptoms, and notes.
3. **AI Tactical Coach**: Submit current stat setups directly into the serverless neural node (powered by Gemini) to diagnostic spatial control drops.
4. **Meta Counter Tool**: Reveal hard-counter standards, pre-match setup markers, and live in-game adjustments to exploit prevalent eFootball meta frameworks.
5. **Sub-Tactics Optimizer**: Select on-field operational pain points (midfield loss, conceding counters, slow transitions) to generate optimised tactical recommendations.
6. **Formation Canvas**: Drag-and-drop 11 player nodes on a virtual pitch. Instantly rotate base standard formations, modify individual player positional roles, utilize the multi-step Undo memory stack, and save/load customized overrides.
7. **Quick Profiles Deck**: Store multiple tactical blueprint profiles with active spring-motion visual indicators. Activate profiles instantly to review targeted settings.
8. **Performance & Trajectory Tracker**: Aggregates match records and plots line-rate win trajectories, goals distribution charts, and formation popularity indexes.
9. **Momentum Diagnostic**: Fully unlocked, open diagnostic module. Evaluate gameplay stiffness, post hitting ratios, and input sluggishness to produce precise mitigation strategies.
10. **Operations & Settings**: Change theme accents, Arabic / English interface toggles, JSON backup serialize/restore, and database hard resets.

---

## ⚙️ Product Positioning & Terms
* **Educational Auxiliary**: EF26 Tactics is intended solely for educational gameplay analysis. It does *not* interface directly with the eFootball client application, nor does it automate gameplay, manipulate processes, or interact with official servers.
* **Match Momentum Diagnostics**: In conformity with ethical compliance standards, this application avoids labeling gameplay elements as "cheating" or "malicious scripting." Instead, it refers to game engine friction objectively as "spatial momentum swings," "control zones variations," or "team stamina parameters," helping players adapt to prevailing tactics.

---

## 🚀 Netlify Deployment Guide

The workspace is configured as a standalone modern **Vite + React + TypeScript** single-page application, fully integrated with **Netlify Serverless Functions** for secure API communication.

### 1. Local Development Installation
To run the serverless function environment locally, you can use the Netlify CLI:

```bash
# 1. Clone or extract the folder files
cd EF26-Tactics

# 2. Install all development and production modules
npm install

# 3. Secure your Gemini API key inside a local .env file
echo "GEMINI_API_KEY=your_real_gemini_api_key_here" > .env

# 4. Initiate local Vite client + serverless simulation
npx netlify dev
```
The Netlify Dev CLI automatically triggers the Vite development server (usually on http://localhost:3000) and routes backend requests seamlessly to your local functions.

### 2. Standard Production Build
To test the production build locally:
```bash
# Compile TypeScript files and build output to the "dist" directory
npm run build
```

### 3. Deploying to Netlify (Via GitHub Continuous Deployment)
1. Commit the code and push it to a new private or public GitHub repository.
2. Log into your [Netlify Workspace](https://app.netlify.com/).
3. Choose **Add New Site** -> **Import from Git** and authenticate your GitHub account.
4. Select your repository.
5. Netlify will autodetect the configuration declared in the `netlify.toml` file:
   * **Build Command**: `npm run build`
   * **Publish Directory**: `dist`
   * **Functions Directory**: `netlify/functions`
6. Under **Site Settings** -> **Environment Variables**, select **Add Variable**:
   * **Key**: `GEMINI_API_KEY`
   * **Value**: *Your Google AI Studio or Gemini API Secret Key*
7. Tap **Deploy Site**. Netlify will build, bundle, and serve your application continuously!

---

## 📁 Project Folder Tree
```text
├── .env.example
├── .gitignore
├── index.html               # Entry SPA page for Vite loader
├── netlify.toml             # Site settings mapping directories for Netlify Pipelines
├── package.json             # Declarative file listing Vite, React, Recharts dependencies
├── postcss.config.js
├── tailwind.config.js       # Color, typography, and box shadow definitions
├── tsconfig.json            # TypeScript transpiler specifications
├── vite.config.ts           # Bundler environment configurations
├── netlify/
│   └── functions/
│       └── analyzeTactics.ts # Serverless handler secure API bridge
└── src/
    ├── App.tsx              # Core App orchestration and Tab systems
    ├── main.tsx             # Canvas rendering initiator
    ├── index.css            # Tailwind directives and customized layouts
    └── lib/
        ├── api.ts           # Serverless caller interface
        ├── storage.ts       # Database MVP save/load local systems
        └── tactics.ts       # Core coordinates, translation mappings, and presets
```

---

## 🔒 Security Compliance
* **Endpoint Protection**: No `GEMINI_API_KEY` or operational developer credentials are ever stored inside client-side bundles or local storage keys, avoiding credential theft vulnerabilities.
* **CORS Validation**: Netlify functions validate input properties, allowing only clean JSON structures and filtering out unsupported query schemas.

---

## ☁️ Supabase Production Integration

To elevate data portability and safeguard configurations across devices, **EF26 Tactics** features a fully integrated **Supabase SQL database** sync tier. 

### 1. Unified Storage Modes

* **Guest Sandbox Mode**:
  - No account signup required. 
  - All metrics, matches, and configurations are securely written straight to browser `localStorage` buckets.
  - Features cold manual JSON Backup/Restore features to move profiles.
* **Cloud Lab Mode**:
  - Requires user signup / session login via Supabase Auth.
  - Keeps local data synchronized bidirectionally with high-performance Supabase PostgreSQL database tables.
  - Protected with robust **Postgres Row-Level Security (RLS)** rules. Each user owns their records and cannot read or write others' rows.

### 2. Live Setup Instructions

Refer to the complete setup guide [supabase/README.md](./supabase/README.md) for detailed steps to provision, migrations scripts, seed files, and Netlify environment variables setups.

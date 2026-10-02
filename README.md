# AuraGen-AI: Self-Healing Generative UI via Cognitive Load Detection

AuraGen-AI is an intelligent, real-time UI adaptation engine designed to evaluate user cognitive load and automatically heal UX friction by dynamically generating simplified, guided interfaces using **LangChain**, **Google Gemini**, **Socket.IO**, and **Next.js**.

---

## 🌟 Key Architecture & Highlights

```
┌─────────────────────────────────────────────────────────────┐
│                       Frontend (Next.js)                   │
│                                                             │
│  ┌──────────────────────┐        ┌───────────────────────┐  │
│  │  Telemetry Tracker   │        │   Dynamic Renderer    │  │
│  │  (Mouse velocity,    │        │  (Step-by-step wizard │  │
│  │   Rage clicks,       │        │   with state sync)    │  │
│  │   Dwell timers)      │        └───────────▲───────────┘  │
│  └──────────┬───────────┘                    │              │
└─────────────┼────────────────────────────────┼──────────────┘
              │  WebSocket:                    │  WebSocket:
              │  COGNITIVE_LOAD_HIGH (>80%)    │  AURAGEN_TRIGGERED
              ▼                                │  (UI Spec JSON)
┌──────────────────────────────────────────────┴──────────────┐
│                  Backend (Node.js + Express)                │
│                                                             │
│  ┌──────────────────────┐        ┌───────────────────────┐  │
│  │ Socket.IO Handlers   │───────▶│  LangChain Pipeline   │  │
│  └──────────────────────┘        │  (Gemini + UI Specs)  │  │
│                                  └───────────┬───────────┘  │
│                                              ▼              │
│                                  ┌───────────────────────┐  │
│                                  │     Zod Validator     │  │
│                                  └───────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Repository Structure

* **`Backend/`**
  * `src/server.js`: Express + Socket.IO server with CORS and health check endpoints.
  * `src/ai/uiGenerator.js`: LangChain pipeline with Google Gemini integration, UI Component Library prompting, and verified fallback specs.
  * `src/validation/uiSpecSchema.js`: Zod schema validation ensuring type-safety and layout structure.
  * `src/services/cognitiveEventService.js`: Event coordinator generating adaptive UI specs upon high friction signals.
  * `src/websocket/socketHandlers.js`: Real-time WebSocket connection manager.

* **`frontend/`**
  * `src/app/page.js`: Main dashboard coordinating loan application state, live telemetry badge, and dynamic UI mounting.
  * `src/hooks/useCognitiveLoad.js`: Real-time interaction telemetry engine tracking **mouse velocity, trajectory jitter, rage clicks, dwell hesitation, backtracking, and validation errors**.
  * `src/hooks/useSocket.js`: Real-time WebSocket client hook.
  * `src/hooks/useLoanForm.js`: Shared persistent form state manager across both standard and generative views.
  * `src/components/DynamicRenderer.js`: Dynamic Generative UI wizard with `dependsOn` branch evaluation and step navigation.
  * `src/components/CognitiveLoadBadge.js`: Real-time visual cognitive telemetry gauge with simulation controls.
  * `src/components/registry.js`: Component registry mapping dynamic JSON specs to UI components.

---

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd Backend
npm install
```

Configure your environment in `Backend/.env`:
```env
PORT=4000
FRONTEND_URL=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the backend:
```bash
npm start
# or for auto-reloading:
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit **`http://localhost:3000`** in your browser.

---

## 🧪 Testing the Self-Healing Flow
1. **Trigger via Telemetry**: Move cursor erratically, click rapidly (rage click), or stay idle on an empty field for >4.5s.
2. **Trigger via Simulation**: Click **"Simulate Critical Friction"** on the top-right telemetry badge.
3. Once cognitive load exceeds **80%**, the AI healing engine will activate and dynamically replace the complex section with a simplified, step-by-step guided flow.

### Developed By:Pradeep Kumar singha
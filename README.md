# Correlation Analyst

An AI-augmented statistical analysis tool that computes Pearson correlation coefficients across all numeric columns in a CSV dataset, visualizes results as an interactive heatmap, and generates natural language interpretation using an LLM.

<img width="1470" height="956" alt="Screenshot 2026-07-10 at 7 29 29 PM" src="https://github.com/user-attachments/assets/64825229-0d85-4ece-ad9c-98a2854bbcb7" />
<img width="1470" height="956" alt="Screenshot 2026-07-10 at 7 29 41 PM" src="https://github.com/user-attachments/assets/bb909172-3925-4b00-8b2c-7ba4d14cd7a3" />
<img width="1470" height="956" alt="Screenshot 2026-07-10 at 7 30 05 PM" src="https://github.com/user-attachments/assets/3340bf55-5d03-4bbc-bfab-9701bb8bde85" />

---

## What it does

1. User uploads a CSV file and provides a short dataset description
2. The app parses the file, extracts numeric columns, and computes a full correlation matrix using a from-scratch Pearson engine
3. Results are displayed as a color-coded interactive heatmap. Clicking any cell opens a scatter plot for that column pair
4. The three strongest correlations are automatically highlighted to guide exploration
5. An AI interpretation layer sends the top 10 pairs (as structured JSON) to an LLM, which reasons about what the correlations mean in the domain context and streams a response back in real time

---

## Architecture

```
CSV upload (browser)
  → csvParser.ts          # manual CSV parsing, no library
  → pearson.ts            # pure TS: mean, stdDev, pearson, computeCorrelationMatrix
  → CorrelationHeatmap    # color-coded grid, click-to-expand scatter plot
  → AnalysisPanel         # sends structured JSON to FastAPI proxy
      → FastAPI /analyze  # filters top 10 pairs, forwards to LLM
          → Gemini API    # streams natural language interpretation
      → useAnalysis hook  # consumes stream, updates UI progressively
```

The statistical computation is fully deterministic and independently tested. The LLM only receives the finished numbers and is responsible solely for natural language reasoning, not calculation.

---

## Tech stack

**Frontend**
- Vite + React + TypeScript
- No charting library. Heatmap and scatter plots are hand-built SVG
- Custom streaming hook for real-time LLM output rendering

**Backend**
- FastAPI (Python)
- httpx for async streaming to Gemini API
- Pydantic v2 for request validation

**AI layer**
- Google Gemini via Google AI Studio (free tier)
- Configurable via `LLM_PROVIDER` env variable (supports Gemini and Ollama)
- System prompt instructs the LLM to reference only provided numbers and not recalculate

**Deployment**
- Frontend: Vercel
- Backend: Render

---

## Key technical decisions

**1. From-scratch Pearson engine**

The entire statistical computation (mean, standard deviation, covariance, Pearson r) is implemented in `frontend/src/lib/pearson.ts` with no external math libraries. This was a deliberate constraint from the original project spec. The engine is tested independently with 21 Vitest unit tests before any UI touches it.

The constraint becomes meaningful at scale: instead of computing r once for two columns, the engine runs across all N*(N-1)/2 column pairs, making correctness and performance non-trivial.

**2. LLM receives structured JSON, not raw data**

The LLM never sees the CSV. It receives a filtered, serialized payload of the top 10 pairs sorted by absolute r value, with means and standard deviations included per pair. This keeps the context window small, prevents hallucinated statistics, and makes the AI layer independently auditable.

**3. Top 10 filtering before LLM call**

For datasets with many columns the correlation matrix grows as O(N^2). Sending all pairs would blow the context window and add noise. The backend sorts by |r| and forwards only the 10 most correlated pairs, which covers the statistically interesting signal without overwhelming the prompt.

**4. Streaming over single response**

The FastAPI endpoint uses `StreamingResponse` with server-sent events, and the React hook reads the response body as a `ReadableStream`. This makes the AI interpretation feel live rather than producing a loading delay followed by a wall of text.

**5. LLM provider abstraction**

The backend supports switching between Gemini and Ollama via a single `LLM_PROVIDER` environment variable. This was added to allow local development without API rate limits while keeping the production path pointed at Gemini.

---

## Local setup

**Prerequisites:** Node 18+, Python 3.11+

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`

**Backend**

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Runs on `http://localhost:8000`

**Environment variables**

Create `backend/.env`:

```
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.0-flash-lite
LLM_PROVIDER=gemini

# Optional: local fallback
OLLAMA_MODEL=llama3.2:3b
```

---

## Running tests

```bash
cd frontend
npx vitest run
```

21 tests across two suites: `csvParser.test.ts` and `pearson.test.ts`.

---

## Project structure

```
correlation-analyst/
├── frontend/
│   ├── src/
│   │   ├── components/       # UI: CSVUploader, DataPreview, CorrelationHeatmap, ScatterPlot, AnalysisPanel, Stepper
│   │   ├── hooks/            # useAnalysis: streaming fetch hook
│   │   ├── lib/              # csvParser.ts, pearson.ts, colorScale.ts (pure logic, zero UI)
│   │   └── types/            # dataset.ts: shared TypeScript interfaces
│   ├── vite.config.ts
│   └── vitest.config.ts
│
├── backend/
│   ├── app/
│   │   ├── api/routes.py     # POST /analyze endpoint
│   │   ├── core/llm.py       # Gemini / Ollama streaming logic
│   │   └── main.py           # FastAPI app, CORS config
│   └── requirements.txt
│
└── README.md
```

---

## Bugs encountered and resolved

**Test expectation was wrong, not the engine**

A Vitest assertion checking `pearson([1,2,3,4,5], [5,3,4,1,2])` expected `-0.7` but the correct value is `-0.8`. The implementation was right. The expected value in the test was an approximation that didn't match the actual mathematical result. Fixed by updating the expected value to `-0.8` with `toBeCloseTo(-0.8, 5)`. Caught by the failing assertion before any UI was built.

**Vite proxy path not stripping `/api` prefix**

The React frontend called `/api/analyze` but the FastAPI route was registered as `/analyze`. The Vite proxy was forwarding the full path including `/api`, causing 404s. Fixed by adding a `rewrite` function to the proxy config: `(path) => path.replace(/^\/api/, "")`.

**Description state not lifting correctly**

The "Run AI Analysis" button remained disabled even after typing a description. The description was stored as local state inside `CSVUploader`, which meant `AnalysisPanel` never saw the updated value. Fixed by lifting the description state to `App.tsx` and passing it down as a controlled prop, so both components always share the same value.

**Vitest config conflicting with Vite build**

The `test` field in `vite.config.ts` caused TypeScript build errors on Vercel (`Object literal may only specify known properties`). Fixed by separating the configs into `vite.config.ts` (build only) and `vitest.config.ts` (test only), using `vitest/config` for the test file.

**LLM provider rate limits during development**

Repeated curl requests during debugging burned through the Gemini free tier per-minute quota, causing 429 errors that looked like a configuration problem. The key was valid, the model was correct, the requests were just too frequent. Resolved by adding an `LLM_PROVIDER` env variable to switch to a local Ollama instance during active development.

---

## What was intentionally not built

- **User accounts and saved analyses**: adds significant backend scope without adding to the statistical or AI story
- **Multi-sheet Excel support**: PapaParse or SheetJS would handle this but CSV coverage is sufficient for the portfolio use case
- **Regression line on scatter plot**: the r value already communicates the linear relationship; the line would be visual redundancy
- **Dark mode**: no meaningful portfolio signal for a data tool
- **Mobile layout**: this is a desktop data analysis tool, mobile responsiveness is not the target use case

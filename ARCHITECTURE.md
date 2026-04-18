# ML Storyteller - Architecture & Project Plan

## 📁 Full Folder Structure

We are using a monorepo approach, separating the Next.js frontend from the Python FastAPI backend. This allows each side to scale independently and uses the best language for the job (JS/TS for UI, Python for Math/ML).

```text
/home/sameer/Desktop/project/
│
├── frontend/                     # ⚛️ Next.js + React Frontend
│   ├── package.json              # Node.js dependencies
│   ├── postcss.config.mjs        # Tailwind configuration 
│   ├── tailwind.config.ts        # Tailwind configuration
│   ├── tsconfig.json             # TypeScript configuration
│   ├── public/                   # Static assets (images, icons)
│   └── src/
│       ├── app/                  # Next.js App Router
│       │   ├── page.tsx          # Landing page (Select an algorithm)
│       │   ├── layout.tsx        # Main layout wrapper
│       │   ├── globals.css       # Global styles (Tailwind)
│       │   └── linear-regression/# Route for Linear Regression
│       │       └── page.tsx      # The main interactive page
│       ├── components/           # Reusable UI parts
│       │   ├── GraphCanvas.tsx   # The chart/graph visualization (Recharts/D3)
│       │   ├── StoryBox.tsx      # The animated story text component
│       │   └── Controls.tsx      # Play, Pause, Next Step buttons
│       ├── hooks/                # Custom React hooks
│       │   └── useAlgorithm.ts   # Logic to fetch data from Python backend
│       └── lib/                  # Utilities (API clients, formatting)
│           └── api.ts            # Fetch wrapper to talk to FastAPI
│
├── backend/                      # 🐍 Python FastAPI Backend
│   ├── requirements.txt          # Python dependencies (fastapi, uvicorn, numpy, etc.)
│   ├── main.py                   # FastAPI application entry point & routes
│   ├── .env                      # Environment variables (LLM API keys) - DO NOT COMMIT!
│   ├── core_algorithms/          # Pure math (No HTTP or API stuff here)
│   │   ├── __init__.py
│   │   └── linear_regression.py  # Gradient Descent implemented from scratch in NumPy
│   ├── storyteller/              # AI interaction logic
│   │   ├── __init__.py
│   │   ├── llm_client.py         # Code to call Gemini/OpenAI API
│   │   └── prompts.py            # The personas and instructions for the AI
│   └── models/                   # Pydantic schemas for data validation
│       ├── __init__.py
│       └── schemas.py            # Defines the shape of data sent to/from frontend
│
└── ARCHITECTURE.md               # This project documentation!
```

---

## 🧠 Important Points to Remember

### 1. Frontend Rules (Next.js & React)
* **Keep the UI Dumb:** The frontend should NOT do heavy math. Its only job is to draw the graph based on the numbers the backend gives it, and handle user clicks.
* **Smooth Animations:** Use library features to tween/animate the line moving between steps. React handles state changes, so every time you fetch a new step from the backend, update standard React state (`useState`) to trigger a re-render.
* **Client Components vs Server Components:** Since this app is highly interactive, your graph and controls will need to be Client Components (`"use client";` at the top of the file in Next.js).

### 2. Backend Rules (Python FastAPI)
* **State Management:** HTTP is stateless. If the user clicks "Next Step", the backend needs to know where they left off. *Trick:* Have the frontend send the *current* weights (slope and intercept) and the data points in the API request, so the backend just calculates `current + 1 step` and returns the new weights.
* **Separation of Concerns:** Keep your math in `core_algorithms`. Keep your API routing in `main.py`. Do not mix FastAPI code with pure NumPy math.
* **Validate Data:** Use Pydantic in FastAPI to ensure the frontend is sending valid numbers before attempting to run math on them.

### 3. The Storyteller (LLM Integration)
* **Keep Prompts Dynamic:** Pass the current state (e.g., "The error decreased from 50 to 20") into your prompt so the AI can comment on the *actual* progress of the algorithm.
* **System Persona:** Define a strict system prompt. E.g., *"You are a pizza shop owner explaining linear regression to a teenager. You are currently looking at step {step_number} where the error is {error}. Explain what just happened in 2 sentences."*

### 4. Development Workflow
* **CORS is your enemy:** Since Next.js runs on port `3000` (usually) and FastAPI on port `8000`, your browser will block requests unless you explicitly enable CORS (Cross-Origin Resource Sharing) in your FastAPI `main.py`.
* **Version Control:** Add `.env`, `node_modules/`, and `__pycache__/` to your `.gitignore` immediately. Never commit API keys.
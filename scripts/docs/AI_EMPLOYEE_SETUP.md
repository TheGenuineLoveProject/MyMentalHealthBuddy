# healer_bot quick test
- GET  /api/ai/health
- POST /api/ai/chat  {"messages":[{"role":"user","content":"help me journal"}]}
- Safe mock if OPENAI_API_KEY is missing.
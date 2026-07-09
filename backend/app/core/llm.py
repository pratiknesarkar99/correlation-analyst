import os
import httpx
import json
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent.parent / ".env")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:streamGenerateContent?alt=sse&key={GEMINI_API_KEY}"

SYSTEM_PROMPT = """You are a statistical analyst reviewing correlation analysis results.

You will be given:
- A description of the dataset
- The top correlated column pairs with their Pearson r values, sample size, means, and standard deviations
- All values have been computed externally. Do not recalculate or invent numbers.

Your response must follow this structure:
1. Overview: A 2-3 sentence summary of what the dataset appears to measure and the general correlation landscape.
2. Key Findings: For each pair provided, give one sentence explaining what the correlation means in practical terms. Reference the r value explicitly.
3. Surprising or Noteworthy: Flag any correlations that are unexpectedly strong, weak, or counterintuitive given the domain.
4. Suggested Next Steps: Recommend 2-3 specific follow-up analyses the user could run given these findings.

Be specific, concise, and grounded only in the numbers provided. Do not speculate beyond what the data supports."""


def build_user_message(data: dict) -> str:
    top_pairs = sorted(
        data["matrix"],
        key=lambda e: abs(e["r"]),
        reverse=True
    )[:10]

    pairs_text = "\n".join([
        f"- {e['colA']} vs {e['colB']}: r={e['r']:.4f}, n={e['n']}, "
        f"mean({e['colA']})={e['xMean']:.2f}, mean({e['colB']})={e['yMean']:.2f}, "
        f"stddev({e['colA']})={e['xStdDev']:.2f}, stddev({e['colB']})={e['yStdDev']:.2f}"
        for e in top_pairs
    ])

    return f"""Dataset description: {data['description']}

Top correlated pairs (sorted by absolute r value):
{pairs_text}"""


async def stream_analysis(data: dict):
    user_message = build_user_message(data)

    payload = {
        "system_instruction": {
            "parts": [{"text": SYSTEM_PROMPT}]
        },
        "contents": [
            {
                "role": "user",
                "parts": [{"text": user_message}]
            }
        ],
        "generationConfig": {
            "temperature": 0.4,
            "maxOutputTokens": 1024,
        }
    }

    async with httpx.AsyncClient(timeout=60) as client:
        async with client.stream(
            "POST",
            GEMINI_URL,
            headers={"Content-Type": "application/json"},
            json=payload,
        ) as response:
            print("STATUS:", response.status_code, flush=True)
            async for line in response.aiter_lines():
                if not line.startswith("data: "):
                    continue
                chunk = line[6:]
                if chunk.strip() == "[DONE]":
                    break
                try:
                    parsed = json.loads(chunk)
                    delta = (
                        parsed["candidates"][0]["content"]["parts"][0]["text"]
                    )
                    if delta:
                        yield delta
                except (json.JSONDecodeError, KeyError):
                    continue
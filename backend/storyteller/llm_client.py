import os
from google import genai
from dotenv import load_dotenv
from models.schemas import GradientDescentState, KMeansState

# Load environment variables (your API key)
load_dotenv()

# Initialize Gemini Model
api_key = os.getenv("GEMINI_API_KEY")
client = None
model_id = 'gemini-2.5-flash'

if api_key and api_key != "your_api_key_goes_here":
    client = genai.Client(api_key=api_key)
else:
    print("Warning: No GEMINI_API_KEY found in .env. Falling back to mock storyteller.")


# ---------- Linear Regression Storyteller ----------
def generate_story(state: GradientDescentState, cost: float, previous_cost: float) -> str:
    # 1. Fallback if the user hasn't set up their API key yet
    if not client:
        if state.step_number == 0:
            return "Welcome! (To see real AI here, add your GEMINI_API_KEY to the backend/.env file). Let's learn!"
        diff = cost - previous_cost
        direction = "shrinking" if diff < 0 else "growing"
        return f"Step {state.step_number}: We adjusted the slope (m) to {state.m:.2f}. Our error is {direction}. (Mock AI fallback)"

    diff = cost - previous_cost

    # PERFORMANCE FIX: LLMs take 1-2 seconds to reply. 
    # To keep the animation fast and beautiful, we only ask the AI for a story every 3 steps!
    if state.step_number != 0 and state.step_number % 3 != 1:
        direction = "getting smaller!" if diff < 0 else "growing!"
        return f"Step {state.step_number}: Fast math update! The error is {direction} (Waiting for AI's next joke...)"

    # 2. Dynamic Real-World LLM Prompting
    
    prompt = f"""
    You are an energetic, fun Pizza Shop Owner teaching a student Machine Learning.
    We are running Gradient Descent to predict pizza delivery times based on distance.
    Current mathematical step: {state.step_number}
    Current Error (Cost): {cost:.2f}
    Change in Error from last step: {diff:.2f} (Negative means we are improving! Positive means we guessed too wildly.)
    Current line slope: {state.m:.2f}
    
    Write exactly ONE short, punchy, exciting sentence explaining what just happened. 
    Relate the math to pizza delivery! Keep it under 15 words!
    """
    
    try:
        response = client.models.generate_content(
            model=model_id,
            contents=prompt
        )
        # Clean up the response (remove quotes/newlines)
        return (response.text or "").replace('\n', ' ').replace('"', '').strip()
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return "Woah, the pizza oven acting up! The math still updated though."


# ---------- K-Means Storyteller ----------
def generate_kmeans_story(state: KMeansState, has_converged: bool) -> str:
    if not client:
        if has_converged: return "🎉 Cluster Complete! (Mock AI Fallback)"
        if state.step_number % 3 != 1: return f"Step {state.step_number} ({state.phase} Phase) complete!"
        return f"Step {state.step_number} ({state.phase} Phase) complete! (Mock AI Fallback)"

    # PERFORMANCE FIX: Don't block the animation waiting for AI on every single step.
    if not has_converged and state.step_number != 0 and state.step_number % 3 != 1:
        return f"Step {state.step_number} ({state.phase} Phase): Instantly recalculating distances..."
        
    prompt = f"""
    You are a witty, fun Matchmaker teaching a student about K-Means Clustering.
    We are trying to match random people into friend groups.
    Current step: {state.step_number}
    Has Converged (Finished?): {has_converged}
    Current Phase: "{state.phase}" (If assign: we colored people to match the closest group. If update: we moved the group center to the middle of the people).
    
    Write exactly ONE short, funny sentence explaining what just happened in this step.
    Keep it under 15 words! Do not use complex math jargon!
    """
    
    try:
        response = client.models.generate_content(
            model=model_id,
            contents=prompt
        )
        return (response.text or "").replace('\n', ' ').replace('"', '').strip()
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return "The Matchmaker is taking a break, but the clusters are updating!"


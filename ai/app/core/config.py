import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    GEMINI_KEYS = [
        value for key, value in os.environ.items() 
        if key.startswith("GEMINI_API_KEY")
    ]
    
    if not GEMINI_KEYS:
        raise ValueError("No Gemini API keys found in .env file")

settings = Config()
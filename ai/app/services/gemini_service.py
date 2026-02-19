from google.genai import Client, types
from itertools import cycle
from core.config import settings
from models.analysis import EmailAnalysis
from costing.cost_manager import CostManager
import time
from dotenv import load_dotenv
import os

load_dotenv()

class GeminiService:
    def __init__(self):
        self.key_pool = cycle(settings.GEMINI_KEYS)
        self._set_new_client()
        self.cost_manager = CostManager(cost_file="model_prices.json")
        self.model_id = os.getenv("Gemini_Engine")

    def _set_new_client(self):
        current_key = next(self.key_pool)
        self.client = Client(api_key=current_key)

    def analyze_email(self, text_content: str = "", file_bytes: bytes = None, mime_type: str = None):
        start_time = time.perf_counter()
        
        instruction = "You are a professional email and invoice analyst. Provide structured data."
        contents = [text_content] if text_content else []
        if file_bytes:
            contents.append(types.Part.from_bytes(data=file_bytes, mime_type=mime_type))

        try:
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=contents,
                config=types.GenerateContentConfig(
                    system_instruction=instruction,
                    response_mime_type="application/json",
                    response_schema=EmailAnalysis,
                ),
            )
            
            
            usage = response.usage_metadata
            self.cost_manager.log_usage(
                model_name=self.model_id,
                input_tokens=usage.prompt_token_count,
                output_tokens=usage.candidates_token_count
            )

            cost_report = self.cost_manager.generate_total()
           
            analysis_data = response.parsed 
            end_time = time.perf_counter()
            
            return {
                "analysis": analysis_data,
                "time_taken": round(end_time - start_time, 2),
                "llm_cost_analysis": cost_report
            }

        except Exception as e:
            if "429" in str(e) or "quota" in str(e).lower():
                self._set_new_client()
                return self.analyze_email(text_content, file_bytes, mime_type)
            raise e
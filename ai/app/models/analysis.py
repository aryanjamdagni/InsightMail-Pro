from pydantic import BaseModel, Field
from enum import Enum
from typing import Optional,Dict, Any

class CostAnalysis(BaseModel):
    total_input_tokens: int
    total_output_tokens: int
    total_input_cost: float
    total_output_cost: float
    total_cost: float
    cost_by_model: Dict[str, float]



class SentimentEnum(str, Enum):
    POSITIVE = "Positive"
    NEUTRAL = "Neutral"
    NEGATIVE = "Negative"

class EmailAnalysis(BaseModel):
    """Schema for the structured analysis of an email/invoice."""
    
    multi_lingual: bool = Field(
        description="Whether the email contains text in more than one language."
    )
    multi_intent: bool = Field(
        description="Whether the sender has multiple goals or requests in the email."
    )
    sentiment: SentimentEnum = Field(
        description="The emotional tone of the email (Positive, Neutral, or Negative)."
    )
    summary_markdown: str = Field(
        description="A professional summary of the email formatted in Markdown (using headers, bullet points, etc.)."
    )

class AnalysisResponse(BaseModel):
    """The final object returned to the frontend including metadata."""
    data: EmailAnalysis
    time_taken: float = Field(description="Time taken in seconds to process the request.")
    llm_cost_analysis: CostAnalysis
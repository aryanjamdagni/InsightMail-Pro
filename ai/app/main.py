from fastapi import FastAPI
from contextlib import asynccontextmanager
from api.endpoints import router as api_router
from costing.price_updater import update_model_prices 

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Server starting: Updating model prices...")
    try:
        update_model_prices()
    except Exception as e:
        print(f"⚠️ Failed to update prices on startup: {e}")
    
    yield 
    print("🛑 Server shutting down: Cleaning up resources...")

app = FastAPI(title="Smart Email Summarizer", lifespan=lifespan)

app.include_router(api_router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
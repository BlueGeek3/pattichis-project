from fastapi import FastAPI
from pydantic import BaseModel
import time

app = FastAPI(title="Pattichis API", version="0.1.0")
START = time.time()

class Health(BaseModel):
    status: str
    version: str | None = None
    uptime: float | None = None

@app.get(
    "/healthz",
    response_model=Health,
    responses={
        200: {
            "description": "Service health",
            "content": {
                "application/json": {
                    "example": {"status": "ok", "version": "0.1.0", "uptime": 3.14}
                }
            },
        }
    },
)
def healthz():
    return {"status": "ok", "version": "0.1.0", "uptime": round(time.time() - START, 2)}
